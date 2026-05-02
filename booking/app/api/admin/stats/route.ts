import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
  } catch (response) {
    return response as NextResponse;
  }

  const now = Math.floor(Date.now() / 1000);
  const weekAgo = now - 7 * 24 * 60 * 60;
  const today = new Date().toISOString().split("T")[0];

  const totalUsers = (db.prepare(`SELECT COUNT(*) as c FROM users WHERE role != 'admin'`).get() as { c: number }).c;
  const totalProviders = (db.prepare(`SELECT COUNT(*) as c FROM providers`).get() as { c: number }).c;
  const totalAppointments = (db.prepare(`SELECT COUNT(*) as c FROM bookings`).get() as { c: number }).c;

  const newUsersThisWeek = (
    db.prepare(`SELECT COUNT(*) as c FROM users WHERE created_at >= ? AND role != 'admin'`).get(weekAgo) as { c: number }
  ).c;

  const newProvidersThisWeek = (
    db.prepare(
      `SELECT COUNT(*) as c
       FROM providers p
       JOIN users u ON p.user_id = u.id
       WHERE u.created_at >= ?`
    ).get(weekAgo) as { c: number }
  ).c;

  const appointmentsToday = (db.prepare(`SELECT COUNT(*) as c FROM bookings WHERE slot_date = ?`).get(today) as { c: number }).c;

  return NextResponse.json({
    totalUsers,
    totalProviders,
    totalAppointments,
    newUsersThisWeek,
    newProvidersThisWeek,
    appointmentsToday,
  });
}
