import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  let sessionUser;
  try {
    sessionUser = await requireAdmin();
  } catch (response) {
    return response as NextResponse;
  }

  const rows = db.prepare(
    `SELECT
      id,
      full_name,
      email,
      role,
      is_active,
      is_verified,
      created_at
    FROM users
    WHERE role = 'organiser'
    ORDER BY created_at DESC`
  ).all();

  // Also get some stats for the header
  const stats = db.prepare(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active,
      SUM(CASE WHEN is_verified = 1 THEN 1 ELSE 0 END) as verified
    FROM users
    WHERE role = 'organiser'
  `).get() as any;

  return NextResponse.json({ 
    data: rows,
    stats: {
      total: stats.total || 0,
      active: stats.active || 0,
      verified: stats.verified || 0
    }
  });
}
