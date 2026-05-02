"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

type Stats = {
  totalUsers: number;
  totalProviders: number;
  totalAppointments: number;
  newUsersThisWeek: number;
  newProvidersThisWeek: number;
  appointmentsToday: number;
};

type RecentBooking = {
  id: string;
  customer_name: string;
  service_name: string;
  provider_name: string;
  slot_date: string;
  start_time: string;
  status: string;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<RecentBooking[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoadingStats(true);
      setLoadingRecent(true);
      const [statsRes, recentRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/recent-bookings"),
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (recentRes.ok) {
        const data = await recentRes.json();
        setRecent(data.data || []);
      }
      setLoadingStats(false);
      setLoadingRecent(false);
    };
    void load();
  }, []);

  const kpis = [
    {
      label: "Total Users",
      value: stats?.totalUsers ?? 0,
      trend: `↑ ${stats?.newUsersThisWeek ?? 0} this week`,
    },
    {
      label: "Total Providers",
      value: stats?.totalProviders ?? 0,
      trend: `↑ ${stats?.newProvidersThisWeek ?? 0} this week`,
    },
    {
      label: "Total Appointments",
      value: stats?.totalAppointments ?? 0,
      trend: `↑ ${stats?.appointmentsToday ?? 0} today`,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white border border-slate-100 rounded-2xl p-5">
            <p className="text-[13px] text-slate-500">{kpi.label}</p>
            <p className="text-3xl font-semibold text-slate-900 mt-2">
              {loadingStats ? <span className="inline-block h-8 w-20 bg-slate-100 animate-pulse rounded" /> : kpi.value}
            </p>
            <p className="text-xs text-slate-500 mt-3">{kpi.trend}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-5">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-100">
              <tr>
                <th className="py-2 text-[13px] text-slate-500">Customer</th>
                <th className="py-2 text-[13px] text-slate-500">Service</th>
                <th className="py-2 text-[13px] text-slate-500">Provider</th>
                <th className="py-2 text-[13px] text-slate-500">Date</th>
                <th className="py-2 text-[13px] text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {loadingRecent ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-50">
                    <td className="py-3"><span className="inline-block h-4 w-24 bg-slate-100 animate-pulse rounded" /></td>
                    <td className="py-3"><span className="inline-block h-4 w-32 bg-slate-100 animate-pulse rounded" /></td>
                    <td className="py-3"><span className="inline-block h-4 w-24 bg-slate-100 animate-pulse rounded" /></td>
                    <td className="py-3"><span className="inline-block h-4 w-20 bg-slate-100 animate-pulse rounded" /></td>
                    <td className="py-3"><span className="inline-block h-4 w-16 bg-slate-100 animate-pulse rounded" /></td>
                  </tr>
                ))
              ) : recent.length === 0 ? (
                <tr>
                  <td className="py-5 text-[13px] text-slate-500" colSpan={5}>No bookings yet.</td>
                </tr>
              ) : (
                recent.map((row) => (
                  <tr key={row.id} className="border-b border-slate-50">
                    <td className="py-3 text-[13px] text-slate-800">{row.customer_name}</td>
                    <td className="py-3 text-[13px] text-slate-800">{row.service_name}</td>
                    <td className="py-3 text-[13px] text-slate-800">{row.provider_name}</td>
                    <td className="py-3 text-[13px] text-slate-600">
                      {format(new Date(`${row.slot_date}T${row.start_time}`), "MMM d, yyyy h:mm a")}
                    </td>
                    <td className="py-3 text-[13px] text-slate-800 capitalize">{row.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
