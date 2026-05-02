import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const row = db.prepare(`SELECT b.id, b.status, b.payment_status, b.slot_date, b.start_time, b.end_time, b.people_count, a.id as appointment_id, a.name as appointment_name, u.full_name as provider_name FROM bookings b JOIN appointments a ON a.id = b.appointment_id JOIN providers p ON p.id = b.provider_id JOIN users u ON u.id = p.user_id WHERE b.id = ?`).get(id) as any;
  if (!row) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  return NextResponse.json({ data: { id: row.id, status: row.status, paymentStatus: row.payment_status, date: row.slot_date, startTime: row.start_time, endTime: row.end_time, peopleCount: row.people_count, appointment: { id: row.appointment_id, name: row.appointment_name }, providerName: row.provider_name } });
}
