import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authorize } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = await authorize("organiser", "admin");
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const staff = searchParams.get("staff");

  let query = `
    SELECT b.*, u.full_name as customer_name, u.email as customer_email, 
           a.name as appointment_name, p_u.full_name as provider_name
    FROM bookings b
    JOIN users u ON b.customer_id = u.id
    JOIN appointments a ON b.appointment_id = a.id
    JOIN providers p ON b.provider_id = p.id
    JOIN users p_u ON p.user_id = p_u.id
    WHERE 1=1
  `;

  const params: any[] = [];

  // Organisers only see bookings for their own appointments (ownership)
  if (auth.user.role === "organiser") {
    query += " AND a.organiser_id = ?";
    params.push(auth.user.id);
  }

  if (status) {
    query += " AND b.status = ?";
    params.push(status);
  }
  if (staff) {
    query += " AND b.provider_id = ?";
    params.push(staff);
  }

  query += " ORDER BY b.slot_date DESC, b.start_time DESC";

  const rows = db.prepare(query).all(...params);

  return NextResponse.json({ data: rows });
}

export async function POST(req: NextRequest) {
  const auth = await authorize();
  const body = await req.json();
  const { appointmentId, providerId, slotId, customerId, peopleCount = 1, answers = {} } = body;
  const resolvedCustomerId = auth.ok ? auth.user.id : (customerId || "usr_cust_1");

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
      .run(bookingId, appointmentId, resolvedCustomerId, providerId, slotId, slot.slot_date, slot.start_time, slot.end_time, peopleCount, status);
    
    // Insert answers
    const insertAnswer = db.prepare(`INSERT INTO booking_answers (id, booking_id, question_key, answer_value) VALUES (?, ?, ?, ?)`);
    Object.entries(answers).forEach(([key, val]) => {
      insertAnswer.run(randomUUID(), bookingId, key, String(val));
    });

    db.prepare("UPDATE slots SET status = 'full' WHERE id = ? AND capacity_booked >= capacity_total").run(slotId);
  });
  tx();

  if (!reserved) {
    return NextResponse.json({ error: "Slot not available" }, { status: 409 });
  }

  return NextResponse.json({ data: { id: bookingId, status } }, { status: 201 });
}
