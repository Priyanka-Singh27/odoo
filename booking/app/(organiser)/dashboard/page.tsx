"use client";

import { Users, CalendarDays, TrendingUp, Eye } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Interfaces for future data
export interface DashboardStats {
  totalBookings: number;
  bookingsTrend: number;
  upcoming: number;
  upcomingTrend: number;
  revenue: number;
  revenueTrend: number;
  views: number;
  viewsTrend: number;
}

export interface ChartDataPoint {
  date: string;
  bookings: number;
}

export interface BookingRow {
  id: string;
  customerName: string;
  serviceName: string;
  date: string;
  time: string;
  status: "Confirmed" | "Pending" | "Cancelled";
  amount: number;
}

export default function OrganiserDashboard() {
  // Empty states initialized to handle strictly defined real data later without mocking
  const stats = null as DashboardStats | null;
  const chartData: ChartDataPoint[] = [];
  const recentBookings: BookingRow[] = [];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Bookings" 
          value={stats?.totalBookings ?? 0} 
          trend={stats?.bookingsTrend ?? 0} 
          icon={CalendarDays} 
        />
        <StatCard 
          title="Upcoming" 
          value={stats?.upcoming ?? 0} 
          trend={stats?.upcomingTrend ?? 0} 
          icon={Users} 
        />
        <StatCard 
          title="Revenue" 
          value={`$${stats?.revenue ?? 0}`} 
          trend={stats?.revenueTrend ?? 0} 
          icon={TrendingUp} 
        />
        <StatCard 
          title="Views" 
          value={stats?.views ?? 0} 
          trend={stats?.viewsTrend ?? 0} 
          icon={Eye} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Bookings over time</h2>
          <div className="flex-1 min-h-[300px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="bookings" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorBookings)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-slate-400 text-sm">
                No chart data available
              </div>
            )}
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-0 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800">Recent Bookings</h2>
          </div>
          <div className="flex-1 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-medium">Customer</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="font-medium text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="py-4">
                        <div className="font-medium text-slate-800">{booking.customerName}</div>
                        <div className="text-xs text-slate-500">{booking.serviceName}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={
                          booking.status === "Confirmed" ? "bg-green-100 text-green-700 hover:bg-green-100" :
                          booking.status === "Pending" ? "bg-amber-100 text-amber-700 hover:bg-amber-100" :
                          "bg-red-100 text-red-700 hover:bg-red-100"
                        }>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium text-slate-800">${booking.amount}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-slate-400">
                      No recent bookings found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, icon: Icon }: { title: string, value: string | number, trend: number, icon: any }) {
  const isPositive = trend >= 0;
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-800">{value}</span>
      </div>
      <div className="mt-2 text-xs">
        {trend !== 0 ? (
          <span className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{trend}%
          </span>
        ) : (
          <span className="font-medium text-slate-400">0%</span>
        )}
        <span className="text-slate-400 ml-1">from last month</span>
      </div>
    </div>
  );
}
