import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authorize } from "@/lib/auth";

// GET /api/admin/audit — admin-only: view audit log
export async function GET() {
  const auth = await authorize("admin");
  if (!auth.ok) return auth.response;

  const rows = db
    .prepare(
      `SELECT a.*, u.full_name as admin_name
       FROM admin_audit a
       JOIN users u ON a.admin_id = u.id
       ORDER BY a.created_at DESC
       LIMIT 100`
    )
    .all() as any[];

  return NextResponse.json({ data: rows });
}
