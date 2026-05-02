import { Search, MapPin, Moon, Bell, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function AppHeader() {
  return (
    <header className="h-16 w-full bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
      {/* Left */}
      <div className="flex items-center gap-6">
        <Link href="/" className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          A
        </Link>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Find doctors" 
              className="pl-9 pr-4 rounded-xl border border-slate-200 bg-white h-10 text-sm focus:outline-none focus:border-blue-500 w-[200px]"
            />
          </div>
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Location" 
              className="pl-9 pr-4 rounded-xl border border-slate-200 bg-white h-10 text-sm focus:outline-none focus:border-blue-500 w-[160px]"
            />
          </div>
          <button className="bg-blue-500 text-white rounded-xl px-5 h-10 text-sm font-medium hover:bg-blue-600 transition-colors">
            Search
          </button>
        </div>
      </div>
      
      {/* Right */}
      <div className="flex items-center gap-5">
        <button className="text-slate-500 hover:text-slate-700"><Moon className="w-5 h-5" /></button>
        <button className="text-slate-500 hover:text-slate-700 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        <Link href="/profile" className="flex items-center gap-2 cursor-pointer border-l border-slate-200 pl-5 hover:bg-slate-50 transition-colors h-full px-2">
          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <span className="text-sm font-medium text-slate-700">Cameron</span>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </Link>
      </div>
    </header>
  );
}
