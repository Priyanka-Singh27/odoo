"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AppointmentCard, { AppointmentType } from "./AppointmentCard";
import AppointmentSidebar from "./AppointmentSidebar";

export default function CustomerHomeClient({ appointments }: { appointments: AppointmentType[] }) {
  const router = useRouter();
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentType | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleCardClick = (appointment: AppointmentType) => {
    setSelectedAppointment(appointment);
    setIsSidebarOpen(true);
  };

  const handleBookClick = () => {
    if (!selectedAppointment) return;
    setIsSidebarOpen(false);
    router.push(`/book/${selectedAppointment.id}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Available Services</h1>
          <p className="text-slate-500">Select an appointment type below to view details and book your session.</p>
        </div>

        {appointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((appointment) => (
              <AppointmentCard 
                key={appointment.id} 
                appointment={appointment} 
                onClick={() => handleCardClick(appointment)} 
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No appointments available</h3>
            <p className="text-slate-500">There are currently no published appointments. Please check back later.</p>
          </div>
        )}
      </div>

      <AppointmentSidebar 
        appointment={selectedAppointment} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onBook={handleBookClick} 
      />

    </div>
  );
}
