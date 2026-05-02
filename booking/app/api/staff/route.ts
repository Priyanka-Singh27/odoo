import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const users = db.prepare(`
    SELECT u.id, u.full_name, u.email, u.role
    FROM users u
    WHERE u.role IN ('provider', 'organiser')
  `).all() as any[];

  return NextResponse.json(users);
}
