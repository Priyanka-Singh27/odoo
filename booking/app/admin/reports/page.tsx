"use client";

import { useState, useEffect } from "react";
import { 
  TrendingUp, Users, Calendar, Download, ArrowUpRight, Loader2
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
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

export default function AdminReportsPage() {
  const [period, setPeriod] = useState("7days");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [period]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reports</h1>
          <p className="text-slate-500 mt-1 text-[13px]">Platform-wide performance and analytics</p>
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
            {[
              { title: "Total Bookings", value: "1,248", sub: "↑ 142 this week", trend: "+12%" },
              { title: "Revenue", value: "$24,800", sub: "↑ $3,200 this week", trend: "+15%" },
              { title: "Top Organiser", value: "Maya Org.", sub: "312 bookings" },
            ].map(card => (
              <div key={card.title} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                <p className="text-slate-500 font-medium text-[13px] mb-2">{card.title}</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-3xl font-bold text-slate-900">{card.value}</h3>
                  {card.trend && (
                    <div className="flex items-center gap-1 text-green-600 text-[13px] font-medium">
                      <ArrowUpRight className="w-3.5 h-3.5" /> {card.trend}
                    </div>
                  )}
                </div>
                <p className="text-slate-400 text-[12px] mt-2">{card.sub}</p>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-slate-900 mb-6">Bookings over time</h3>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={BAR_DATA}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                  <Tooltip
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: '8px'}}
                  />
                  <Bar dataKey="count" fill="#378ADD" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
