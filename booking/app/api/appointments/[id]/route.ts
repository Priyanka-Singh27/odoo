import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { resolveUserRole } from "@/lib/role";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  
  const appointment = db.prepare(`SELECT * FROM appointments WHERE id = ?`).get(id) as any;
  if (!appointment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(appointment);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const role = await resolveUserRole();
  if (role !== 'organiser') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const data = await request.json();
  
  if (data.isPublished !== undefined) {
    db.prepare(`UPDATE appointments SET is_published = ? WHERE id = ?`)
      .run(data.isPublished ? 1 : 0, id);
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const role = await resolveUserRole();
  if (role !== 'organiser') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  db.prepare(`DELETE FROM appointments WHERE id = ?`).run(id);

  return NextResponse.json({ success: true });
}
