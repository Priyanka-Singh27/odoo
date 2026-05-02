import type { AdminStats, RecentBooking, AdminUser } from "@/features/admin/types";

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function fetchAdminStats() {
  return parseJson<AdminStats>(await fetch("/api/admin/stats"));
}

export async function fetchRecentBookings() {
  const data = await parseJson<{ data: RecentBooking[] }>(await fetch("/api/admin/recent-bookings"));
  return data.data || [];
}

export async function fetchAdminUsers() {
  const data = await parseJson<{ data: AdminUser[] }>(await fetch("/api/admin/users"));
  return data.data || [];
}

export async function patchAdminUser(
  userId: string,
  body: Partial<Pick<AdminUser, "role">> & { is_active?: boolean }
) {
  return parseJson<{ success: boolean; message?: string }>(
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  );
}
