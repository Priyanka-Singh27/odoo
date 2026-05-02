"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { 
  Search, 
  Loader2, 
  UserPlus, 
  ShieldCheck, 
  Mail, 
  MoreVertical, 
  ToggleLeft, 
  ToggleRight,
  CheckCircle2,
  XCircle,
  Building2,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Organiser {
  id: string;
  full_name: string;
  email: string;
  is_active: number;
  is_verified: number;
  created_at: number | string;
}

interface Stats {
  total: number;
  active: number;
  verified: number;
}

export default function AdminOrganisersPage() {
  const [organisers, setOrganisers] = useState<Organiser[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, verified: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchOrganisers();
  }, []);

  const fetchOrganisers = async () => {
    try {
      const res = await fetch("/api/admin/organisers");
      if (res.ok) {
        const data = await res.json();
        setOrganisers(data.data || []);
        setStats(data.stats || { total: 0, active: 0, verified: 0 });
      }
    } catch (err) {
      toast.error("Failed to load organisers");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: number) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: currentStatus === 1 ? 0 : 1 }),
      });
      if (res.ok) {
        toast.success("Status updated");
        fetchOrganisers();
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  const filtered = organisers.filter((org) =>
    org.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Organisers</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage organiser accounts, onboarding status, and platform access.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
          <UserPlus className="w-4 h-4" />
          Add Organiser
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Organisers", value: stats.total, color: "text-slate-900", bg: "bg-white" },
          { label: "Active", value: stats.active, color: "text-green-600", bg: "bg-white" },
          { label: "Verified", value: stats.verified, color: "text-blue-600", bg: "bg-white" },
        ].map((s) => (
          <div key={s.label} className={cn("rounded-2xl border border-slate-100 p-5 shadow-sm", s.bg)}>
            <p className="text-[13px] text-slate-500 font-medium">{s.label}</p>
            <p className={cn("text-3xl font-bold mt-1", s.color)}>
              {isLoading ? <span className="inline-block h-8 w-16 bg-slate-100 animate-pulse rounded" /> : s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 w-full md:w-96 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="bg-transparent border-none focus:ring-0 text-sm ml-2 text-slate-900 placeholder:text-slate-400 w-full outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin mr-3" />
          <p className="text-slate-500">Loading organisers...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-16 text-center">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">No organisers found.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Organiser</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-slate-500 uppercase tracking-wider text-center">Verified</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((org) => (
                <tr key={org.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200 uppercase font-bold text-sm">
                        {org.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-slate-900">{org.full_name}</p>
                        <p className="text-[11px] text-slate-400 font-medium">ID: {org.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-[13px] text-slate-600">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {org.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      {org.is_verified ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleStatus(org.id, org.is_active)}
                      className={cn(
                        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[12px] font-semibold transition-all",
                        org.is_active 
                          ? "bg-green-50 text-green-700 hover:bg-green-100" 
                          : "bg-red-50 text-red-700 hover:bg-red-100"
                      )}
                    >
                      {org.is_active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      {org.is_active ? "Active" : "Disabled"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-slate-500">
                    {org.created_at ? format(new Date(typeof org.created_at === 'number' ? org.created_at * 1000 : org.created_at), "MMM d, yyyy") : "—"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
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
