import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken, type JwtPayload } from "@/lib/jwt";
import { db } from "@/lib/db";

export type Role = "customer" | "organiser" | "admin" | "provider";

// ---------- resolveUser ----------
// Returns the full JWT payload + DB row for the logged-in user, or null.
export async function resolveUser(): Promise<
  (JwtPayload & { id: string; fullName: string }) | null
> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  const row = db
    .prepare("SELECT id, full_name, role FROM users WHERE id = ? AND is_active = 1")
    .get(payload.userId) as { id: string; full_name: string; role: string } | undefined;

  if (!row) return null;

  return {
    ...payload,
    id: row.id,
    fullName: row.full_name,
    role: row.role as JwtPayload["role"],
  };
}

// ---------- authorize ----------
// Checks the current user against a list of allowed roles.
// Returns the user payload on success, or a 401/403 NextResponse on failure.
export async function authorize(
  ...allowedRoles: Role[]
): Promise<
  | { ok: true; user: JwtPayload & { id: string; fullName: string } }
  | { ok: false; response: NextResponse }
> {
  const user = await resolveUser();

  if (!user) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      ),
    };
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role as Role)) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: "Access denied",
          details: `Role '${user.role}' is not authorized. Required: ${allowedRoles.join(", ")}`,
        },
        { status: 403 }
      ),
    };
  }

  return { ok: true, user };
}

// ---------- requireAdmin ----------
// Reusable guard for /api/admin/* routes.
export async function requireAdmin() {
  const auth = await authorize("admin");
  if (!auth.ok) {
    throw auth.response;
  }
  return auth.user;
}

// ---------- verifyOwnership ----------
// For organiser routes: ensures the resource belongs to this user.
// Admins bypass ownership checks.
export function verifyOwnership(
  table: "appointments" | "bookings",
  resourceId: string,
  userId: string,
  userRole: string
): { allowed: boolean; response?: NextResponse } {
  if (userRole === "admin") return { allowed: true };

  const ownerColumn = table === "appointments" ? "organiser_id" : "customer_id";
  const row = db
    .prepare(`SELECT ${ownerColumn} as owner_id FROM ${table} WHERE id = ?`)
    .get(resourceId) as { owner_id: string } | undefined;

  if (!row) {
    return {
      allowed: false,
      response: NextResponse.json({ error: "Resource not found" }, { status: 404 }),
    };
  }

  if (row.owner_id !== userId) {
    return {
      allowed: false,
      response: NextResponse.json(
        { error: "Access denied. You can only manage your own resources." },
        { status: 403 }
      ),
    };
  }

  return { allowed: true };
}

// ---------- logAdminAction ----------
// Audit-log any admin action for accountability.
export function logAdminAction(
  adminId: string,
  action: string,
  details: Record<string, unknown> = {}
) {
  try {
    db.prepare(
      `INSERT INTO admin_audit (id, admin_id, action, details, created_at)
       VALUES (?, ?, ?, ?, datetime('now'))`
    ).run(
      `audit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      adminId,
      action,
      JSON.stringify(details)
    );
  } catch (err) {
    console.error("[audit] Failed to log admin action:", err);
  }
}
