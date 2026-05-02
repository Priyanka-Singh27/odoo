import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { resolveUserRole } from "@/lib/role";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const roleParam = searchParams.get("role");
  const actualRole = await resolveUserRole();

  // If role=organiser is requested, ensure user is actually organiser
  const isOrganiserView = roleParam === "organiser" && actualRole === "organiser";

  let query = `
    SELECT id, name, duration, provider_count, is_published, description, created_at
    FROM appointments
  `;

  if (!isOrganiserView) {
    query += " WHERE is_published = 1 ";
  }

  query += " ORDER BY created_at DESC";

  const rows = db.prepare(query).all() as any[];

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
  const role = await resolveUserRole();
  if (role !== 'organiser') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const data = await request.json();
  const id = `apt_${Math.random().toString(36).substr(2, 9)}`;
  
  db.prepare(`
    INSERT INTO appointments (id, organiser_id, name, description, duration, provider_count, is_published)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, 
    'usr_org_1', // Hardcoded for now as per project context
    data.name, 
    data.description || '', 
    data.duration || 30, 
    0, 
    data.isPublished ? 1 : 0
  );

  return NextResponse.json({ id, success: true });
}
