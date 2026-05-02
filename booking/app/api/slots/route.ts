import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const appointmentId = searchParams.get("appointmentId");
  const providerId = searchParams.get("providerId");
  const date = searchParams.get("date");

  if (!appointmentId || !providerId || !date) {
    return NextResponse.json({ error: "appointmentId, providerId and date are required" }, { status: 400 });
  }

  const slots = db.prepare(`SELECT id, start_time, end_time, capacity_total, capacity_booked, status FROM slots WHERE appointment_id = ? AND provider_id = ? AND slot_date = ? ORDER BY start_time`).all(appointmentId, providerId, date);

  return NextResponse.json({ data: slots.map((s: any) => ({ id: s.id, startTime: s.start_time, endTime: s.end_time, remainingCapacity: s.capacity_total - s.capacity_booked, isAvailable: s.status === 'available' && s.capacity_booked < s.capacity_total })) });
}
