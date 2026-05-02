"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Users, 
  CalendarDays, 
  TrendingUp, 
  Eye, 
  Plus, 
  Clock, 
  ChevronRight,
  Loader2,
  ArrowRight
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CHART_DATA = [
  { date: "May 01", bookings: 12 },
  { date: "May 02", bookings: 19 },
  { date: "May 03", bookings: 15 },
  { date: "May 04", bookings: 22 },
  { date: "May 05", bookings: 30 },
  { date: "May 06", bookings: 25 },
  { date: "May 07", bookings: 38 },
];

export default function OrganiserDashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
       <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
       <p className="text-slate-500 font-medium text-sm">Loading dashboard...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
         <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome back, Maya!</h1>
            <p className="text-slate-500">You have <span className="font-semibold text-slate-900">12 new bookings</span> today. Your sessions are filling up fast.</p>
         </div>
         <div className="flex items-center gap-3">
            <Link href="/organizer/calendar">
               <Button variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50">
                 View Schedule
               </Button>
            </Link>
            <Link href="/organizer/appointments/new">
               <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                 <Plus className="w-4 h-4 mr-2" /> New Appointment
               </Button>
            </Link>
         </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Bookings" value="1,248" trend="+12%" icon={CalendarDays} />
        <StatCard title="Active Slots" value="42" trend="+5%" icon={Clock} />
        <StatCard title="Net Revenue" value="$12,400" trend="+24%" icon={TrendingUp} />
        <StatCard title="Profile Views" value="4.8k" trend="+8%" icon={Eye} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Area */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
               <h3 className="text-lg font-semibold text-slate-900">Booking Performance</h3>
               <p className="text-slate-500 text-sm">Growth over last 7 days</p>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-lg">
               <button className="px-3 py-1.5 rounded-md text-xs font-medium bg-white text-slate-900 shadow-sm">Days</button>
               <button className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">Weeks</button>
            </div>
          </div>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748B' }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748B' }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#2563EB" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorBookings)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions / Recent */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-semibold text-slate-900">Upcoming Today</h3>
                 <Link href="/organizer/calendar" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View all</Link>
              </div>
              <div className="space-y-3">
                 {[
                   { name: "John Doe", time: "10:00 AM", type: "Dental Checkup" },
                   { name: "Alice Smith", time: "11:30 AM", type: "Consultation" },
                   { name: "Bob Wilson", time: "02:00 PM", type: "Followup" },
                 ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
                            {item.name.charAt(0)}
                         </div>
                         <div>
                            <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                            <p className="text-xs text-slate-500">{item.type}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-xs font-semibold text-slate-700">{item.time}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-slate-900 rounded-2xl p-6 shadow-sm relative overflow-hidden">
              <h4 className="text-white font-semibold text-lg mb-2 relative z-10">Premium Support</h4>
              <p className="text-slate-400 text-sm mb-6 relative z-10">Need help with your setup? Our experts are here to assist you.</p>
              <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 shadow-sm relative z-10">
                 Contact Support
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, icon: Icon }: any) {
  const isPositive = trend.startsWith('+');
  
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-100">
          <Icon className="w-5 h-5" />
        </div>
        <div className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
          isPositive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
        )}>
          {trend}
        </div>
      </div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-900 tracking-tight">{value}</span>
      </div>
    </div>
  );
}
