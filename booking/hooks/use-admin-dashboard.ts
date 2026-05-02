"use client";

import { useEffect, useState } from "react";
import { fetchAdminStats, fetchRecentBookings } from "@/lib/services/admin-service";
import type { AdminStats, RecentBooking } from "@/features/admin/types";

export function useAdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recent, setRecent] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [statsData, recentData] = await Promise.all([
          fetchAdminStats(),
          fetchRecentBookings(),
        ]);
        if (!mounted) return;
        setStats(statsData);
        setRecent(recentData);
      } catch {
        if (!mounted) return;
        setError("Failed to load dashboard data.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void load();
    return () => {
      mounted = false;
    };
  }, []);

  return { stats, recent, loading, error };
}
