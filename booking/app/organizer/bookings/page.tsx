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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
        toast.success(`Booking ${newStatus === 'confirmed' ? 'confirmed' : 'cancelled'} successfully`);
      }
    } catch (error) {
      toast.error("Failed to update status");
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
        return <Badge className="bg-green-500/10 text-green-400 border-green-500/20 px-3 py-1 rounded-full font-bold">Confirmed</Badge>;
      case "reserved":
        return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 px-3 py-1 rounded-full font-bold">Reserved</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500/10 text-red-400 border-red-500/20 px-3 py-1 rounded-full font-bold">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Bookings</h1>
        <p className="text-slate-400 mt-1 text-sm font-medium">Monitor and manage your incoming appointments</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center bg-[#111827] border border-white/5 rounded-2xl px-5 py-3 w-full md:w-96 focus-within:border-indigo-500/30 transition-all shadow-xl shadow-black/20">
          <Search className="w-5 h-5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search bookings..." 
            className="bg-transparent border-none focus:ring-0 text-[15px] ml-3 text-white placeholder:text-slate-500 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-[#111827] border-white/5 rounded-2xl h-12 text-white w-full md:w-48">
               <div className="flex items-center gap-2">
                 <Filter className="w-4 h-4 text-slate-500" />
                 <SelectValue placeholder="Status" />
               </div>
            </SelectTrigger>
            <SelectContent className="bg-[#1F2937] border-white/10 text-slate-200">
               <SelectItem value="all">All Statuses</SelectItem>
               <SelectItem value="confirmed">Confirmed</SelectItem>
               <SelectItem value="reserved">Reserved</SelectItem>
               <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-[#111827] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Customer Name</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Service</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Date & Time</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-4" />
                    <p className="text-slate-400 font-medium">Loading bookings...</p>
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <p className="text-slate-400 font-medium">No bookings found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr 
                    key={b.id} 
                    className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                    onClick={() => setSelectedBookingId(b.id)}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-sm">
                           {b.customer_name.charAt(0)}
                        </div>
                        <span className="font-bold text-white text-[15px] group-hover:text-indigo-400 transition-colors">
                          {b.customer_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-medium text-slate-300 text-[15px]">{b.appointment_name}</td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-[15px]">{format(new Date(b.slot_date), "MMM dd, yyyy")}</span>
                        <span className="text-xs text-slate-500 font-bold">{b.start_time}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                       {getStatusBadge(b.status)}
                    </td>
                    <td className="px-8 py-5 text-right">
                       <button className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                          <ChevronRight className="w-5 h-5" />
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Detail Panel (Right Slide-in) */}
      {selectedBookingId && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedBookingId(null)}
          />
          
          <div className="relative w-full max-w-lg bg-[#111827] h-full shadow-2xl flex flex-col border-l border-white/5 animate-in slide-in-from-right duration-300">
            <header className="h-20 flex items-center justify-between px-8 border-b border-white/5 shrink-0">
               <h2 className="text-xl font-bold text-white">Booking Details</h2>
               <button 
                 onClick={() => setSelectedBookingId(null)}
                 className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
               >
                 <X className="w-6 h-6" />
               </button>
            </header>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
              {isDetailLoading || !selectedBooking ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                   <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                   <p className="text-slate-400 font-medium">Fetching details...</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                     <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-2xl">
                        {selectedBooking.customer_name.charAt(0)}
                     </div>
                     <div>
                        <h3 className="text-2xl font-bold text-white leading-tight">{selectedBooking.customer_name}</h3>
                        <div className="flex flex-col gap-1 mt-1">
                           <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                              <Mail className="w-3.5 h-3.5" /> {selectedBooking.customer_email}
                           </div>
                           <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                              <Phone className="w-3.5 h-3.5" /> +91 98765 43210
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Appointment Information</p>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                           <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Service</p>
                           <p className="text-white font-bold">{selectedBooking.appointment_name}</p>
                        </div>
                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                           <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Provider</p>
                           <p className="text-white font-bold">{selectedBooking.provider_name}</p>
                        </div>
                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                           <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Date & Time</p>
                           <p className="text-white font-bold">{format(new Date(selectedBooking.slot_date), "EEE, MMM dd")}</p>
                           <p className="text-indigo-400 font-bold text-sm">{selectedBooking.start_time}</p>
                        </div>
                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                           <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Capacity</p>
                           <p className="text-white font-bold">{selectedBooking.people_count} {selectedBooking.people_count > 1 ? 'People' : 'Person'}</p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Venue</p>
                     <div className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                           <MapPin className="w-5 h-5 text-indigo-400" />
                        </div>
                        <span className="text-white font-bold">{selectedBooking.venue || "Main Clinic / Online"}</span>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Customer's Answers</p>
                     <div className="space-y-3">
                        {selectedBooking.answers && selectedBooking.answers.length > 0 ? (
                           selectedBooking.answers.map((a, idx) => (
                             <div key={idx} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1.5">{a.question_key}</p>
                                <p className="text-slate-200 text-[15px] font-medium leading-relaxed">{a.answer_value}</p>
                             </div>
                           ))
                        ) : (
                           <div className="p-8 border border-dashed border-white/5 rounded-3xl text-center text-slate-500 text-sm font-medium">
                              No custom questions were answered.
                           </div>
                        )}
                     </div>
                  </div>

                  <div className="pt-4 flex flex-col gap-3">
                     <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">Current Status</span>
                        {getStatusBadge(selectedBooking.status)}
                     </div>

                     {selectedBooking.status === 'reserved' && (
                        <div className="grid grid-cols-2 gap-4 pt-4">
                           <Button 
                             onClick={() => handleUpdateStatus(selectedBooking.id, 'cancelled')}
                             variant="outline" 
                             className="h-14 border-red-500/20 hover:bg-red-500/10 text-red-400 rounded-2xl font-bold gap-2"
                           >
                              <XCircle className="w-5 h-5" /> Cancel
                           </Button>
                           <Button 
                             onClick={() => handleUpdateStatus(selectedBooking.id, 'confirmed')}
                             className="h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold gap-2 shadow-xl shadow-indigo-600/20"
                           >
                              <CheckCircle2 className="w-5 h-5" /> Confirm
                           </Button>
                        </div>
                     )}

                     {selectedBooking.status === 'confirmed' && (
                        <Button 
                          onClick={() => handleUpdateStatus(selectedBooking.id, 'cancelled')}
                          variant="outline" 
                          className="h-14 mt-4 border-white/10 hover:bg-red-500/5 hover:text-red-400 text-slate-400 rounded-2xl font-bold gap-2"
                        >
                           <XCircle className="w-5 h-5" /> Cancel Booking
                        </Button>
                     )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
