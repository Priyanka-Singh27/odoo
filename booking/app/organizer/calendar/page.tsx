"use client";

import { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Plus,
  Loader2,
  X,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  startOfDay,
  eachHourOfInterval
} from "date-fns";

interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  appointment_name: string;
  provider_name: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  status: "confirmed" | "reserved" | "cancelled";
  people_count: number;
}

export default function CalendarPage() {
  const [view, setView] = useState<"month" | "week" | "day">("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/bookings");
      if (res.ok) {
        const result = await res.json();
        setBookings(result.data);
      }
    } catch (error) {
      toast.error("Failed to fetch calendar events");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const nextDate = () => {
    if (view === "month") setCurrentDate(addMonths(currentDate, 1));
    else if (view === "week") setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addDays(currentDate, 1));
  };

  const prevDate = () => {
    if (view === "month") setCurrentDate(subMonths(currentDate, 1));
    else if (view === "week") setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(subDays(currentDate, 1));
  };

  const getAppointmentsForDay = (date: Date) => {
    return bookings.filter(b => isSameDay(new Date(b.slot_date), date));
  };

  const hours = eachHourOfInterval({
    start: startOfDay(new Date()).setHours(8, 0, 0, 0),
    end: startOfDay(new Date()).setHours(20, 0, 0, 0),
  });

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="grid grid-cols-7 border-t border-l border-white/5 bg-[#111827] rounded-3xl overflow-hidden shadow-2xl">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="px-4 py-4 text-center text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] bg-white/[0.02] border-r border-b border-white/5">
            {day}
          </div>
        ))}
        {calendarDays.map((day, idx) => {
          const dayBookings = getAppointmentsForDay(day);
          return (
            <div 
              key={idx} 
              className={cn(
                "min-h-[140px] p-2 border-r border-b border-white/5 transition-colors",
                !isSameMonth(day, monthStart) ? "bg-white/[0.01] opacity-30" : "bg-transparent hover:bg-white/[0.02]",
                isSameDay(day, new Date()) && "bg-indigo-600/5"
              )}
            >
              <div className="flex justify-between items-center mb-2 px-2">
                <span className={cn(
                  "text-sm font-bold",
                  isSameDay(day, new Date()) ? "w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center -ml-1" : "text-slate-400"
                )}>
                  {format(day, "d")}
                </span>
              </div>
              <div className="space-y-1">
                {dayBookings.slice(0, 3).map(b => (
                  <div 
                    key={b.id}
                    onClick={() => setSelectedBooking(b)}
                    className={cn(
                      "px-2 py-1.5 rounded-lg text-[10px] font-bold truncate cursor-pointer transition-all hover:scale-[1.02]",
                      b.status === 'confirmed' ? "bg-green-500/10 text-green-400 border border-green-500/20" : 
                      b.status === 'reserved' ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : 
                      "bg-slate-700/30 text-slate-400 border border-white/5"
                    )}
                  >
                    {b.start_time} - {b.customer_name}
                  </div>
                ))}
                {dayBookings.length > 3 && (
                  <p className="text-[10px] text-slate-500 font-bold px-2">+{dayBookings.length - 3} more</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const startDate = startOfWeek(currentDate);
    const weekDays = eachDayOfInterval({ start: startDate, end: endOfWeek(startDate) });

    return (
      <div className="flex flex-col bg-[#111827] rounded-3xl overflow-hidden shadow-2xl border border-white/5">
        <div className="flex border-b border-white/5">
           <div className="w-20 shrink-0 border-r border-white/5 bg-white/[0.02]" />
           {weekDays.map(day => (
             <div key={day.toString()} className={cn(
               "flex-1 px-4 py-4 text-center border-r border-white/5 last:border-0 transition-colors",
               isSameDay(day, new Date()) ? "bg-indigo-600/5" : "bg-white/[0.02]"
             )}>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{format(day, "EEE")}</p>
                <p className={cn(
                  "text-xl font-bold",
                  isSameDay(day, new Date()) ? "text-indigo-400" : "text-white"
                )}>{format(day, "d")}</p>
             </div>
           ))}
        </div>
        <div className="flex-1 overflow-y-auto max-h-[800px] scrollbar-hide relative">
           {hours.map(hour => (
             <div key={hour.toString()} className="flex border-b border-white/[0.03] min-h-[80px] group">
                <div className="w-20 shrink-0 border-r border-white/5 text-right pr-4 py-3 text-[10px] font-bold text-slate-500 uppercase">
                   {format(hour, "HH:mm")}
                </div>
                {weekDays.map(day => {
                   const hourStart = format(hour, "HH:mm");
                   const bks = getAppointmentsForDay(day).filter(b => b.start_time.startsWith(hourStart.split(':')[0]));
                   return (
                     <div key={day.toString()} className="flex-1 border-r border-white/[0.03] last:border-0 p-1 relative">
                        {bks.map(b => (
                           <div 
                             key={b.id}
                             onClick={() => setSelectedBooking(b)}
                             className={cn(
                               "mb-1 px-3 py-2 rounded-xl text-xs font-bold shadow-lg transition-all hover:scale-[1.02] cursor-pointer",
                               b.status === 'confirmed' ? "bg-indigo-600 text-white shadow-indigo-600/20" : 
                               b.status === 'reserved' ? "bg-amber-600 text-white shadow-amber-600/20" : 
                               "bg-slate-700 text-slate-300"
                             )}
                           >
                              <div className="flex justify-between items-center mb-1">
                                <span>{b.start_time}</span>
                                <span className="text-[9px] opacity-80">{b.people_count}P</span>
                              </div>
                              <p className="truncate">{b.customer_name}</p>
                              <p className="text-[9px] opacity-70 truncate font-medium">{b.appointment_name}</p>
                           </div>
                        ))}
                     </div>
                   );
                })}
             </div>
           ))}
           {/* Current Time Indicator */}
           {isSameMonth(currentDate, new Date()) && (
              <div className="absolute left-20 right-0 h-[2px] bg-red-500 z-10 pointer-events-none" style={{ top: '250px' }}>
                 <div className="w-3 h-3 rounded-full bg-red-500 -ml-1.5 -mt-1.5 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              </div>
           )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Calendar</h1>
          <p className="text-slate-400 mt-1 text-sm font-medium">Keep track of your schedule and availability</p>
        </div>
        <div className="flex items-center gap-2 bg-[#111827] p-1.5 border border-white/5 rounded-2xl shadow-xl">
           {["month", "week", "day"].map(v => (
             <button 
               key={v}
               onClick={() => setView(v as any)}
               className={cn(
                 "px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                 view === v ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-slate-400 hover:text-white"
               )}
             >
               {v}
             </button>
           ))}
        </div>
      </div>

      <div className="flex items-center justify-between bg-[#111827] border border-white/5 rounded-3xl p-6 shadow-xl">
         <div className="flex items-center gap-6">
            <h2 className="text-2xl font-bold text-white min-w-[200px]">
               {format(currentDate, view === 'month' ? "MMMM yyyy" : "MMM dd, yyyy")}
            </h2>
            <div className="flex items-center gap-2">
               <button onClick={prevDate} className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition-all border border-white/5">
                  <ChevronLeft className="w-5 h-5" />
               </button>
               <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs rounded-xl transition-all border border-white/5 uppercase tracking-widest">
                  Today
               </button>
               <button onClick={nextDate} className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition-all border border-white/5">
                  <ChevronRight className="w-5 h-5" />
               </button>
            </div>
         </div>
         <div className="flex items-center gap-8">
            <div className="flex items-center gap-2.5">
               <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
               <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Confirmed</span>
            </div>
            <div className="flex items-center gap-2.5">
               <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
               <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Reserved</span>
            </div>
            <div className="flex items-center gap-2.5">
               <div className="w-3 h-3 rounded-full bg-slate-600" />
               <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Cancelled</span>
            </div>
         </div>
      </div>

      {isLoading ? (
        <div className="py-48 flex flex-col items-center justify-center gap-4">
           <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
           <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Schedule...</p>
        </div>
      ) : (
        <div className="animate-in fade-in zoom-in-95 duration-500">
           {view === 'month' ? renderMonthView() : renderWeekView()}
        </div>
      )}

      {/* Detail Slideover (Reusing Detail Modal logic would be better but keeping it simple) */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedBooking(null)} />
          <div className="relative w-full max-w-md bg-[#111827] h-full shadow-2xl border-l border-white/5 p-8 animate-in slide-in-from-right duration-300">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-white">Booking Detail</h3>
                <button onClick={() => setSelectedBooking(null)} className="p-2 text-slate-400 hover:text-white rounded-xl">
                   <X className="w-6 h-6" />
                </button>
             </div>
             
             <div className="space-y-8">
                <div className="flex items-center gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-[32px]">
                   <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 font-bold text-xl">
                      {selectedBooking.customer_name.charAt(0)}
                   </div>
                   <div>
                      <p className="text-lg font-bold text-white leading-none">{selectedBooking.customer_name}</p>
                      <p className="text-xs text-slate-500 mt-1">{selectedBooking.customer_email}</p>
                   </div>
                </div>

                <div className="space-y-3">
                   <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4">
                      <CalendarIcon className="w-5 h-5 text-indigo-400" />
                      <div>
                         <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Date</p>
                         <p className="text-white font-bold">{format(new Date(selectedBooking.slot_date), "EEEE, MMM dd, yyyy")}</p>
                      </div>
                   </div>
                   <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4">
                      <Clock className="w-5 h-5 text-indigo-400" />
                      <div>
                         <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Time</p>
                         <p className="text-white font-bold">{selectedBooking.start_time} - {selectedBooking.end_time || '10:00 AM'}</p>
                      </div>
                   </div>
                   <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4">
                      <Users className="w-5 h-5 text-indigo-400" />
                      <div>
                         <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Service & Provider</p>
                         <p className="text-white font-bold">{selectedBooking.appointment_name}</p>
                         <p className="text-xs text-slate-500 font-medium">with {selectedBooking.provider_name}</p>
                      </div>
                   </div>
                </div>

                <div className="pt-4 space-y-4">
                   <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                      <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">Status</span>
                      <Badge className={cn(
                        "px-3 py-1 rounded-full font-bold",
                        selectedBooking.status === 'confirmed' ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400"
                      )}>
                        {selectedBooking.status.toUpperCase()}
                      </Badge>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white rounded-xl h-14 font-bold">
                         Reschedule
                      </Button>
                      <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-14 font-bold shadow-lg shadow-indigo-600/20">
                         View Full
                      </Button>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
