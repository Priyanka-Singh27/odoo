import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const appointment = db.prepare(`SELECT id, name, description, duration, provider_count, is_published, manage_capacity, max_bookings_per_slot, advance_payment, manual_confirmation FROM appointments WHERE id = ?`).get(id) as any;

  if (!appointment) return NextResponse.json({ error: "Appointment not found" }, { status: 404 });

  const providers = db.prepare(`SELECT p.id, u.full_name, p.specialty FROM appointment_providers ap JOIN providers p ON p.id = ap.provider_id JOIN users u ON u.id = p.user_id WHERE ap.appointment_id = ?`).all(id);

  return NextResponse.json({ data: { id: appointment.id, name: appointment.name, description: appointment.description, duration: appointment.duration, providerCount: appointment.provider_count, isPublished: appointment.is_published === 1, manageCapacity: appointment.manage_capacity === 1, maxBookingsPerSlot: appointment.max_bookings_per_slot, advancePayment: appointment.advance_payment === 1, manualConfirmation: appointment.manual_confirmation === 1, providers } });
}
