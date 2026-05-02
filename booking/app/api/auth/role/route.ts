import { NextResponse } from "next/server";
import { resolveUserRole } from "@/lib/role";

export async function GET() {
  const role = await resolveUserRole();
  return NextResponse.json({ role });
}
