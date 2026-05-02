import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let sessionUser;
  try {
    sessionUser = await requireAdmin();
  } catch (response) {
    return response as NextResponse;
  }

  if (id === sessionUser.id) {
    return NextResponse.json(
      { message: "You cannot modify your own account." },
      { status: 403 }
    );
  }

  const body = await req.json();
  const now = Math.floor(Date.now() / 1000);

  if ("role" in body) {
    const validRoles = ["customer", "organiser", "admin", "provider"];
    if (!validRoles.includes(body.role)) {
      return NextResponse.json({ message: "Invalid role." }, { status: 400 });
    }
    db.prepare(`UPDATE users SET role = ?, updated_at = ? WHERE id = ?`).run(
      body.role,
      now,
      id
    );
  }

  if ("is_active" in body) {
    db.prepare(`UPDATE users SET is_active = ?, updated_at = ? WHERE id = ?`).run(
      body.is_active ? 1 : 0,
      now,
      id
    );
  }

  return NextResponse.json({ success: true });
}
