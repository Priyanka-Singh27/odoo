import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authorize, verifyOwnership, logAdminAction } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const appointment = db.prepare(`SELECT * FROM appointments WHERE id = ?`).get(id) as any;
  if (!appointment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const providers = db.prepare(`
    SELECT p.id, u.full_name as name, p.specialty
    FROM appointment_providers ap
    JOIN providers p ON p.id = ap.provider_id
    JOIN users u ON u.id = p.user_id
    WHERE ap.appointment_id = ?
    ORDER BY u.full_name ASC
  `).all(id) as Array<{ id: string; name: string; specialty: string | null }>;

  return NextResponse.json({
    ...appointment,
    providers,
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = await authorize("organiser", "admin");
  if (!auth.ok) return auth.response;

  // Ownership check: organisers can only edit their own appointments
  const ownership = verifyOwnership("appointments", id, auth.user.id, auth.user.role);
  if (!ownership.allowed) return ownership.response!;

  const data = await request.json();
  
  if (data.isPublished !== undefined) {
    db.prepare(`UPDATE appointments SET is_published = ? WHERE id = ?`)
      .run(data.isPublished ? 1 : 0, id);
  }

  // Audit log for admin actions
  if (auth.user.role === "admin") {
    logAdminAction(auth.user.id, "appointment.update", { appointmentId: id, changes: data });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = await authorize("organiser", "admin");
  if (!auth.ok) return auth.response;

  // Ownership check
  const ownership = verifyOwnership("appointments", id, auth.user.id, auth.user.role);
  if (!ownership.allowed) return ownership.response!;

  db.prepare(`DELETE FROM appointments WHERE id = ?`).run(id);

  // Audit log for admin actions
  if (auth.user.role === "admin") {
    logAdminAction(auth.user.id, "appointment.delete", { appointmentId: id });
  }

  return NextResponse.json({ success: true });
}
