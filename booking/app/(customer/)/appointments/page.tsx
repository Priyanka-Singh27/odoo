"use client";

import { useEffect, useMemo, useState } from "react";
import { format, isAfter, isBefore, parseISO } from "date-fns";
import { 
  CalendarDays, 
  Clock, 
  Users, 
  MapPin, 
  ChevronRight, 
  Calendar, 
  History, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  ExternalLink,
  Loader2,
  CalendarCheck
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";

type Booking = {
  id: string;
  slot_date: string;
  start_time: string;
  status: string;
  appointment_name: string;
  provider_name: string;
  location: string;
  duration: number;
  people_count: number;
};

export default function AppointmentsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    try {
      const res = await fetch("/api/profile");
      if (!res.ok) return;
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err) {
      toast.error("Failed to load appointments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const sortedBookings = useMemo(() => {
    return bookings.map(b => ({
      ...b,
      dateObj: new Date(`${b.slot_date}T${b.start_time}`)
    })).sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());
  }, [bookings]);

  const lastBooking = sortedBookings[0];
  const now = new Date();

  const upcoming = useMemo(
    () => sortedBookings.filter(b => b.dateObj >= now && b.status !== "cancelled"),
    [sortedBookings, now]
  );

  const past = useMemo(
    () => sortedBookings.filter(b => b.dateObj < now || b.status === "cancelled"),
    [sortedBookings, now]
  );

  const onCancel = async (id: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}/cancel`, { method: "POST" });
      if (res.ok) {
        toast.success("Appointment cancelled");
        await load();
      } else {
        toast.error("Failed to cancel");
      }
    } catch {
      toast.error("Error cancelling appointment");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="mt-4 text-slate-500 font-medium">Fetching your appointments...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Appointments</h1>
          <p className="text-slate-500 mt-1">Manage your schedule and view booking history.</p>
        </div>
        <Link href="/appointments">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <CalendarCheck className="w-4 h-4" />
            Book New
          </Button>
        </Link>
      </div>

      {/* Featured: Last Booking */}
      {lastBooking && (
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
          <div className="relative bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold uppercase tracking-wider">
                    Most Recent Booking
                  </span>
                  <Badge className={cn(
                    "capitalize",
                    lastBooking.status === "confirmed" ? "bg-green-50 text-green-700 border-green-200" : 
                    lastBooking.status === "cancelled" ? "bg-red-50 text-red-700 border-red-200" : "bg-slate-50 text-slate-700"
                  )}>
                    {lastBooking.status}
                  </Badge>
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900">{lastBooking.appointment_name}</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                      <CalendarDays className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">Time</p>
                      <p className="text-sm font-semibold">{format(lastBooking.dateObj, "MMM d, h:mm a")}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">Duration</p>
                      <p className="text-sm font-semibold">{lastBooking.duration} min</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                      <Users className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">People</p>
                      <p className="text-sm font-semibold">{lastBooking.people_count || 1}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-rose-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">Venue</p>
                      <p className="text-sm font-semibold truncate">{lastBooking.location || "Online/Office"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex md:flex-col gap-2">
                {lastBooking.status !== "cancelled" && lastBooking.dateObj >= now && (
                  <>
                    <Link href={`/reschedule?bookingId=${lastBooking.id}`} className="flex-1">
                      <Button variant="default" className="w-full bg-blue-600 hover:bg-blue-700">Reschedule</Button>
                    </Link>
                    <Button variant="outline" onClick={() => onCancel(lastBooking.id)} className="flex-1 text-red-600 border-red-200 hover:bg-red-50">Cancel</Button>
                  </>
                )}
                {(lastBooking.status === "cancelled" || lastBooking.dateObj < now) && (
                  <Button variant="outline" className="gap-2">
                    <RotateCcw className="w-4 h-4" /> Rebook
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Section */}
      <Tabs defaultValue="upcoming" className="w-full">
        <div className="flex items-center justify-between border-b border-slate-200 mb-6">
          <TabsList className="bg-transparent h-auto p-0 gap-8">
            <TabsTrigger 
              value="upcoming" 
              className="px-0 py-4 bg-transparent border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none shadow-none text-slate-500 font-semibold transition-all"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Upcoming
                <span className="ml-1 text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full">{upcoming.length}</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="past"
              className="px-0 py-4 bg-transparent border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none shadow-none text-slate-500 font-semibold transition-all"
            >
              <div className="flex items-center gap-2">
                <History className="w-4 h-4" />
                Past
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="upcoming" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcoming.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No upcoming appointments scheduled.</p>
              </div>
            ) : (
              upcoming.map((b) => (
                <BookingCard key={b.id} booking={b} onCancel={onCancel} canAction />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="past" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {past.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl">
                <History className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No past appointments found.</p>
              </div>
            ) : (
              past.map((b) => (
                <BookingCard key={b.id} booking={b} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BookingCard({ booking, onCancel, canAction = false }: { booking: any, onCancel?: (id: string) => void, canAction?: boolean }) {
  return (
    <div className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-200 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 truncate">{booking.appointment_name}</h3>
            <Badge variant="outline" className={cn(
              "text-[10px] h-5 px-1.5 capitalize shrink-0",
              booking.status === "confirmed" ? "text-green-600 bg-green-50 border-green-100" : 
              booking.status === "cancelled" ? "text-red-600 bg-red-50 border-red-100" : "text-slate-500"
            )}>
              {booking.status}
            </Badge>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-slate-500 text-[13px]">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>{format(booking.dateObj, "EEE, MMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-[13px]">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>{format(booking.dateObj, "h:mm a")} ({booking.duration} min)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-[13px]">
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span>With {booking.provider_name}</span>
            </div>
          </div>
        </div>
        
        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors shrink-0">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
      
      {canAction && (
        <div className="flex gap-2 mt-5 pt-4 border-t border-slate-100">
          <Link href={`/reschedule?bookingId=${booking.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full text-[12px] h-8">Reschedule</Button>
          </Link>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onCancel?.(booking.id)} 
            className="flex-1 text-[12px] h-8 text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
