"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Moon, Bell, ChevronDown, User, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function AppHeader() {
  const router = useRouter();
  const [userData, setUserData] = useState<{ full_name: string; email: string; avatar_url: string | null } | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setUserData(data);
        }
      })
      .catch(console.error);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };
  
  const getTruncatedName = (name: string) => {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length <= 1) return name;
    return `${parts[0]} ${parts[parts.length - 1][0]}.`;
  };

  return (
    <header className="h-16 w-full bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 sticky top-0 z-50">
      {/* Left */}
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-lg">
            A
          </div>
          <div className="hidden sm:block">
             <p className="text-slate-900 font-semibold text-base leading-tight">Appointment</p>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search specialists..." 
              className="pl-9 pr-4 rounded-md border border-slate-200 bg-slate-50 h-9 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-[240px] transition-colors"
            />
          </div>
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Location" 
              className="pl-9 pr-4 rounded-md border border-slate-200 bg-slate-50 h-9 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-[160px] transition-colors"
            />
          </div>
        </div>
      </div>
      
      {/* Right */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 mr-2">
           <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
           </button>
           <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors">
              <Moon className="w-4 h-4" />
           </button>
        </div>

        <div className="h-6 w-[1px] bg-slate-200 hidden sm:block"></div>

        <DropdownMenu>
           <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-slate-50 rounded-md transition-colors ml-1">
              <div>
                 {userData?.avatar_url && !imgError ? (
                   <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                      <img 
                        src={userData.avatar_url} 
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                        onError={() => setImgError(true)}
                      />
                   </div>
                 ) : (
                   <div className="w-8 h-8 rounded-full bg-[#378ADD] flex items-center justify-center text-white font-medium text-sm">
                      {userData ? getInitials(userData.full_name) : 'U'}
                   </div>
                 )}
              </div>
              <div className="hidden sm:block">
                 <p className="text-sm font-medium text-slate-700">
                   {userData ? getTruncatedName(userData.full_name) : 'Loading...'}
                 </p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
           </DropdownMenuTrigger>
           <DropdownMenuContent align="end" className="w-56 p-1 rounded-md border-slate-200">
              <div className="px-2 py-3 flex items-center gap-3">
                 {userData?.avatar_url && !imgError ? (
                   <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                     <img 
                        src={userData.avatar_url} 
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                        onError={() => setImgError(true)}
                      />
                   </div>
                 ) : (
                   <div className="w-8 h-8 rounded-full bg-[#378ADD] flex items-center justify-center shrink-0 text-white font-medium text-sm">
                     {userData ? getInitials(userData.full_name) : 'U'}
                   </div>
                 )}
                 <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 leading-tight truncate">
                      {userData ? userData.full_name : 'Loading...'}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {userData ? userData.email : ''}
                    </p>
                 </div>
              </div>
              <DropdownMenuSeparator className="bg-slate-100" />
              <Link href="/profile">
                 <DropdownMenuItem className="rounded-sm px-2 py-2 cursor-pointer gap-2 text-sm text-slate-700">
                    <User className="w-4 h-4" /> My Profile
                 </DropdownMenuItem>
              </Link>
              <DropdownMenuItem className="rounded-sm px-2 py-2 cursor-pointer gap-2 text-sm text-slate-700">
                 <Settings className="w-4 h-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-100" />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="rounded-sm px-2 py-2 cursor-pointer gap-2 text-sm text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                 <LogOut className="w-4 h-4" /> Sign Out
              </DropdownMenuItem>
           </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
