"use client";

import { LayoutGrid, Calendar, History, UserCircle, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AppSidebar() {
  const pathname = usePathname() || "";

  const navItems = [
    { href: "/home", icon: LayoutGrid, label: "Explore" },
    { href: "/appointments", icon: Calendar, label: "Schedule" },
    { href: "/history", icon: History, label: "Activity" },
    { href: "/profile", icon: UserCircle, label: "Profile" },
  ];

  return (
    <aside className="w-16 sm:w-20 bg-white flex flex-col items-center py-6 shrink-0 h-full border-r border-slate-200 z-40">
      <div className="flex flex-col items-center gap-2 w-full px-2">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/home' && pathname.startsWith(item.href));
          return (
            <Link 
              key={item.href}
              href={item.href} 
              title={item.label}
              className={cn(
                "group relative w-12 h-12 flex items-center justify-center rounded-lg transition-colors",
                active 
                  ? "bg-blue-50 text-blue-600" 
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <item.icon className="w-5 h-5" />
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-md" />
              )}
            </Link>
          );
        })}
      </div>
      
      <div className="mt-auto flex flex-col items-center gap-2 w-full px-2">
        <Link 
          href="/settings" 
          title="Settings"
          className="group w-12 h-12 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
        >
          <Settings className="w-5 h-5" />
        </Link>
      </div>
    </aside>
  );
}
