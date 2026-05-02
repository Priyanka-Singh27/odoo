"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Plus, LayoutDashboard, CalendarDays, Users, BookOpen, Settings } from "lucide-react";

export default function OrganiserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navLinks = [
    { name: "Dashboard", href: "/organiser/dashboard", icon: LayoutDashboard },
    { name: "Appointments", href: "/organiser/appointments", icon: CalendarDays },
    { name: "Team", href: "/organiser/team", icon: Users },
    { name: "Bookings", href: "/organiser/bookings", icon: BookOpen },
    { name: "Settings", href: "/organiser/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC]">
      {/* Sidebar */}
      <div className="w-64 bg-[#0F172A] text-slate-300 flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="text-white font-semibold tracking-wide">Organiser</span>
          </div>
        </div>
        <nav className="flex-1 py-6 flex flex-col gap-1 px-3">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                  isActive ? "bg-blue-600 text-white" : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <link.icon className="w-5 h-5" />
                <span className="font-medium text-sm">{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center text-sm font-medium text-slate-500">
            {/* Breadcrumbs based on pathname */}
            <span className="capitalize">{pathname.split("/").pop() || "Dashboard"}</span>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
              <Plus className="w-4 h-4" /> Create Appointment
            </button>
            <button className="text-slate-400 hover:text-slate-600 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300 cursor-pointer">
              {/* No mock image, leaving empty for data later */}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
