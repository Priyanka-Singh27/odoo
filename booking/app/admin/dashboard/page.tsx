"use client";

import { ShieldCheck, Users, Settings, Database, Activity, LayoutGrid } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Users", value: "2,543", icon: Users, color: "text-blue-600", bgColor: "bg-blue-50" },
    { label: "Active Nodes", value: "12", icon: Activity, color: "text-emerald-600", bgColor: "bg-emerald-50" },
    { label: "DB Health", value: "Optimal", icon: Database, color: "text-amber-600", bgColor: "bg-amber-50" },
    { label: "Total Revenue", value: "$42.5k", icon: ShieldCheck, color: "text-purple-600", bgColor: "bg-purple-50" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Terminal</h1>
            <p className="text-slate-500 mt-1">System-wide governance and global configuration.</p>
          </div>
          <div className="flex items-center gap-3">
             <Link href="/">
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                   Exit Terminal
                </button>
             </Link>
             <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                Global Settings
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
              <div className={`w-10 h-10 ${stat.bgColor} ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm h-96 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                 <LayoutGrid className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">System Logs</h3>
              <p className="text-slate-500 max-w-sm mt-2">Real-time system event logs and audit trails will appear here once configured.</p>
           </div>
           <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Critical Actions</h3>
              <div className="space-y-4">
                 <button className="w-full text-left px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors group">
                    <p className="text-sm font-semibold text-slate-900">Database Backup</p>
                    <p className="text-xs text-slate-500">Last backup: 2h ago</p>
                 </button>
                 <button className="w-full text-left px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors group">
                    <p className="text-sm font-semibold text-slate-900">User Audit</p>
                    <p className="text-xs text-slate-500">Scan for suspicious activity</p>
                 </button>
                 <button className="w-full text-left px-4 py-3 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-colors group">
                    <p className="text-sm font-semibold text-red-700">Force Global Logoff</p>
                    <p className="text-xs text-red-500">Terminate all active sessions</p>
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
