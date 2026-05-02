"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PenSquare } from "lucide-react";
import Link from "next/link";

export default function CustomerProfile() {
  const getBadgeColor = (status: string) => {
    switch(status) {
      case "Confirmed": return "bg-green-100 text-green-700 hover:bg-green-200 border-green-200";
      case "Pending": return "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200";
      case "Cancelled": return "bg-red-100 text-red-700 hover:bg-red-200 border-red-200";
      case "Reserved": return "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200";
      default: return "";
    }
  };

  return (
    <div className="h-full w-full flex p-8 gap-8 overflow-hidden">
      {/* Left: Profile Info Card */}
      <div className="w-[300px] shrink-0 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center">
        <div className="relative mb-6 mt-4">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-100">
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Cameron" className="w-full h-full object-cover" />
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white border-2 border-white hover:bg-blue-600 transition-colors">
            <PenSquare className="w-4 h-4" />
          </button>
        </div>
        <h2 className="text-xl font-semibold text-slate-800">Cameron Williamson</h2>
        <p className="text-sm text-slate-500 mb-8">cameron.w@example.com</p>
        
        <button className="w-full py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
          Edit Profile
        </button>
      </div>

      {/* Right: Tabs and Appointments */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 overflow-y-auto">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">My Appointments</h2>
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-6 bg-slate-100/50 rounded-full p-1 inline-flex h-10 items-center justify-center">
            <TabsTrigger value="upcoming" className="rounded-full px-6 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">Upcoming</TabsTrigger>
            <TabsTrigger value="past" className="rounded-full px-6 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">Past</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            <div className="space-y-4">
              {/* Upcoming Item */}
              <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 font-semibold shrink-0">
                    PC
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">Psychological Consultation</h4>
                    <p className="text-sm text-slate-500">Amanda Clara &middot; Dec 15, 2026 at 9:00 AM</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <Badge variant="secondary" className={getBadgeColor("Confirmed")}>Confirmed</Badge>
                  <div className="flex items-center gap-4">
                    <Link href="/reschedule" className="text-sm font-medium text-blue-500 hover:underline">Reschedule</Link>
                    <button className="text-sm font-medium text-red-500 hover:underline">Cancel</button>
                  </div>
                </div>
              </div>
              {/* Another Item */}
              <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 font-semibold shrink-0">
                    DT
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">Dental Checkup</h4>
                    <p className="text-sm text-slate-500">Dr. Smith &middot; Dec 18, 2026 at 11:30 AM</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <Badge variant="secondary" className={getBadgeColor("Pending")}>Pending</Badge>
                  <div className="flex items-center gap-4">
                    <Link href="/reschedule" className="text-sm font-medium text-blue-500 hover:underline">Reschedule</Link>
                    <button className="text-sm font-medium text-red-500 hover:underline">Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="past">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:shadow-sm transition-shadow opacity-75">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-semibold shrink-0">
                    GC
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">General Checkup</h4>
                    <p className="text-sm text-slate-500">Dr. House &middot; Oct 10, 2026 at 10:00 AM</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100">Completed</Badge>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
