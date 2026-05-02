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
      <div className="grid grid-cols-7 border-t border-l border-slate-200 bg-white rounded-2xl overflow-hidden shadow-sm">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="px-4 py-4 text-center text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] bg-slate-50 border-r border-b border-slate-200">
            {day}
          </div>
        ))}
        {calendarDays.map((day, idx) => {
          const dayBookings = getAppointmentsForDay(day);
          return (
            <div 
              key={idx} 
              className={cn(
                "min-h-[140px] p-2 border-r border-b border-slate-200 transition-colors",
                !isSameMonth(day, monthStart) ? "bg-slate-50 opacity-50" : "bg-white hover:bg-slate-50/50",
                isSameDay(day, new Date()) && "bg-blue-50/30"
              )}
            >
              <div className="flex justify-between items-center mb-2 px-2">
                <span className={cn(
                  "text-[13px] font-bold",
                  isSameDay(day, new Date()) ? "w-7 h-7 rounded-full bg-[#378ADD] text-white flex items-center justify-center -ml-1" : "text-slate-700"
                )}>
                  {format(day, "d")}
                </span>
              </div>
              <div className="space-y-1.5">
                {dayBookings.slice(0, 3).map(b => (
                  <div 
                    key={b.id}
                    onClick={() => setSelectedBooking(b)}
                    className={cn(
                      "px-2 py-1.5 rounded-md text-[11px] font-semibold truncate cursor-pointer transition-all hover:scale-[1.02]",
                      b.status === 'confirmed' ? "bg-green-50 text-green-700 border border-green-100" : 
                      b.status === 'reserved' ? "bg-amber-50 text-amber-700 border border-amber-100" : 
                      "bg-slate-100 text-slate-600 border border-slate-200"
                    )}
                  >
                    {b.start_time} - {b.customer_name}
                  </div>
                ))}
                {dayBookings.length > 3 && (
                  <p className="text-[10px] text-slate-500 font-semibold px-2">+{dayBookings.length - 3} more</p>
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
      <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
        <div className="flex border-b border-slate-200">
           <div className="w-20 shrink-0 border-r border-slate-200 bg-slate-50" />
           {weekDays.map(day => (
             <div key={day.toString()} className={cn(
               "flex-1 px-4 py-4 text-center border-r border-slate-200 last:border-0 transition-colors",
               isSameDay(day, new Date()) ? "bg-blue-50/50" : "bg-slate-50"
             )}>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{format(day, "EEE")}</p>
                <p className={cn(
                  "text-xl font-bold",
                  isSameDay(day, new Date()) ? "text-[#378ADD]" : "text-slate-900"
                )}>{format(day, "d")}</p>
             </div>
           ))}
        </div>
        <div className="flex-1 overflow-y-auto max-h-[800px] scrollbar-hide relative bg-white">
           {hours.map(hour => (
             <div key={hour.toString()} className="flex border-b border-slate-100 min-h-[80px] group">
                <div className="w-20 shrink-0 border-r border-slate-200 text-right pr-4 py-3 text-[11px] font-semibold text-slate-500 uppercase bg-slate-50/50">
                   {format(hour, "HH:mm")}
                </div>
                {weekDays.map(day => {
                   const hourStart = format(hour, "HH:mm");
                   const bks = getAppointmentsForDay(day).filter(b => b.start_time.startsWith(hourStart.split(':')[0]));
                   return (
                     <div key={day.toString()} className="flex-1 border-r border-slate-100 last:border-0 p-1.5 relative">
                        {bks.map(b => (
                           <div 
                             key={b.id}
                             onClick={() => setSelectedBooking(b)}
                             className={cn(
                               "mb-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold shadow-sm transition-all hover:shadow-md cursor-pointer border",
                               b.status === 'confirmed' ? "bg-white border-[#378ADD] text-slate-900 border-l-4" : 
                               b.status === 'reserved' ? "bg-white border-amber-400 text-slate-900 border-l-4" : 
                               "bg-slate-50 border-slate-300 text-slate-600 border-l-4"
                             )}
                           >
                              <div className="flex justify-between items-center mb-0.5">
                                <span className="text-[#378ADD] font-bold">{b.start_time}</span>
                                <span className="text-[10px] text-slate-400 font-medium">{b.people_count}P</span>
                              </div>
                              <p className="truncate text-slate-900">{b.customer_name}</p>
                              <p className="text-[10px] text-slate-500 truncate font-medium">{b.appointment_name}</p>
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
                 <div className="w-3 h-3 rounded-full bg-red-500 -ml-1.5 -mt-1.5 shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
              </div>
           )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Calendar</h1>
          <p className="text-slate-500 mt-1 text-[13px] font-medium">Keep track of your schedule and availability</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
           {["month", "week", "day"].map(v => (
             <button 
               key={v}
               onClick={() => setView(v as any)}
               className={cn(
                 "px-4 py-1.5 rounded-lg text-[12px] font-semibold uppercase tracking-wider transition-all",
                 view === v ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
               )}
             >
               {v}
             </button>
           ))}
        </div>
      </div>

      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
         <div className="flex items-center gap-6">
            <h2 className="text-xl font-bold text-slate-900 min-w-[180px]">
               {format(currentDate, view === 'month' ? "MMMM yyyy" : "MMM dd, yyyy")}
            </h2>
            <div className="flex items-center gap-2">
               <button onClick={prevDate} className="p-2 bg-white hover:bg-slate-50 text-slate-600 rounded-lg transition-all border border-slate-200">
                  <ChevronLeft className="w-4 h-4" />
               </button>
               <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-[12px] rounded-lg transition-all border border-slate-200 uppercase tracking-widest">
                  Today
               </button>
               <button onClick={nextDate} className="p-2 bg-white hover:bg-slate-50 text-slate-600 rounded-lg transition-all border border-slate-200">
                  <ChevronRight className="w-4 h-4" />
               </button>
            </div>
         </div>
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
               <span className="text-[12px] font-semibold text-slate-600">Confirmed</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
               <span className="text-[12px] font-semibold text-slate-600">Reserved</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
               <span className="text-[12px] font-semibold text-slate-600">Cancelled</span>
            </div>
         </div>
      </div>

      {isLoading ? (
        <div className="py-40 flex flex-col items-center justify-center gap-4">
           <Loader2 className="w-8 h-8 text-[#378ADD] animate-spin" />
           <p className="text-slate-500 font-semibold text-[13px]">Loading Schedule...</p>
        </div>
      ) : (
        <div className="animate-in fade-in duration-500">
           {view === 'month' ? renderMonthView() : renderWeekView()}
        </div>
      )}

      {/* Detail Slideover */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedBooking(null)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 p-8 animate-in slide-in-from-right duration-300">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-slate-900">Booking Detail</h3>
                <button onClick={() => setSelectedBooking(null)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                   <X className="w-5 h-5" />
                </button>
             </div>
             
             <div className="space-y-6">
                <div className="flex items-center gap-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                   <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-[#378ADD] font-bold text-xl">
                      {selectedBooking.customer_name.charAt(0)}
                   </div>
                   <div>
                      <p className="text-[15px] font-bold text-slate-900 leading-none mb-1">{selectedBooking.customer_name}</p>
                      <p className="text-[13px] text-slate-500">{selectedBooking.customer_email}</p>
                   </div>
                </div>

                <div className="space-y-3">
                   <div className="p-4 bg-white border border-slate-100 shadow-sm rounded-xl flex items-center gap-4">
                      <CalendarIcon className="w-5 h-5 text-[#378ADD]" />
                      <div>
                         <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Date</p>
                         <p className="text-slate-900 font-semibold text-[13px]">{format(new Date(selectedBooking.slot_date), "EEEE, MMM dd, yyyy")}</p>
                      </div>
                   </div>
                   <div className="p-4 bg-white border border-slate-100 shadow-sm rounded-xl flex items-center gap-4">
                      <Clock className="w-5 h-5 text-[#378ADD]" />
                      <div>
                         <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Time</p>
                         <p className="text-slate-900 font-semibold text-[13px]">{selectedBooking.start_time} - {selectedBooking.end_time || '10:00 AM'}</p>
                      </div>
                   </div>
                   <div className="p-4 bg-white border border-slate-100 shadow-sm rounded-xl flex items-center gap-4">
                      <Users className="w-5 h-5 text-[#378ADD]" />
                      <div>
                         <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Service & Provider</p>
                         <p className="text-slate-900 font-semibold text-[13px]">{selectedBooking.appointment_name}</p>
                         <p className="text-[12px] text-slate-500 font-medium">with {selectedBooking.provider_name}</p>
                      </div>
                   </div>
                </div>

                <div className="pt-4 space-y-4">
                   <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                      <span className="text-slate-500 font-bold text-[12px] uppercase tracking-wider">Status</span>
                      <Badge className={cn(
                        "px-3 py-1 rounded-full font-bold text-[11px]",
                        selectedBooking.status === 'confirmed' ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                      )}>
                        {selectedBooking.status.toUpperCase()}
                      </Badge>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-3 pt-2">
                      <Button variant="outline" className="border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl h-12 font-semibold">
                         Reschedule
                      </Button>
                      <Button className="bg-[#378ADD] hover:bg-[#2866A0] text-white rounded-xl h-12 font-semibold shadow-sm">
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
