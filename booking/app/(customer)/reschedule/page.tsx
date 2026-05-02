"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { useRouter } from "next/navigation";

export default function ReschedulePage() {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const timeSlots = [
    "11:00AM", "11:30AM", "12:00AM", "01:00AM", "01:30AM", 
    "03:00AM", "03:30AM", "04:00AM", "05:00AM", "05:30AM", "06:00AM"
  ];
  
  const [selectedSlot, setSelectedSlot] = useState("12:00AM");

  const handleReschedule = () => {
    // API request here
    router.push("/confirmation");
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-8 overflow-y-auto">
      <div className="max-w-4xl w-full">
        <h1 className="text-2xl font-semibold text-slate-800 mb-6">Reschedule your appointment</h1>
        
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-8 w-full max-w-md">
          <p className="text-sm text-slate-600 font-medium">
            <span className="text-slate-400 mr-2">Current reservation:</span> 
            Friday 15th of December &ndash; 9:00
          </p>
        </div>

        <div className="flex gap-8 items-stretch h-full">
          {/* Calendar Side */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 w-[340px] shrink-0">
            <h3 className="text-base font-semibold text-slate-800 mb-4">Calendar</h3>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="w-full"
              classNames={{
                months: "w-full",
                month: "w-full space-y-4",
                table: "w-full border-collapse space-y-1",
                head_row: "flex w-full justify-between",
                head_cell: "text-slate-400 font-medium text-xs w-8 text-center",
                row: "flex w-full justify-between mt-2",
                cell: "h-8 w-8 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-transparent focus-within:relative focus-within:z-20",
                day: "h-8 w-8 p-0 font-normal hover:bg-blue-50 rounded-full transition-colors flex items-center justify-center",
                day_selected: "bg-blue-500 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-500 focus:text-white rounded-full",
                day_today: "font-semibold",
                day_outside: "text-slate-300 opacity-50",
                day_disabled: "text-slate-300 opacity-50",
                day_range_middle: "aria-selected:bg-blue-50 aria-selected:text-slate-900",
                day_hidden: "invisible",
              }}
            />
          </div>

          {/* Slots & Action Side */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex-1 flex flex-col">
            <h3 className="text-base font-semibold text-slate-800 mb-6">Visit Hours</h3>
            
            <div className="grid grid-cols-3 xl:grid-cols-4 gap-3 mb-8">
              {timeSlots.map((slot) => {
                const isSelected = selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`slot-pill px-4 py-2 rounded-xl text-sm font-medium border text-center ${
                      isSelected
                        ? "selected"
                        : "border-slate-200 text-slate-700 bg-white"
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-auto">
              <p className="text-sm text-slate-500 italic mb-6 leading-relaxed">
                &quot;Schedule your visit today and experience expert dental care brought right to your doorstep.&quot;
              </p>
              
              <button 
                onClick={handleReschedule}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 font-medium transition-colors"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
