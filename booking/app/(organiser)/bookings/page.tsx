"use client";

import { Search, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export interface BookingRecord {
  id: string;
  customerName: string;
  serviceName: string;
  providerName: string;
  date: string;
  time: string;
  status: "Confirmed" | "Pending" | "Cancelled" | "Completed";
  amount: number;
}

export default function BookingsList() {
  // Empty data state for fetching from API later
  const bookings: BookingRecord[] = [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-800">All Bookings</h1>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name..." 
              className="pl-9 pr-4 py-2 w-64 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px] rounded-xl border-slate-200 bg-white h-[38px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent bg-slate-50/50">
              <TableHead className="font-medium text-slate-600 h-12">Booking ID</TableHead>
              <TableHead className="font-medium text-slate-600 h-12">Customer</TableHead>
              <TableHead className="font-medium text-slate-600 h-12">Service</TableHead>
              <TableHead className="font-medium text-slate-600 h-12">Provider</TableHead>
              <TableHead className="font-medium text-slate-600 h-12">Date & Time</TableHead>
              <TableHead className="font-medium text-slate-600 h-12">Status</TableHead>
              <TableHead className="font-medium text-slate-600 h-12 text-right">Amount</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium text-slate-500">#{booking.id}</TableCell>
                  <TableCell className="font-medium text-slate-800">{booking.customerName}</TableCell>
                  <TableCell className="text-slate-600">{booking.serviceName}</TableCell>
                  <TableCell className="text-slate-600">{booking.providerName}</TableCell>
                  <TableCell className="text-slate-600">{booking.date} at {booking.time}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={
                      booking.status === "Confirmed" ? "bg-green-100 text-green-700" :
                      booking.status === "Pending" ? "bg-amber-100 text-amber-700" :
                      booking.status === "Completed" ? "bg-slate-100 text-slate-700" :
                      "bg-red-100 text-red-700"
                    }>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium text-slate-800">${booking.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger render={
                        <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      } />
                      <DropdownMenuContent align="end" className="w-40 rounded-xl">
                        <DropdownMenuItem className="cursor-pointer">Reschedule</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">Mark Completed</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">Cancel Booking</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-48 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <p>No bookings found.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
