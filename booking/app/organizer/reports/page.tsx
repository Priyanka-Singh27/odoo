"use client";

import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Calendar, 
  Filter, 
  Download, 
  ChevronDown,
  ArrowUpRight,
  Loader2
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from "recharts";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const BAR_DATA = [
  { name: "Mon", bookings: 12 },
  { name: "Tue", bookings: 19 },
  { name: "Wed", bookings: 15 },
  { name: "Thu", bookings: 22 },
  { name: "Fri", bookings: 30 },
  { name: "Sat", bookings: 18 },
  { name: "Sun", bookings: 10 },
];

const PIE_DATA = [
  { name: "Dental Care", value: 45, color: "#6366F1" },
  { name: "Tennis Court", value: 25, color: "#A855F7" },
  { name: "Psychology", value: 20, color: "#EC4899" },
  { name: "General", value: 10, color: "#F43F5E" },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState("7days");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [period]);

  const SummaryCard = ({ title, value, subValue, icon: Icon, trend }: any) => (
    <div className="bg-[#111827] border border-white/5 rounded-[32px] p-8 shadow-xl shadow-black/20 group hover:border-indigo-500/30 transition-all">
       <div className="flex justify-between items-start mb-6">
          <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
             <Icon className="w-7 h-7" />
          </div>
          {trend && (
             <div className="flex items-center gap-1 bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold">
                <ArrowUpRight className="w-3.5 h-3.5" /> {trend}
             </div>
          )}
       </div>
       <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px] mb-1">{title}</p>
       <h3 className="text-3xl font-black text-white mb-2">{value}</h3>
       <p className="text-slate-400 text-sm font-medium">{subValue}</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Reports & Insights</h1>
          <p className="text-slate-400 mt-1 text-sm font-medium">Analyze your booking performance and provider metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="bg-[#111827] border-white/5 rounded-2xl h-12 text-white w-48 font-bold">
               <div className="flex items-center gap-2">
                 <Calendar className="w-4 h-4 text-slate-500" />
                 <SelectValue />
               </div>
            </SelectTrigger>
            <SelectContent className="bg-[#1F2937] border-white/10 text-slate-200">
               <SelectItem value="7days">Last 7 Days</SelectItem>
               <SelectItem value="30days">Last 30 Days</SelectItem>
               <SelectItem value="3months">Last 3 Months</SelectItem>
               <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="h-12 border-white/10 hover:bg-white/5 text-white rounded-2xl gap-2 font-bold px-6">
             <Download className="w-4 h-4" /> Export
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-48 flex flex-col items-center justify-center gap-4">
           <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
           <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Analyzing Data...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-3">
             <SummaryCard 
               title="Total Appointments" 
               value="1,284" 
               subValue="Across all services" 
               icon={TrendingUp} 
               trend="+14.2%" 
             />
             <SummaryCard 
               title="Peak Booking Hours" 
               value="10:00 – 12:00" 
               subValue="Most active slot time" 
               icon={Clock} 
             />
             <SummaryCard 
               title="Customer Satisfaction" 
               value="4.9/5.0" 
               subValue="From 842 reviews" 
               icon={Users} 
               trend="+2.1%" 
             />
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
             <div className="bg-[#111827] border border-white/5 rounded-[32px] p-8 shadow-xl">
                <div className="flex justify-between items-center mb-10">
                   <h3 className="text-xl font-bold text-white">Bookings Volume</h3>
                   <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                         <div className="w-3 h-3 rounded-full bg-indigo-500" />
                         <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Confirmed</span>
                      </div>
                   </div>
                </div>
                <div className="h-[300px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={BAR_DATA}>
                         <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                         <XAxis 
                           dataKey="name" 
                           stroke="rgba(255,255,255,0.3)" 
                           fontSize={11} 
                           tickLine={false} 
                           axisLine={false}
                           dy={10}
                           fontWeight="bold"
                         />
                         <YAxis 
                           stroke="rgba(255,255,255,0.3)" 
                           fontSize={11} 
                           tickLine={false} 
                           axisLine={false}
                           dx={-10}
                           fontWeight="bold"
                         />
                         <Tooltip 
                           cursor={{fill: 'rgba(255,255,255,0.03)'}}
                           contentStyle={{backgroundColor: '#1F2937', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff'}}
                         />
                         <Bar 
                           dataKey="bookings" 
                           fill="#6366F1" 
                           radius={[8, 8, 0, 0]} 
                           barSize={40}
                         />
                      </BarChart>
                   </ResponsiveContainer>
                </div>
             </div>

             <div className="bg-[#111827] border border-white/5 rounded-[32px] p-8 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-10">Bookings by Type</h3>
                <div className="flex flex-col md:flex-row items-center gap-8">
                   <div className="h-[300px] w-full md:w-1/2">
                      <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                            <Pie
                              data={PIE_DATA}
                              cx="50%"
                              cy="50%"
                              innerRadius={70}
                              outerRadius={100}
                              paddingAngle={8}
                              dataKey="value"
                            >
                               {PIE_DATA.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={entry.color} />
                               ))}
                            </Pie>
                            <Tooltip 
                               contentStyle={{backgroundColor: '#1F2937', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '16px'}}
                            />
                         </PieChart>
                      </ResponsiveContainer>
                   </div>
                   <div className="w-full md:w-1/2 space-y-4">
                      {PIE_DATA.map((item) => (
                         <div key={item.name} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                            <div className="flex items-center gap-3">
                               <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                               <span className="text-sm font-bold text-white">{item.name}</span>
                            </div>
                            <span className="text-sm font-black text-slate-400">{item.value}%</span>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-[#111827] border border-white/5 rounded-[32px] p-8 shadow-xl overflow-hidden">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-white">Provider Utilization</h3>
                <Button variant="ghost" className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-400/5 font-bold text-xs uppercase tracking-widest gap-2">
                   Detailed View <ChevronDown className="w-4 h-4" />
                </Button>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="border-b border-white/5">
                         <th className="pb-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest px-4">Provider Name</th>
                         <th className="pb-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest px-4 text-center">Total Bookings</th>
                         <th className="pb-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest px-4 text-center">Hours Booked</th>
                         <th className="pb-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest px-4">Utilization</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                      {[
                        { name: "Dr. Amanda Clara", bookings: 432, hours: 216, utilization: 88, color: "bg-indigo-500" },
                        { name: "Dr. Esther Howard", bookings: 284, hours: 142, utilization: 62, color: "bg-purple-500" },
                        { name: "Dr. Robert Fox", bookings: 198, hours: 99, utilization: 45, color: "bg-pink-500" },
                      ].map((provider) => (
                        <tr key={provider.name} className="hover:bg-white/[0.01] transition-colors">
                           <td className="py-5 px-4">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 font-bold">
                                    {provider.name.split(' ')[1].charAt(0)}
                                 </div>
                                 <span className="font-bold text-white text-[15px]">{provider.name}</span>
                              </div>
                           </td>
                           <td className="py-5 px-4 text-center font-black text-slate-300">{provider.bookings}</td>
                           <td className="py-5 px-4 text-center font-bold text-slate-500">{provider.hours} hrs</td>
                           <td className="py-5 px-4 min-w-[200px]">
                              <div className="flex items-center gap-4">
                                 <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div 
                                      className={cn("h-full rounded-full transition-all duration-1000", provider.color)} 
                                      style={{ width: `${provider.utilization}%` }} 
                                    />
                                 </div>
                                 <span className="text-sm font-black text-white">{provider.utilization}%</span>
                              </div>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        </>
      )}
    </div>
  );
}
