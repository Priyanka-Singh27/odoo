import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
  } catch (response) {
    return response as NextResponse;
  }

  const rows = db.prepare(
    `SELECT
      b.id,
      u.full_name as customer_name,
      a.name as service_name,
      pu.full_name as provider_name,
      b.slot_date,
      b.start_time,
      b.status
    FROM bookings b
    JOIN users u ON b.customer_id = u.id
    JOIN appointments a ON b.appointment_id = a.id
    JOIN providers p ON b.provider_id = p.id
    JOIN users pu ON p.user_id = pu.id
    ORDER BY b.created_at DESC
    LIMIT 10`
  ).all();

  return NextResponse.json({ data: rows });
}
