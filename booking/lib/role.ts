import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export type Role = "customer" | "organiser" | "admin";

/**
 * Resolves the role of the currently logged-in user.
 * This is abstracted so it can be swapped for other methods later.
 */
export async function resolveUserRole(): Promise<Role> {
  // TODO: replace with login-screen role selector or explicit Odoo group membership check
  
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  
  if (!token) return "customer";
  
  try {
    const payload = await verifyToken(token);
    if (!payload || !payload.role) return "customer";
    
    // Member of appointment.group_organiser -> role = 'organiser'
    // Member of appointment.group_admin -> role = 'admin'
    // This is already handled in our local JWT for now, but in Odoo
    // you would check user groups here.
    
    return payload.role as Role;
  } catch (e) {
    return "customer";
  }
}
