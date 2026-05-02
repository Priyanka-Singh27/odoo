"use client";

import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Calendar, 
  Download, 
  ArrowUpRight,
  Loader2
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
} from "recharts";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BAR_DATA = [
  { name: "Mon", count: 12 },
  { name: "Tue", count: 19 },
  { name: "Wed", count: 15 },
  { name: "Thu", count: 22 },
  { name: "Fri", count: 30 },
  { name: "Sat", count: 18 },
  { name: "Sun", count: 10 },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState("7days");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [period]);

  const SummaryCard = ({ title, value, subValue, trend }: any) => (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
       <p className="text-slate-500 font-medium text-[13px] mb-2">{title}</p>
       <div className="flex items-end justify-between">
         <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
         {trend && (
            <div className="flex items-center gap-1 text-green-600 text-[13px] font-medium">
               <ArrowUpRight className="w-3.5 h-3.5" /> {trend}
            </div>
         )}
       </div>
       <p className="text-slate-400 text-[12px] mt-2">{subValue}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reports</h1>
          <p className="text-slate-500 mt-1 text-sm">Analyze your booking performance and provider metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={(v) => setPeriod(v ?? "7days")}>
            <SelectTrigger className="bg-white border-slate-200 rounded-lg h-9 text-slate-700 w-40 text-[13px]">
               <div className="flex items-center gap-2">
                 <Calendar className="w-3.5 h-3.5 text-slate-400" />
                 <SelectValue />
               </div>
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200">
               <SelectItem value="7days">Last 7 days</SelectItem>
               <SelectItem value="30days">Last 30 days</SelectItem>
               <SelectItem value="3months">Last 3 months</SelectItem>
               <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="h-9 border-slate-200 text-slate-700 rounded-lg gap-2 px-4 text-[13px]">
             <Download className="w-3.5 h-3.5" /> Export
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-4">
           <Loader2 className="w-8 h-8 text-[#378ADD] animate-spin" />
           <p className="text-slate-500 font-medium text-[13px]">Analyzing Data...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
             <SummaryCard 
               title="Total Appointments" 
               value="142" 
               subValue="↑ 23 this week" 
               trend="" 
             />
             <SummaryCard 
               title="Peak Hour" 
               value="10:00–11:00" 
               subValue="34 bookings" 
             />
             <SummaryCard 
               title="Top Provider" 
               value="Dr. Amanda" 
               subValue="78 bookings" 
             />
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
             <h3 className="text-[15px] font-bold text-slate-900 mb-6">Bookings over time</h3>
             <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={BAR_DATA}>
                      <XAxis 
                        dataKey="name" 
                        stroke="#94a3b8" 
                        fontSize={11} 
                        tickLine={false} 
                        axisLine={false}
                        dy={10}
                      />
                      <YAxis 
                        stroke="#94a3b8" 
                        fontSize={11} 
                        tickLine={false} 
                        axisLine={false}
                        dx={-10}
                      />
                      <Tooltip 
                        cursor={{fill: '#f8fafc'}}
                        contentStyle={{backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: '8px'}}
                      />
                      <Bar 
                        dataKey="count" 
                        fill="#378ADD" 
                        radius={[4, 4, 0, 0]} 
                      />
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
             <h3 className="text-[15px] font-bold text-slate-900 mb-6">Provider utilization</h3>
             <div className="space-y-4">
               {[
                 { id: "1", name: "Dr. Amanda Clara", utilization: 88 },
                 { id: "2", name: "Dr. Esther Howard", utilization: 62 },
                 { id: "3", name: "Dr. Robert Fox", utilization: 45 },
               ].map((p) => (
                 <div key={p.id} className="flex items-center gap-3">
                   <span className="text-[13px] text-slate-600 w-36 truncate">{p.name}</span>
                   <div className="flex-1 h-2 bg-slate-100 rounded-full">
                     <div
                       className="h-2 bg-[#378ADD] rounded-full"
                       style={{ width: `${p.utilization}%` }}
                     />
                   </div>
                   <span className="text-[12px] text-slate-400 w-8 text-right">{p.utilization}%</span>
                 </div>
               ))}
             </div>
          </div>
        </>
      )}
    </div>
  );
}
