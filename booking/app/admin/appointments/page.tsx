"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Search, Loader2, Eye, ToggleLeft, ToggleRight, CalendarDays, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface Appointment {
  id: string;
  name: string;
  organiser_id: string;
  organiser_name?: string;
  duration: number;
  is_published: number;
  description?: string;
  location?: string;
  created_at: number;
  appointment_type?: string;
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch("/api/appointments?role=admin");
        if (res.ok) {
          const data = await res.json();
          setAppointments(data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch appointments", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filtered = appointments.filter((apt) => {
    const matchesSearch =
      apt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (apt.organiser_name || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && apt.is_published === 1) ||
      (statusFilter === "draft" && apt.is_published === 0);
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: appointments.length,
    published: appointments.filter((a) => a.is_published === 1).length,
    draft: appointments.filter((a) => a.is_published === 0).length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">All Appointments</h1>
        <p className="text-slate-500 mt-1 text-sm">Platform-wide view of every appointment type across all organisers.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total", value: stats.total, color: "text-slate-900", bg: "bg-slate-50" },
          { label: "Published", value: stats.published, color: "text-green-700", bg: "bg-green-50" },
          { label: "Draft", value: stats.draft, color: "text-amber-700", bg: "bg-amber-50" },
        ].map((s) => (
          <div key={s.label} className={cn("rounded-2xl border border-slate-100 p-5", s.bg)}>
            <p className="text-[13px] text-slate-500">{s.label}</p>
            <p className={cn("text-3xl font-semibold mt-1", s.color)}>
              {isLoading ? <span className="inline-block h-8 w-16 bg-slate-200 animate-pulse rounded" /> : s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
        <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 w-full md:w-80 shadow-sm">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by name or organiser..."
            className="bg-transparent border-none focus:ring-0 text-sm ml-2 text-slate-900 placeholder:text-slate-400 w-full outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {(["all", "published", "draft"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={cn(
                "px-4 py-1.5 rounded-md text-[13px] font-medium transition-all capitalize",
                statusFilter === f ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin mr-3" />
          <p className="text-slate-500">Loading appointments...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-16 text-center">
          <CalendarDays className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">No appointments found.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3 text-[12px] font-semibold text-slate-500 uppercase">Name</th>
                <th className="px-5 py-3 text-[12px] font-semibold text-slate-500 uppercase">Organiser</th>
                <th className="px-5 py-3 text-[12px] font-semibold text-slate-500 uppercase">Duration</th>
                <th className="px-5 py-3 text-[12px] font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-5 py-3 text-[12px] font-semibold text-slate-500 uppercase">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shrink-0">
                        <CalendarDays className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-slate-900">{apt.name}</p>
                        {apt.location && <p className="text-[12px] text-slate-400">{apt.location}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-slate-600">{apt.organiser_name || apt.organiser_id}</td>
                  <td className="px-5 py-4">
                    <span className="text-[13px] text-slate-600 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {apt.duration} min
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium",
                        apt.is_published
                          ? "bg-green-50 text-green-700 border border-green-100"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      )}
                    >
                      {apt.is_published ? (
                        <><ToggleRight className="w-3.5 h-3.5" /> Published</>
                      ) : (
                        <><ToggleLeft className="w-3.5 h-3.5" /> Draft</>
                      )}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-slate-500">
                    {apt.created_at ? format(new Date(apt.created_at), "MMM d, yyyy") : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
