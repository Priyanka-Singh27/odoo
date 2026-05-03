import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authorize } from "@/lib/auth";

export async function GET() {
  const auth = await authorize("customer", "organiser", "admin");
  if (!auth.ok) return auth.response;

  const user = db
    .prepare("SELECT id, full_name, email FROM users WHERE id = ?")
    .get(auth.user.id) as { id: string; full_name: string; email: string } | undefined;

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const bookings = db.prepare(`
    SELECT 
      b.id, b.slot_date, b.start_time, b.status, b.people_count, 
      a.name as appointment_name, a.location, a.duration,
      u.full_name as provider_name
    FROM bookings b
    JOIN appointments a ON a.id = b.appointment_id
    JOIN providers p ON p.id = b.provider_id
    JOIN users u ON u.id = p.user_id
    WHERE b.customer_id = ?
    ORDER BY b.slot_date DESC, b.start_time DESC
  `).all(auth.user.id);

  return NextResponse.json({
    user: {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
    },
    bookings,
  });
}

export async function PATCH(request: Request) {
  const auth = await authorize("customer", "organiser", "admin");
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";

  if (!fullName || fullName.length < 2) {
    return NextResponse.json({ error: "Full name must be at least 2 characters" }, { status: 400 });
  }

  db.prepare("UPDATE users SET full_name = ?, updated_at = strftime('%s','now') WHERE id = ?").run(fullName, auth.user.id);

  return NextResponse.json({ success: true });
}
