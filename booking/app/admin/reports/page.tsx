"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from "recharts";
import { TrendingUp, Users, CalendarDays, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Stats {
  totalBookings: number;
  totalAppointments: number;
  totalUsers: number;
  totalProviders: number;
  bookingsByStatus: { status: string; count: number }[];
  bookingsByDay: { day: string; count: number }[];
}

const STATUS_COLORS: Record<string, string> = {
  confirmed: "#22c55e",
  pending: "#f59e0b",
  cancelled: "#ef4444",
  reserved: "#3b82f6",
};

export default function AdminReportsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // Fetch dashboard stats for KPIs
        const dashRes = await fetch("/api/admin/stats");
        const dashData = dashRes.ok ? await dashRes.json() : {};

        // Fetch all bookings for analytics
        const bookRes = await fetch("/api/bookings");
        const bookData = bookRes.ok ? await bookRes.json() : { data: [] };
        const bookings: any[] = bookData.data || [];

        // Status breakdown
        const statusMap: Record<string, number> = {};
        bookings.forEach((b: any) => {
          statusMap[b.status] = (statusMap[b.status] || 0) + 1;
        });
        const bookingsByStatus = Object.entries(statusMap).map(([status, count]) => ({ status, count }));

        // Bookings by day of week
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const dayMap: Record<string, number> = {};
        dayNames.forEach((d) => (dayMap[d] = 0));
        bookings.forEach((b: any) => {
          if (b.slot_date) {
            const d = new Date(b.slot_date);
            dayMap[dayNames[d.getDay()]] = (dayMap[dayNames[d.getDay()]] || 0) + 1;
          }
        });
        const bookingsByDay = dayNames.map((day) => ({ day, count: dayMap[day] }));

        setStats({
          totalBookings: bookings.length,
          totalAppointments: dashData.stats?.totalAppointments ?? 0,
          totalUsers: dashData.stats?.totalUsers ?? 0,
          totalProviders: dashData.stats?.totalProviders ?? 0,
          bookingsByStatus,
          bookingsByDay,
        });
      } catch (err) {
        console.error("Failed to load reports", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin mr-3" />
        <p className="text-slate-500">Loading reports...</p>
      </div>
    );
  }

  const kpis = [
    { label: "Total Bookings", value: stats?.totalBookings ?? 0, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Appointments", value: stats?.totalAppointments ?? 0, icon: CalendarDays, color: "text-teal-600", bg: "bg-teal-50" },
    { label: "Total Users", value: stats?.totalUsers ?? 0, icon: Users, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Total Providers", value: stats?.totalProviders ?? 0, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reports & Analytics</h1>
        <p className="text-slate-500 mt-1 text-sm">Track performance, trends, and operational health across the platform.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white border border-slate-100 rounded-2xl p-5 flex items-start gap-4">
            <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center border shrink-0", kpi.bg, kpi.color, "border-current/10")}>
              <kpi.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[13px] text-slate-500">{kpi.label}</p>
              <p className="text-2xl font-semibold text-slate-900 mt-0.5">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings by Day */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-1">Bookings by Day</h2>
          <p className="text-[13px] text-slate-500 mb-6">Distribution of bookings across the week</p>
          <div className="h-64 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.bookingsByDay || []} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }}
                  cursor={{ fill: "#f8fafc" }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookings by Status */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-1">Bookings by Status</h2>
          <p className="text-[13px] text-slate-500 mb-6">Current distribution of booking statuses</p>
          {(stats?.bookingsByStatus?.length ?? 0) === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">No booking data yet.</div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="h-64 w-full sm:w-64 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.bookingsByStatus}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={3}
                    >
                      {stats?.bookingsByStatus.map((entry) => (
                        <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || "#94a3b8"} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 flex-1">
                {stats?.bookingsByStatus.map((entry) => (
                  <div key={entry.status} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: STATUS_COLORS[entry.status] || "#94a3b8" }} />
                    <span className="text-[13px] text-slate-700 capitalize flex-1">{entry.status}</span>
                    <span className="text-[13px] font-semibold text-slate-900">{entry.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
