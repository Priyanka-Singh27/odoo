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
    SELECT 
      b.*,
      u.full_name as customer_name, 
      u.email as customer_email, 
      a.name as appointment_name,
      CASE 
        WHEN b.provider_id IS NOT NULL THEN p_u.full_name 
        ELSE r.name 
      END as provider_or_resource_name,
      CASE 
        WHEN b.provider_id IS NOT NULL THEN 'provider' 
        ELSE 'resource' 
      END as booking_type
    FROM bookings b
    JOIN users u ON b.customer_id = u.id
    JOIN appointments a ON b.appointment_id = a.id
    LEFT JOIN providers p ON b.provider_id = p.id
    LEFT JOIN users p_u ON p.user_id = p_u.id
    LEFT JOIN resources r ON b.resource_id = r.id
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
    query += " AND (b.provider_id = ? OR b.resource_id = ?)";
    params.push(staff, staff);
  }

  query += " ORDER BY b.slot_date DESC, b.start_time DESC";

  const rows = db.prepare(query).all(...params);

  return NextResponse.json({ data: rows });
}

export async function POST(req: NextRequest) {
  const auth = await authorize();
  const body = await req.json();
  const { 
    appointmentId, 
    providerId, 
    slotId, 
    resourceId, 
    resourceSlotId,
    customerId, 
    peopleCount = 1, 
    answers = {} 
  } = body;
  
  const resolvedCustomerId = auth.ok ? auth.user.id : (customerId || "usr_cust_1");

  // Validate: must have either (providerId + slotId) OR (resourceId + resourceSlotId)
  const isProviderBooking = providerId && slotId;
  const isResourceBooking = resourceId && resourceSlotId;
  
  if (!appointmentId || (!isProviderBooking && !isResourceBooking)) {
    return NextResponse.json({ 
      error: "appointmentId and either (providerId+slotId) OR (resourceId+resourceSlotId) are required" 
    }, { status: 400 });
  }

  if (isProviderBooking && isResourceBooking) {
    return NextResponse.json({ 
      error: "Cannot book both provider and resource in same booking" 
    }, { status: 400 });
  }

  const appointment = db.prepare("SELECT manual_confirmation FROM appointments WHERE id = ?").get(appointmentId) as any;
  const bookingStatus = appointment?.manual_confirmation ? "reserved" : "confirmed";

  const bookingId = randomUUID();
  let reserved = false;

  const tx = db.transaction(() => {
    if (isProviderBooking) {
      const slot = db.prepare(`
        SELECT id, slot_date, start_time, end_time, capacity_total, capacity_booked, status 
        FROM slots 
        WHERE id = ? AND appointment_id = ? AND provider_id = ?
      `).get(slotId, appointmentId, providerId) as any;
      
      if (!slot) {
        throw new Error("Slot not found");
      }
      
      if (slot.status !== "available" || slot.capacity_booked + peopleCount > slot.capacity_total) {
        throw new Error("Slot not available");
      }

      const reserveResult = db.prepare(`
        UPDATE slots
        SET capacity_booked = capacity_booked + ?
        WHERE id = ?
          AND status = 'available'
          AND capacity_booked + ? <= capacity_total
      `).run(peopleCount, slotId, peopleCount);

      if (reserveResult.changes !== 1) {
        throw new Error("Slot reservation failed");
      }

      reserved = true;

      db.prepare(`
        INSERT INTO bookings 
        (id, appointment_id, customer_id, provider_id, slot_id, slot_date, start_time, end_time, people_count, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(bookingId, appointmentId, resolvedCustomerId, providerId, slotId, slot.slot_date, slot.start_time, slot.end_time, peopleCount, bookingStatus);

      db.prepare("UPDATE slots SET status = 'full' WHERE id = ? AND capacity_booked >= capacity_total").run(slotId);

    } else if (isResourceBooking) {
      const resourceSlot = db.prepare(`
        SELECT id, slot_date, start_time, end_time, capacity_total, capacity_booked, status 
        FROM resource_slots 
        WHERE id = ? AND appointment_id = ? AND resource_id = ?
      `).get(resourceSlotId, appointmentId, resourceId) as any;
      
      if (!resourceSlot) {
        throw new Error("Resource slot not found");
      }
      
      if (resourceSlot.status !== "available" || resourceSlot.capacity_booked + peopleCount > resourceSlot.capacity_total) {
        throw new Error("Resource slot not available");
      }

      const reserveResult = db.prepare(`
        UPDATE resource_slots
        SET capacity_booked = capacity_booked + ?
        WHERE id = ?
          AND status = 'available'
          AND capacity_booked + ? <= capacity_total
      `).run(peopleCount, resourceSlotId, peopleCount);

      if (reserveResult.changes !== 1) {
        throw new Error("Resource slot reservation failed");
      }

      reserved = true;

      db.prepare(`
        INSERT INTO bookings 
        (id, appointment_id, customer_id, resource_id, resource_slot_id, slot_date, start_time, end_time, people_count, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(bookingId, appointmentId, resolvedCustomerId, resourceId, resourceSlotId, resourceSlot.slot_date, resourceSlot.start_time, resourceSlot.end_time, peopleCount, bookingStatus);

      db.prepare("UPDATE resource_slots SET status = 'full' WHERE id = ? AND capacity_booked >= capacity_total").run(resourceSlotId);
    }
  });

  try {
    tx();
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 409 });
  }

  if (!reserved) {
    return NextResponse.json({ error: "Slot not available" }, { status: 409 });
  }

  // Insert answers
  const insertAnswer = db.prepare(`INSERT INTO booking_answers (id, booking_id, question_key, answer_value) VALUES (?, ?, ?, ?)`);
  Object.entries(answers).forEach(([key, val]) => {
    insertAnswer.run(randomUUID(), bookingId, key, String(val));
  });

  return NextResponse.json({ data: { id: bookingId, status: bookingStatus } }, { status: 201 });
}
