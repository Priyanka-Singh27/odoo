import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const booking = db.prepare("SELECT id, slot_id, people_count, status FROM bookings WHERE id = ?").get(id) as any;
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (booking.status === "cancelled") return NextResponse.json({ data: { id, status: "cancelled" } });

  const tx = db.transaction(() => {
    db.prepare("UPDATE bookings SET status = 'cancelled' WHERE id = ?").run(id);
    db.prepare("UPDATE slots SET capacity_booked = MAX(0, capacity_booked - ?) WHERE id = ?").run(booking.people_count, booking.slot_id);
    db.prepare("UPDATE slots SET status = 'available' WHERE id = ?").run(booking.slot_id);
  });
  tx();

  return NextResponse.json({ data: { id, status: "cancelled" } });
}
