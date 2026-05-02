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

  db.prepare(`
    INSERT INTO appointments (id, organiser_id, name, description, duration, provider_count, is_published)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    auth.user.id, // Use actual logged-in user instead of hardcoded ID
    data.name,
    data.description || '',
    data.duration || 30,
    0,
    data.isPublished ? 1 : 0
  );

  return NextResponse.json({ id, success: true });
}
