import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await req.json();
  const { slotId } = body;
  if (!slotId) return NextResponse.json({ error: "slotId is required" }, { status: 400 });

  const booking = db.prepare("SELECT id, appointment_id, provider_id, slot_id, people_count, status FROM bookings WHERE id = ?").get(id) as any;
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (booking.status === "cancelled") return NextResponse.json({ error: "Cancelled booking cannot be rescheduled" }, { status: 409 });

  const newSlot = db.prepare("SELECT id, slot_date, start_time, end_time, capacity_total, capacity_booked, status FROM slots WHERE id = ? AND appointment_id = ? AND provider_id = ?").get(slotId, booking.appointment_id, booking.provider_id) as any;
  if (!newSlot) return NextResponse.json({ error: "Target slot not found" }, { status: 404 });
  if (newSlot.status !== "available" || newSlot.capacity_booked + booking.people_count > newSlot.capacity_total) return NextResponse.json({ error: "Target slot not available" }, { status: 409 });

  const tx = db.transaction(() => {
    db.prepare("UPDATE slots SET capacity_booked = MAX(0, capacity_booked - ?) WHERE id = ?").run(booking.people_count, booking.slot_id);
    db.prepare("UPDATE slots SET status = 'available' WHERE id = ?").run(booking.slot_id);
    db.prepare("UPDATE slots SET capacity_booked = capacity_booked + ? WHERE id = ?").run(booking.people_count, slotId);
    db.prepare("UPDATE slots SET status = 'full' WHERE id = ? AND capacity_booked >= capacity_total").run(slotId);
    db.prepare("UPDATE bookings SET slot_id = ?, slot_date = ?, start_time = ?, end_time = ? WHERE id = ?").run(slotId, newSlot.slot_date, newSlot.start_time, newSlot.end_time, id);
  });
  tx();

  return NextResponse.json({ data: { id, slotId, date: newSlot.slot_date, startTime: newSlot.start_time, endTime: newSlot.end_time } });
}
