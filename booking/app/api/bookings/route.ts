import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { appointmentId, providerId, slotId, customerId = "usr_cust_1", peopleCount = 1 } = body;

  if (!appointmentId || !providerId || !slotId) {
    return NextResponse.json({ error: "appointmentId, providerId, slotId are required" }, { status: 400 });
  }

  const slot = db.prepare(`SELECT id, slot_date, start_time, end_time, capacity_total, capacity_booked, status FROM slots WHERE id = ? AND appointment_id = ? AND provider_id = ?`).get(slotId, appointmentId, providerId) as any;
  if (!slot) return NextResponse.json({ error: "Slot not found" }, { status: 404 });
  if (slot.status !== "available" || slot.capacity_booked + peopleCount > slot.capacity_total) {
    return NextResponse.json({ error: "Slot not available" }, { status: 409 });
  }

  const appointment = db.prepare("SELECT manual_confirmation FROM appointments WHERE id = ?").get(appointmentId) as any;
  const status = appointment?.manual_confirmation ? "reserved" : "confirmed";

  const bookingId = randomUUID();
  let reserved = false;
  const tx = db.transaction(() => {
    const reserveResult = db
      .prepare(
        `UPDATE slots
         SET capacity_booked = capacity_booked + ?
         WHERE id = ?
           AND status = 'available'
           AND capacity_booked + ? <= capacity_total`,
      )
      .run(peopleCount, slotId, peopleCount);

    if (reserveResult.changes !== 1) {
      return;
    }

    reserved = true;

    db.prepare(`INSERT INTO bookings (id, appointment_id, customer_id, provider_id, slot_id, slot_date, start_time, end_time, people_count, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(bookingId, appointmentId, customerId, providerId, slotId, slot.slot_date, slot.start_time, slot.end_time, peopleCount, status);
    db.prepare("UPDATE slots SET status = 'full' WHERE id = ? AND capacity_booked >= capacity_total").run(slotId);
  });
  tx();

  if (!reserved) {
    return NextResponse.json({ error: "Slot not available" }, { status: 409 });
  }

  return NextResponse.json({ data: { id: bookingId, status } }, { status: 201 });
}
