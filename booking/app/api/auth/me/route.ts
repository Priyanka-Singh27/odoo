import { NextResponse } from "next/server";
import { resolveUserRole } from "@/lib/role";
import db from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const payload = await verifyToken(token);
  if (!payload || !payload.userId) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  try {
    const user = db.prepare("SELECT full_name, email, avatar_url FROM users WHERE id = ?").get(payload.userId) as any;
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json({
      full_name: user.full_name,
      email: user.email,
      avatar_url: user.avatar_url || null,
      role: payload.role
    });
  } catch (error) {
    // If avatar_url doesn't exist in schema yet, fallback
    try {
      const user = db.prepare("SELECT full_name, email FROM users WHERE id = ?").get(payload.userId) as any;
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
      
      return NextResponse.json({
        full_name: user.full_name,
        email: user.email,
        avatar_url: null,
        role: payload.role
      });
    } catch (e) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
  }
}
