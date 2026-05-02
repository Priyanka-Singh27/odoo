"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Loader2, ScrollText, Shield, UserCog, Trash2 } from "lucide-react";

interface AuditEntry {
  id: string;
  admin_name: string;
  action: string;
  details: string;
  created_at: string;
}

const ACTION_ICONS: Record<string, typeof Shield> = {
  "appointment.update": UserCog,
  "appointment.delete": Trash2,
};

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/audit")
      .then(res => res.json())
      .then(data => { setLogs(data.data || []); setIsLoading(false); })
      .catch(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Audit Logs</h1>
        <p className="text-slate-500 mt-1 text-[13px]">Track all administrative actions on the platform</p>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-100 bg-slate-50/50">
              <tr>
                <th className="px-4 py-3 text-[12px] font-semibold text-slate-500 uppercase">Admin</th>
                <th className="px-4 py-3 text-[12px] font-semibold text-slate-500 uppercase">Action</th>
                <th className="px-4 py-3 text-[12px] font-semibold text-slate-500 uppercase">Details</th>
                <th className="px-4 py-3 text-[12px] font-semibold text-slate-500 uppercase">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-50">
                    <td className="px-4 py-3"><span className="inline-block h-4 w-24 bg-slate-100 animate-pulse rounded" /></td>
                    <td className="px-4 py-3"><span className="inline-block h-4 w-32 bg-slate-100 animate-pulse rounded" /></td>
                    <td className="px-4 py-3"><span className="inline-block h-4 w-40 bg-slate-100 animate-pulse rounded" /></td>
                    <td className="px-4 py-3"><span className="inline-block h-4 w-24 bg-slate-100 animate-pulse rounded" /></td>
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <ScrollText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-[13px] text-slate-500">No audit logs recorded yet.</p>
                  </td>
                </tr>
              ) : (
                logs.map(log => {
                  const Icon = ACTION_ICONS[log.action] || Shield;
                  let parsedDetails = "";
                  try {
                    const d = JSON.parse(log.details);
                    parsedDetails = Object.entries(d).map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`).join(", ");
                  } catch {
                    parsedDetails = log.details;
                  }
                  return (
                    <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="px-4 py-3 text-[13px] font-medium text-slate-900">{log.admin_name}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[13px] text-slate-700 font-mono">{log.action}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-slate-500 max-w-[300px] truncate">
                        {parsedDetails}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-slate-600">
                        {format(new Date(log.created_at), "MMM d, yyyy HH:mm")}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
