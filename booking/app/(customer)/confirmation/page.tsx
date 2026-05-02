"use client";

import { Check, CalendarPlus } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

export default function ConfirmationPage() {
  const router = useRouter();
  
  // Mock flags from API
  const manageCapacity = true;
  const manualConfirmation = false; // toggle this to show amber vs green card
  
  const handleCancel = () => {
    // API logic goes here
    router.push("/book/123");
  };

  return (
    <div className="h-full w-full flex items-center justify-center p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 max-w-lg w-full">
        {/* Top Section */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="bg-green-50 rounded-full p-4 mb-4">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-semibold text-slate-800">Appointment {manualConfirmation ? "Reserved" : "Confirmed"}</h1>
            {!manualConfirmation && <Badge variant="default" className="bg-green-500 hover:bg-green-600">Confirmed</Badge>}
            {manualConfirmation && <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">Pending</Badge>}
          </div>
        </div>

        {/* Details List */}
        <div className="space-y-4 mb-8">
          <div className="flex justify-between border-b border-slate-100 pb-4">
            <span className="text-sm font-medium text-slate-500">Time</span>
            <span className="text-sm font-medium text-slate-800 text-right">Dec 12, 9:00 am</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-4">
            <span className="text-sm font-medium text-slate-500">Duration</span>
            <span className="text-sm font-medium text-slate-800 text-right">30 min</span>
          </div>
          {manageCapacity && (
            <div className="flex justify-between border-b border-slate-100 pb-4">
              <span className="text-sm font-medium text-slate-500">No. of people</span>
              <span className="text-sm font-medium text-slate-800 text-right">10</span>
            </div>
          )}
          <div className="flex justify-between pb-2">
            <span className="text-sm font-medium text-slate-500">Venue</span>
            <div className="text-sm font-medium text-slate-800 text-right flex flex-col">
              <span>Doctor's Office</span>
              <span className="text-slate-500 font-normal">64 Dexter Street</span>
              <span className="text-slate-500 font-normal">Springfield 380005, Ahmedabad</span>
            </div>
          </div>
        </div>

        {/* Calendar Links */}
        <div className="flex gap-4 mb-8">
          <button className="flex-1 border border-blue-500 text-blue-500 hover:bg-blue-50 rounded-xl py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors">
            <CalendarPlus className="w-4 h-4" /> Add to Google Calendar
          </button>
          <button className="flex-1 border border-blue-500 text-blue-500 hover:bg-blue-50 rounded-xl py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors">
            <CalendarPlus className="w-4 h-4" /> Add to iCal
          </button>
        </div>

        {/* Info Card */}
        {manualConfirmation ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
            <p className="text-sm text-amber-800 font-medium leading-relaxed text-center">
              Appointment Reserved &mdash; You'll receive an email when the organiser confirms your booking.
            </p>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
            <p className="text-sm text-green-800 font-medium leading-relaxed text-center">
              Thank you for your booking, we look forward to meeting you.
            </p>
          </div>
        )}

        {/* Bottom Action Row */}
        <div className="flex gap-4">
          <AlertDialog>
            <AlertDialogTrigger render={
              <button className="flex-1 border border-red-500 text-red-500 hover:bg-red-50 rounded-xl py-3 text-sm font-medium transition-colors">
                Cancel
              </button>
            } />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will cancel your appointment. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">Keep it</AlertDialogCancel>
                <AlertDialogAction onClick={handleCancel} className="rounded-xl bg-red-500 hover:bg-red-600 text-white">Yes, Cancel</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <button 
            onClick={() => router.push("/reschedule")}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 text-sm font-medium transition-colors"
          >
            Reschedule
          </button>
        </div>
      </div>
    </div>
  );
}
