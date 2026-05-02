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
  
  // Build a dynamic SET clause based on provided data
  const updates: string[] = [];
  const sqlParams: any[] = [];

  if (data.name !== undefined) { updates.push("name = ?"); sqlParams.push(data.name); }
  if (data.description !== undefined) { updates.push("description = ?"); sqlParams.push(data.description); }
  if (data.duration !== undefined) { updates.push("duration = ?"); sqlParams.push(data.duration); }
  if (data.appointment_type !== undefined) { updates.push("appointment_type = ?"); sqlParams.push(data.appointment_type); }
  if (data.isPublished !== undefined) { updates.push("is_published = ?"); sqlParams.push(data.isPublished ? 1 : 0); }
  if (data.manage_capacity !== undefined) { updates.push("manage_capacity = ?"); sqlParams.push(data.manage_capacity ? 1 : 0); }
  if (data.max_bookings_per_slot !== undefined) { updates.push("max_bookings_per_slot = ?"); sqlParams.push(data.max_bookings_per_slot); }
  if (data.advance_payment !== undefined) { updates.push("advance_payment = ?"); sqlParams.push(data.advance_payment ? 1 : 0); }
  if (data.manualConfirmation !== undefined) { updates.push("manual_confirmation = ?"); sqlParams.push(data.manualConfirmation ? 1 : 0); }

  const update = db.transaction(() => {
    if (updates.length > 0) {
      db.prepare(`UPDATE appointments SET ${updates.join(', ')} WHERE id = ?`)
        .run(...sqlParams, id);
    }

    if (data.questions !== undefined) {
      db.prepare(`DELETE FROM appointment_questions WHERE appointment_id = ?`).run(id);
      if (data.questions.length > 0) {
        const stmt = db.prepare(`
          INSERT INTO appointment_questions (id, appointment_id, text, type, required, sort_order)
          VALUES (?, ?, ?, ?, ?, ?)
        `);
        data.questions.forEach((q: any, idx: number) => {
          stmt.run(q.id, id, q.text, q.type, q.required ? 1 : 0, idx);
        });
      }
    }

    if (data.assignedStaff !== undefined) {
      db.prepare(`DELETE FROM appointment_providers WHERE appointment_id = ?`).run(id);
      if (data.assignedStaff.length > 0) {
        const stmt = db.prepare(`INSERT INTO appointment_providers (appointment_id, provider_id) VALUES (?, ?)`);
        data.assignedStaff.forEach((staff: any) => {
          try { stmt.run(id, staff.id); } catch(e) {}
        });
        db.prepare(`UPDATE appointments SET provider_count = ? WHERE id = ?`).run(data.assignedStaff.length, id);
      } else {
        db.prepare(`UPDATE appointments SET provider_count = 0 WHERE id = ?`).run(id);
      }
    }
  });

  update();

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
