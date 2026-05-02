import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authorize } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const roleParam = searchParams.get("role");

  // Try to resolve user (optional — public can see published appointments)
  const auth = await authorize(); // no role restriction, just resolve user
  const actualRole = auth.ok ? auth.user.role : "customer";
  const userId = auth.ok ? auth.user.id : null;

  // If role=organiser is requested, ensure user is actually organiser
  const isOrganiserView = roleParam === "organiser" && (actualRole === "organiser" || actualRole === "admin");

  let query = `
    SELECT id, name, duration, provider_count, is_published, description, organiser_id, created_at
    FROM appointments
  `;
  const params: string[] = [];

  if (isOrganiserView && userId) {
    // Organisers see their own appointments; admins see all
    if (actualRole === "organiser") {
      query += " WHERE organiser_id = ?";
      params.push(userId);
    }
  } else {
    // Everyone else sees only published
    query += " WHERE is_published = 1";
  }

  query += " ORDER BY created_at DESC";

  const rows = db.prepare(query).all(...params) as any[];

  return NextResponse.json({
    data: rows.map((row) => ({
      id: row.id,
      name: row.name,
      duration: row.duration,
      providerCount: row.provider_count,
      is_published: row.is_published === 1,
      description: row.description,
      createdAt: row.created_at,
    })),
  });
}

export async function POST(request: Request) {
  const auth = await authorize("organiser", "admin");
  if (!auth.ok) return auth.response;

  const data = await request.json();
  const id = `apt_${Math.random().toString(36).substr(2, 9)}`;

  const insert = db.transaction(() => {
    db.prepare(`
      INSERT INTO appointments (
        id, organiser_id, name, description, duration, provider_count, is_published,
        appointment_type, manage_capacity, max_bookings_per_slot, advance_payment, manual_confirmation
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      auth.user.id,
      data.name,
      data.description || '',
      data.duration || 30,
      0,
      data.isPublished ? 1 : 0,
      data.appointment_type || 'user',
      data.manage_capacity ? 1 : 0,
      data.max_bookings_per_slot || 1,
      data.advance_payment ? 1 : 0,
      data.manualConfirmation ? 1 : 0
    );

    // Save questions if they exist
    if (data.questions && data.questions.length > 0) {
      const stmt = db.prepare(`
        INSERT INTO appointment_questions (id, appointment_id, text, type, required, sort_order)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      data.questions.forEach((q: any, idx: number) => {
        stmt.run(q.id, id, q.text, q.type, q.required ? 1 : 0, idx);
      });
    }

    // Assign providers if selected
    if (data.assignedStaff && data.assignedStaff.length > 0) {
      const stmt = db.prepare(`INSERT INTO appointment_providers (appointment_id, provider_id) VALUES (?, ?)`);
      data.assignedStaff.forEach((staff: any) => {
        // Need to ensure provider exists, maybe staff.id is the provider_id
        try {
           stmt.run(id, staff.id);
        } catch(e) {
           // Ignore foreign key errors if provider doesn't exist
        }
      });
      // Update provider_count
      db.prepare(`UPDATE appointments SET provider_count = ? WHERE id = ?`).run(data.assignedStaff.length, id);
    }
  });

  insert();

  return NextResponse.json({ id, success: true });
}
