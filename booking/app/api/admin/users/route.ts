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
    WHERE id != ?
    ORDER BY created_at DESC`
  ).all(sessionUser.id);

  return NextResponse.json({ data: rows });
}
