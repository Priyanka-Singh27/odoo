"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { SIDEBAR_CONFIG, type SidebarRole } from "@/lib/sidebar-config";

type RoleSidebarProps = {
  role: SidebarRole;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onToggleMobile: () => void;
  onLogout: () => Promise<void> | void;
};

export default function RoleSidebar({
  role,
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onToggleMobile,
  onLogout,
}: RoleSidebarProps) {
  const pathname = usePathname() || "";
  const sections = SIDEBAR_CONFIG[role];

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 rounded-md bg-white border border-slate-200 text-slate-600"
        onClick={onToggleMobile}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/40 z-40"
          onClick={onToggleMobile}
        />
      )}

      <aside
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-50 bg-white border-r border-slate-200 flex flex-col transition-all duration-200",
          collapsed ? "w-[78px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-16 border-b border-slate-200 px-4 flex items-center justify-between">
          <Link href={role === "admin" ? "/admin/dashboard" : "/organizer/dashboard"} className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center font-semibold">
              A
            </div>
            {!collapsed && <span className="font-semibold text-slate-900">{role === "admin" ? "Admin" : "Organiser"}</span>}
          </Link>
          <button
            className="hidden lg:inline-flex p-1.5 rounded-md text-slate-500 hover:bg-slate-100"
            onClick={onToggleCollapsed}
          >
            {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {sections.map((section, idx) => (
            <div key={section.key} className={cn(idx > 0 && "pt-3 border-t border-slate-200", "space-y-1")}>
              {section.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => mobileOpen && onToggleMobile()}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors border-l-2",
                      active 
                        ? "border-[#378ADD] text-[#378ADD] bg-[#E6F1FB]" 
                        : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-slate-200">
          <button
            onClick={onLogout}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-red-600 hover:bg-red-50"
            )}
            title={collapsed ? "Sign Out" : undefined}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
