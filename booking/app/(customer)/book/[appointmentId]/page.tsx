"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import MultiStepProgress from "@/components/shared/MultiStepProgress";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import CapacityStepper from "@/components/booking/CapacityStepper";

type Provider = { id: string; name: string; specialty: string | null };
type Appointment = {
  id: string;
  name: string;
  duration: number;
  manage_capacity: number;
  max_bookings_per_slot: number;
  advance_payment: number;
  providers: Provider[];
};
type Slot = {
  id: string;
  startTime: string;
  endTime: string;
  remainingCapacity: number;
  isAvailable: boolean;
};

export default function BookingWizard() {
  const router = useRouter();
  const params = useParams<{ appointmentId: string }>();
  const appointmentId = params.appointmentId;

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [providerId, setProviderId] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotId, setSlotId] = useState("");
  const [capacity, setCapacity] = useState(1);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const manageCapacity = appointment?.manage_capacity === 1;
  const stepLabels = useMemo(() => {
    const labels = ["Provider", "Date & Slot"];
    if (manageCapacity) labels.push("Capacity");
    labels.push("Questions");
    return labels;
  }, [manageCapacity]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const res = await fetch(`/api/appointments/${appointmentId}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = (await res.json()) as Appointment;
      setAppointment(data);
      setProviderId(data.providers?.[0]?.id ?? "");
      setLoading(false);
    };
    void run();
  }, [appointmentId]);

  useEffect(() => {
    const run = async () => {
      if (!providerId || !date) return;
      const day = format(date, "yyyy-MM-dd");
      const res = await fetch(`/api/slots?appointmentId=${appointmentId}&providerId=${providerId}&date=${day}`);
      if (!res.ok) return;
      const data = (await res.json()) as { data: Slot[] };
      setSlots(data.data || []);
      setSlotId("");
    };
    void run();
  }, [appointmentId, providerId, date]);

  const selectedSlot = slots.find((s) => s.id === slotId);
  const capacityMax = Math.max(1, Math.min(appointment?.max_bookings_per_slot ?? 1, selectedSlot?.remainingCapacity ?? 1));
  const questionsStep = manageCapacity ? 4 : 3;

  const submitBooking = async () => {
    if (!providerId || !slotId) return;
    setSubmitting(true);
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appointmentId,
        providerId,
        slotId,
        peopleCount: manageCapacity ? capacity : 1,
        answers: { notes },
      }),
    });
    setSubmitting(false);
    if (!res.ok) return;
    const data = (await res.json()) as { data?: { id: string } };
    router.push(`/confirmation?bookingId=${data.data?.id ?? ""}`);
  };

  if (loading || !appointment) {
    return <div className="p-6 text-slate-500">Loading booking flow...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">{appointment.name}</h1>
      <MultiStepProgress steps={stepLabels} currentStep={step} />

      {step === 1 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <h2 className="font-semibold text-slate-800">Select Provider</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {appointment.providers.map((p) => (
              <button
                key={p.id}
                onClick={() => setProviderId(p.id)}
                className={`text-left border rounded-xl p-3 ${providerId === p.id ? "border-blue-500 bg-blue-50" : "border-slate-200"}`}
              >
                <p className="font-medium text-slate-900">{p.name}</p>
                <p className="text-sm text-slate-500">{p.specialty || "Provider"}</p>
              </button>
            ))}
          </div>
          <Button disabled={!providerId} onClick={() => setStep(2)}>Next</Button>
        </div>
      )}

      {step === 2 && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <Calendar mode="single" selected={date} onSelect={setDate} disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))} />
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4">
            <h3 className="font-medium text-slate-800">Available Slots</h3>
            <div className="grid grid-cols-2 gap-2">
              {slots.map((s) => (
                <button
                  key={s.id}
                  disabled={!s.isAvailable}
                  onClick={() => setSlotId(s.id)}
                  className={`border rounded-lg py-2 text-sm ${
                    slotId === s.id ? "bg-blue-600 text-white border-blue-600" : "border-slate-200"
                  } ${!s.isAvailable ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  {s.startTime}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button disabled={!slotId} onClick={() => setStep(manageCapacity ? 3 : 3)}>Next</Button>
            </div>
          </div>
        </div>
      )}

      {manageCapacity && step === 3 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md">
          <h2 className="font-semibold mb-4 text-slate-800">Select Capacity</h2>
          <CapacityStepper value={capacity} onChange={setCapacity} max={capacityMax} hideButton />
          <div className="flex gap-2 mt-5">
            <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
            <Button onClick={() => setStep(4)}>Next</Button>
          </div>
        </div>
      )}

      {step === questionsStep && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-2xl space-y-4">
          <h2 className="font-semibold text-slate-800">Questions</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes for the organiser"
            className="w-full min-h-28 border border-slate-200 rounded-xl p-3"
          />
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(manageCapacity ? 3 : 2)}>Back</Button>
            <Button disabled={submitting} onClick={submitBooking}>{submitting ? "Booking..." : "Confirm Booking"}</Button>
          </div>
        </div>
      )}
    </div>
  );
}
