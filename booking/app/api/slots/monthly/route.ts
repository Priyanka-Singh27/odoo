import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const appointmentId = searchParams.get("appointmentId");
  const providerId = searchParams.get("providerId");
  const month = searchParams.get("month"); // Format: YYYY-MM

  if (!appointmentId || !providerId || !month) {
    return NextResponse.json({ error: "appointmentId, providerId and month are required" }, { status: 400 });
  }

  const monthPattern = `${month}-%`;

  const availableDates = db.prepare(`
    SELECT DISTINCT slot_date 
    FROM slots 
    WHERE appointment_id = ? 
      AND provider_id = ? 
      AND slot_date LIKE ? 
      AND status = 'available' 
      AND capacity_booked < capacity_total
  `).all(appointmentId, providerId, monthPattern);

  return NextResponse.json({ 
    availableDates: availableDates.map((row: any) => row.slot_date) 
  });
}
