"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

export default function BookingRightPanel({ onNext }: { onNext?: () => void }) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const timeSlots = [
    "11:00AM", "11:30AM", "12:00AM", "01:00AM", "01:30AM", 
    "03:00AM", "03:30AM", "04:00AM", "05:00AM", "05:30AM", "06:00AM"
  ];
  
  const [selectedSlot, setSelectedSlot] = useState("12:00AM");

  return (
    <div className="w-[340px] shrink-0 flex flex-col gap-6">
      {/* Calendar Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-slate-800">Calendar</h3>
          <button className="text-sm text-blue-500 hover:underline">View All &rarr;</button>
        </div>
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

      {/* Visit Hours Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-semibold text-slate-800">Visit Hours</h3>
          <button className="text-sm text-blue-500 hover:underline">View All &rarr;</button>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-6 flex-1 content-start overflow-y-auto">
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
        
        <button 
          onClick={onNext}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 font-medium transition-colors mt-auto"
        >
          Book an appointment
        </button>
      </div>
    </div>
  );
}
