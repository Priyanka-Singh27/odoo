import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authorize } from "@/lib/auth";
import crypto from "crypto";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authorize("organiser", "admin");
  if (!auth.ok) return auth.response;

  const { id } = await params;

  // Check if appointment exists and belongs to user
  const apt = db.prepare(`SELECT id, share_token FROM appointments WHERE id = ?`).get(id) as any;
  
  if (!apt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let token = apt.share_token;
  if (!token) {
    token = crypto.randomBytes(24).toString('hex');
    db.prepare(`UPDATE appointments SET share_token = ? WHERE id = ?`).run(token, id);
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  return NextResponse.json({ url: `${baseUrl}/book/${token}` });
}
