"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Booking = {
  id: string;
  slot_date: string;
  start_time: string;
  status: string;
  appointment_name: string;
};

export default function CustomerProfile() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const run = async () => {
      const res = await fetch("/api/profile");
      if (!res.ok) return;
      const data = await res.json();
      setFullName(data.user?.fullName || "");
      setEmail(data.user?.email || "");
      setBookings(data.bookings || []);
    };
    void run();
  }, []);

  const now = new Date();
  const upcoming = useMemo(
    () => bookings.filter((b) => new Date(`${b.slot_date}T${b.start_time}`) >= now && b.status !== "cancelled"),
    [bookings],
  );
  const past = useMemo(
    () => bookings.filter((b) => new Date(`${b.slot_date}T${b.start_time}`) < now || b.status === "cancelled"),
    [bookings],
  );

  const onSave = async () => {
    setSaving(true);
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName }),
    });
    setSaving(false);
  };

  return (
    <div className="p-8 grid gap-6 lg:grid-cols-[380px_1fr]">
      <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <h1 className="text-xl font-semibold text-slate-900">My Profile</h1>
        <div className="space-y-2">
          <label className="text-sm text-slate-600">Full Name</label>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-slate-600">Email</label>
          <Input value={email} disabled />
        </div>
        <Button onClick={onSave} disabled={saving}>{saving ? "Saving..." : "Save Profile"}</Button>
      </section>

      <section className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Appointment Summary</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Total</p>
            <p className="text-2xl font-semibold text-slate-900">{bookings.length}</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Upcoming</p>
            <p className="text-2xl font-semibold text-slate-900">{upcoming.length}</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Past</p>
            <p className="text-2xl font-semibold text-slate-900">{past.length}</p>
          </div>
        </div>
        <div className="mt-6 space-y-2">
          <p className="text-sm text-slate-500">Recent bookings</p>
          {bookings.slice(0, 5).map((b) => (
            <div key={b.id} className="flex items-center justify-between border border-slate-100 rounded-lg p-3">
              <p className="text-sm text-slate-800">{b.appointment_name}</p>
              <Badge variant="secondary" className="capitalize">{b.status}</Badge>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
