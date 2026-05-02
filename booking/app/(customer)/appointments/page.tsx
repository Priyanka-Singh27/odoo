"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Booking = {
  id: string;
  slot_date: string;
  start_time: string;
  status: string;
  appointment_name: string;
  provider_name: string;
};

export default function AppointmentsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const load = async () => {
    const res = await fetch("/api/profile");
    if (!res.ok) return;
    const data = await res.json();
    setBookings(data.bookings || []);
  };

  useEffect(() => {
    void load();
  }, []);

  const now = new Date();
  const withDate = (b: Booking) => ({ ...b, dateObj: new Date(`${b.slot_date}T${b.start_time}`) });
  const upcoming = useMemo(
    () => bookings.map(withDate).filter((b) => b.dateObj >= now && b.status !== "cancelled"),
    [bookings],
  );
  const past = useMemo(
    () => bookings.map(withDate).filter((b) => b.dateObj < now || b.status === "cancelled"),
    [bookings],
  );

  const onCancel = async (id: string) => {
    await fetch(`/api/bookings/${id}/cancel`, { method: "POST" });
    await load();
  };

  const renderRows = (rows: Array<Booking & { dateObj: Date }>, upcomingMode: boolean) => (
    <div className="space-y-3">
      {rows.length === 0 ? (
        <div className="text-sm text-slate-500">No appointments.</div>
      ) : (
        rows.map((b) => (
          <div key={b.id} className="border border-slate-200 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-slate-900">{b.appointment_name}</h3>
                <p className="text-sm text-slate-500">
                  {b.provider_name} · {format(b.dateObj, "EEE, MMM dd yyyy 'at' hh:mm a")}
                </p>
              </div>
              <Badge variant="secondary" className="capitalize">{b.status}</Badge>
            </div>
            {upcomingMode && (
              <div className="flex gap-2 mt-4">
                <Link href={`/reschedule?bookingId=${b.id}`}>
                  <Button variant="outline" size="sm">Reschedule</Button>
                </Link>
                <Button variant="outline" size="sm" onClick={() => void onCancel(b.id)} className="text-red-600 border-red-200 hover:bg-red-50">
                  Cancel
                </Button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="p-8">
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h1 className="text-2xl font-semibold text-slate-900 mb-1">My Appointments</h1>
        <p className="text-sm text-slate-500 mb-6">Manage upcoming visits and review past bookings.</p>
        <Tabs defaultValue="upcoming">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">{renderRows(upcoming, true)}</TabsContent>
          <TabsContent value="past">{renderRows(past, false)}</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
