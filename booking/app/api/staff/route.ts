import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authorize } from "@/lib/auth";

export async function GET() {
  // Only organiser and admin can view staff list
  const auth = await authorize("organiser", "admin");
  if (!auth.ok) return auth.response;

  const users = db.prepare(`
    SELECT u.id, u.full_name, u.email, u.role
    FROM users u
    WHERE u.role IN ('provider', 'organiser')
  `).all() as any[];

  return NextResponse.json(users);
}
