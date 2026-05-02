"use client";

import { LayoutGrid, Calendar, MessageSquare, Users, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppSidebar() {
  const pathname = usePathname() || "";

  const isActive = (path: string) => pathname.startsWith(path);

  const getLinkClasses = (path: string) => {
    const active = isActive(path);
    return `p-3 rounded-xl transition-colors relative ${
      active ? "text-white bg-white/10" : "text-slate-400 hover:text-white hover:bg-white/10"
    }`;
  };

  return (
    <aside className="w-16 bg-[#0F172A] flex flex-col items-center py-6 shrink-0 h-full gap-6">
      <Link href="/home" className={getLinkClasses("/home")}>
        {isActive("/home") && <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full" />}
        <LayoutGrid className="w-5 h-5" />
      </Link>
      
      <Link href="/organiser/appointments" className={getLinkClasses("/organiser")}>
        {isActive("/organiser") && <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full" />}
        <Calendar className="w-5 h-5" />
      </Link>
      
      <Link href="/messages" className={getLinkClasses("/messages")}>
        {isActive("/messages") && <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full" />}
        <MessageSquare className="w-5 h-5" />
      </Link>
      
      <Link href="/admin/users" className={getLinkClasses("/admin")}>
        {isActive("/admin") && <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full" />}
        <Users className="w-5 h-5" />
      </Link>
      
      <div className="mt-auto">
        <Link href="/settings" className={getLinkClasses("/settings")}>
          <Settings className="w-5 h-5" />
        </Link>
      </div>
    </aside>
  );
}
