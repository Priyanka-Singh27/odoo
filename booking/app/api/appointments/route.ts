import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const rows = db
    .prepare(
      `SELECT id, name, duration, provider_count, is_published
       FROM appointments
       WHERE is_published = 1
       ORDER BY created_at DESC`,
    )
    .all() as {
    id: string;
    name: string;
    duration: number;
    provider_count: number;
    is_published: number;
  }[];

  return NextResponse.json({
    data: rows.map((row) => ({
      id: row.id,
      name: row.name,
      duration: row.duration,
      providerCount: row.provider_count,
      isPublished: row.is_published === 1,
    })),
  });
}
