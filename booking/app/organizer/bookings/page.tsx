"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Clock, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Clock4,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Loader2,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  appointment_name: string;
  provider_name: string;
  slot_date: string;
  start_time: string;
  status: "confirmed" | "reserved" | "cancelled";
  people_count: number;
  venue?: string;
  answers?: { question_key: string, answer_value: string }[];
}

export default function BookingsList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [cancelId, setCancelId] = useState<string | null>(null);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/bookings");
      if (res.ok) {
        const result = await res.json();
        setBookings(result.data);
      }
    } catch (error) {
      toast.error("Failed to fetch bookings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (selectedBookingId) {
      setIsDetailLoading(true);
      fetch(`/api/bookings/${selectedBookingId}`)
        .then(res => res.json())
        .then(data => setSelectedBooking(data))
        .finally(() => setIsDetailLoading(false));
    } else {
      setSelectedBooking(null);
    }
  }, [selectedBookingId]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setBookings(prev => 
          prev.map(b => b.id === id ? { ...b, status: newStatus as any } : b)
        );
        if (selectedBooking?.id === id) {
          setSelectedBooking({ ...selectedBooking, status: newStatus as any });
        }
        toast.success(`Booking ${newStatus === 'confirmed' ? 'confirmed' : 'cancelled'}`);
      }
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setCancelId(null);
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.appointment_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-medium bg-[#EAF3DE] text-[#3B6D11] border border-[#C0DD97]">
             <span className="mr-1.5 w-1.5 h-1.5 rounded-full bg-current" /> Confirmed
          </span>
        );
      case "reserved":
      case "pending":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-medium bg-[#FAEEDA] text-[#854F0B] border border-[#E9D4B5]">
             <span className="mr-1.5 w-1.5 h-1.5 rounded-full bg-current" /> Reserved
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-medium bg-[#FCEBEB] text-[#A32D2D] border border-[#E9C3C3]">
             <span className="mr-1.5 w-1.5 h-1.5 rounded-full bg-current" /> Cancelled
          </span>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Bookings</h1>
        <p className="text-slate-500 mt-1 text-sm">Monitor and manage your incoming appointments</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 w-full md:w-80 shadow-sm">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Search bookings..." 
            className="bg-transparent border-none focus:ring-0 text-[13px] ml-2 text-slate-900 placeholder:text-slate-400 w-full outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-white border-slate-200 rounded-lg h-9 text-slate-700 w-full md:w-40 text-[13px]">
               <div className="flex items-center gap-2">
                 <Filter className="w-3.5 h-3.5 text-slate-400" />
                 <SelectValue placeholder="Status" />
               </div>
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200">
               <SelectItem value="all">All Statuses</SelectItem>
               <SelectItem value="confirmed">Confirmed</SelectItem>
               <SelectItem value="reserved">Reserved</SelectItem>
               <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[13px] font-medium text-slate-500">Customer</th>
                <th className="px-6 py-4 text-[13px] font-medium text-slate-500">Service</th>
                <th className="px-6 py-4 text-[13px] font-medium text-slate-500">Date & Time</th>
                <th className="px-6 py-4 text-[13px] font-medium text-slate-500">Status</th>
                <th className="px-6 py-4 text-[13px] font-medium text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center">
                    <Loader2 className="w-6 h-6 text-[#378ADD] animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 text-[13px]">Loading bookings...</p>
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center">
                    <p className="text-slate-500 text-[13px]">No bookings found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr 
                    key={b.id} 
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    onClick={() => setSelectedBookingId(b.id)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#378ADD] font-medium text-sm border border-blue-100">
                           {b.customer_name.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-900 text-[13px]">
                          {b.customer_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600 text-[13px]">{b.appointment_name}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900 text-[13px]">{format(new Date(b.slot_date), "MMM d, yyyy")}</span>
                        <span className="text-[12px] text-slate-500">{b.start_time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       {getStatusBadge(b.status)}
                    </td>
                    <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                       {b.status === 'reserved' ? (
                         <div className="flex items-center justify-end gap-2">
                           <Button size="sm" className="h-7 text-[12px] px-3 bg-[#378ADD] hover:bg-[#2866A0] text-white" onClick={() => handleUpdateStatus(b.id, 'confirmed')}>
                             Confirm
                           </Button>
                           <Button size="sm" variant="ghost" className="h-7 text-[12px] px-2 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => setCancelId(b.id)}>
                             Reject
                           </Button>
                         </div>
                       ) : (
                         <span className="text-slate-300">—</span>
                       )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog open={!!cancelId} onOpenChange={(open) => !open && setCancelId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? The customer will be notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg h-9 text-[13px]">No, keep it</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => cancelId && handleUpdateStatus(cancelId, 'cancelled')}
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg h-9 text-[13px]"
            >
              Yes, cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Booking Detail Drawer (shadcn Sheet) */}
      <Sheet open={!!selectedBookingId} onOpenChange={(open) => !open && setSelectedBookingId(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto w-full p-0 flex flex-col">
           {isDetailLoading || !selectedBooking ? (
             <div className="flex flex-col items-center justify-center h-full gap-4">
                <Loader2 className="w-8 h-8 text-[#378ADD] animate-spin" />
                <p className="text-slate-500 text-sm">Fetching details...</p>
             </div>
           ) : (
             <>
               <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900 truncate pr-4">{selectedBooking.appointment_name}</h2>
                  <div className="shrink-0">{getStatusBadge(selectedBooking.status)}</div>
               </div>

               <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  <div>
                     <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Customer</p>
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#378ADD] font-medium text-lg border border-blue-100">
                           {selectedBooking.customer_name.charAt(0)}
                        </div>
                        <div>
                           <h3 className="font-medium text-slate-900">{selectedBooking.customer_name}</h3>
                           <div className="flex flex-col gap-0.5 mt-1">
                              <span className="text-slate-500 text-[13px]">{selectedBooking.customer_email}</span>
                              <span className="text-slate-500 text-[13px]">+91 98765 43210</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="h-[1px] bg-slate-100 w-full" />

                  <div>
                     <div className="grid grid-cols-2 gap-y-4 text-[13px]">
                        <div className="text-slate-500">Date & Time</div>
                        <div className="font-medium text-slate-900">
                           {format(new Date(selectedBooking.slot_date), "MMM d, yyyy")} · {selectedBooking.start_time}
                        </div>

                        <div className="text-slate-500">Duration</div>
                        <div className="font-medium text-slate-900">30 min</div>

                        <div className="text-slate-500">Provider</div>
                        <div className="font-medium text-slate-900">{selectedBooking.provider_name}</div>

                        <div className="text-slate-500">Venue</div>
                        <div className="font-medium text-slate-900">{selectedBooking.venue || "Main Clinic"}</div>

                        <div className="text-slate-500">No. of people</div>
                        <div className="font-medium text-slate-900">{selectedBooking.people_count}</div>
                     </div>
                  </div>

                  <div className="h-[1px] bg-slate-100 w-full" />

                  <div>
                     <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Customer answers</p>
                     <div className="space-y-4">
                        {selectedBooking.answers && selectedBooking.answers.length > 0 ? (
                           selectedBooking.answers.map((a, idx) => (
                             <div key={idx}>
                                <p className="text-slate-500 text-[13px] mb-1 capitalize">{a.question_key}:</p>
                                <p className="text-slate-900 text-[13px] font-medium">{a.answer_value}</p>
                             </div>
                           ))
                        ) : (
                           <p className="text-slate-500 text-[13px]">No questions answered.</p>
                        )}
                     </div>
                  </div>
               </div>

               <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3 mt-auto">
                  {selectedBooking.status === 'reserved' ? (
                     <>
                        <Button 
                          onClick={() => setCancelId(selectedBooking.id)}
                          variant="outline" 
                          className="flex-1 bg-white border-slate-200 text-slate-700 hover:text-red-600 hover:bg-red-50 hover:border-red-200"
                        >
                           Cancel booking
                        </Button>
                        <Button 
                          onClick={() => handleUpdateStatus(selectedBooking.id, 'confirmed')}
                          className="flex-1 bg-[#378ADD] hover:bg-[#2866A0] text-white"
                        >
                           Confirm booking
                        </Button>
                     </>
                  ) : (
                     <Button 
                       onClick={() => setCancelId(selectedBooking.id)}
                       variant="outline" 
                       className="w-full bg-white border-slate-200 text-slate-700 hover:text-red-600 hover:bg-red-50 hover:border-red-200"
                       disabled={selectedBooking.status === 'cancelled'}
                     >
                        {selectedBooking.status === 'cancelled' ? 'Cancelled' : 'Cancel booking'}
                     </Button>
                  )}
               </div>
             </>
           )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
