"use client";

import { ShieldCheck, Users, CalendarDays, Settings, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const ROLES = [
  { key: "customer" as const, label: "Customer", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", bar: "bg-blue-500" },
  { key: "organiser" as const, label: "Organiser", color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-100", bar: "bg-teal-500" },
  { key: "admin" as const, label: "Admin", color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100", bar: "bg-violet-500" },
];

const SECTIONS = [
  {
    section: "Appointments", icon: CalendarDays,
    items: [
      { label: "View own appointments", customer: true, organiser: true, admin: true },
      { label: "View all appointments", customer: false, organiser: false, admin: true },
      { label: "Create appointment types", customer: false, organiser: true, admin: true },
      { label: "Edit / delete appointments", customer: false, organiser: true, admin: true },
      { label: "Publish / unpublish", customer: false, organiser: true, admin: true },
    ],
  },
  {
    section: "Bookings", icon: Settings,
    items: [
      { label: "Create bookings", customer: true, organiser: false, admin: true },
      { label: "View own bookings", customer: true, organiser: true, admin: true },
      { label: "View all bookings", customer: false, organiser: false, admin: true },
      { label: "Confirm / reject bookings", customer: false, organiser: true, admin: true },
      { label: "Cancel bookings", customer: true, organiser: true, admin: true },
    ],
  },
  {
    section: "Users & Staff", icon: Users,
    items: [
      { label: "View all users", customer: false, organiser: false, admin: true },
      { label: "Change user roles", customer: false, organiser: false, admin: true },
      { label: "Activate / deactivate users", customer: false, organiser: false, admin: true },
      { label: "Manage staff / providers", customer: false, organiser: true, admin: true },
    ],
  },
  {
    section: "System", icon: ShieldCheck,
    items: [
      { label: "View audit logs", customer: false, organiser: false, admin: true },
      { label: "Manage system settings", customer: false, organiser: false, admin: true },
      { label: "View platform reports", customer: false, organiser: true, admin: true },
    ],
  },
];

export default function AdminRolesPermissionsPage() {
  const allItems = SECTIONS.flatMap((s) => s.items);
  const total = allItems.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Roles & Permissions</h1>
        <p className="text-slate-500 mt-1 text-sm">RBAC policies enforced server-side across the platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ROLES.map((role) => {
          const count = allItems.filter((p) => p[role.key]).length;
          return (
            <div key={role.key} className={cn("rounded-2xl border p-5", role.bg, role.border)}>
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck className={cn("w-5 h-5", role.color)} />
                <h3 className="text-[15px] font-bold text-slate-900">{role.label}</h3>
              </div>
              <p className="text-[13px] text-slate-600 mb-3">{count} of {total} permissions</p>
              <div className="w-full bg-white/60 rounded-full h-2">
                <div className={cn("h-2 rounded-full", role.bar)} style={{ width: `${(count / total) * 100}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {SECTIONS.map((sec) => (
        <div key={sec.section} className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
            <sec.icon className="w-4 h-4 text-slate-500" />
            <h2 className="text-[14px] font-bold text-slate-800">{sec.section}</h2>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-5 py-3 text-[12px] font-semibold text-slate-500 uppercase w-1/2">Permission</th>
                {ROLES.map((r) => (
                  <th key={r.key} className="px-5 py-3 text-[12px] font-semibold text-slate-500 uppercase text-center">{r.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sec.items.map((perm, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="px-5 py-3.5 text-[13px] text-slate-700">{perm.label}</td>
                  {ROLES.map((r) => (
                    <td key={r.key} className="px-5 py-3.5 text-center">
                      {perm[r.key] ? <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-300 mx-auto" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
