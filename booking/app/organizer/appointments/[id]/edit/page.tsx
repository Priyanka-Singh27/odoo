"use client";

import AppointmentForm from "@/components/organiser/AppointmentForm";
import { use } from "react";

export default function EditAppointmentPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return <AppointmentForm id={resolvedParams.id} />;
}
