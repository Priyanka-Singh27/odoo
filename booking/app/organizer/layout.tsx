"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bell, Plus, Search } from "lucide-react";
import { useService } from "@/hooks/use-role";
import RoleSidebar from "@/components/shared/RoleSidebar";

export default function OrganiserLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { role, isLoading } = useService('appointment.role');

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  if (isLoading) return <div className="h-screen w-full flex items-center justify-center bg-slate-50 text-slate-500">Loading...</div>;

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans">
      <RoleSidebar
        role={role === "admin" ? "admin" : "organiser"}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onToggleMobile={() => setMobileOpen((v) => !v)}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-30">
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-slate-100 rounded-md px-3 py-1.5 w-64 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
              <Search className="w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none focus:ring-0 text-sm ml-2 text-slate-900 placeholder:text-slate-500 w-full outline-none"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">

            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md relative transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
            </button>

            <div className="h-6 w-[1px] bg-slate-200 mx-2 hidden sm:block"></div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-slate-200 overflow-hidden">
                <img src="https://i.pravatar.cc/150?u=organiser" alt="User" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
