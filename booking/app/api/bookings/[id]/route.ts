import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authorize, logAdminAction } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const booking = db.prepare(`
    SELECT b.*, u.full_name as customer_name, u.email as customer_email, 
           a.name as appointment_name, a.location as venue, p_u.full_name as provider_name
    FROM bookings b
    JOIN users u ON b.customer_id = u.id
    JOIN appointments a ON b.appointment_id = a.id
    JOIN providers p ON b.provider_id = p.id
    JOIN users p_u ON p.user_id = p_u.id
    WHERE b.id = ?
  `).get(id) as any;

  if (!booking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const answers = db.prepare(`SELECT question_key, answer_value FROM booking_answers WHERE booking_id = ?`).all(id) as any[];
  booking.answers = answers;

  return NextResponse.json(booking);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = await authorize("organiser", "admin");
  if (!auth.ok) return auth.response;

  const data = await request.json();
  const { status } = data; // 'confirmed' or 'cancelled'

  if (status === 'confirmed') {
    db.prepare(`UPDATE bookings SET status = 'confirmed' WHERE id = ?`).run(id);
  } else if (status === 'cancelled') {
    const tx = db.transaction(() => {
      const booking = db.prepare(`SELECT slot_id, people_count FROM bookings WHERE id = ?`).get(id) as any;
      if (booking) {
        db.prepare(`UPDATE slots SET capacity_booked = capacity_booked - ?, status = 'available' WHERE id = ?`)
          .run(booking.people_count, booking.slot_id);
        db.prepare(`UPDATE bookings SET status = 'cancelled' WHERE id = ?`).run(id);
      }
    });
    tx();
  }

  // Audit log for admin actions
  if (auth.user.role === "admin") {
    logAdminAction(auth.user.id, `booking.${status}`, { bookingId: id });
  }

  return NextResponse.json({ success: true });
}
