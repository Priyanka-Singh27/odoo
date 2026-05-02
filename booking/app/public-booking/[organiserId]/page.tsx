"use client";

import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

export interface PublicService {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  description?: string;
}

export interface OrganiserProfile {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
}

export default function PublicBookingPage() {
  // Empty states for prop-driven architecture, avoiding mock arrays
  const organiser = null as OrganiserProfile | null;
  const services: PublicService[] = [];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-2xl mx-auto py-12 px-6">
        {/* Organiser Profile Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-24 h-24 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center overflow-hidden mb-4">
            {organiser?.logoUrl ? (
              <img src={organiser.logoUrl} alt={organiser.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-blue-50 flex items-center justify-center text-blue-500 font-bold text-3xl">
                {organiser?.name ? organiser.name.charAt(0) : "O"}
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            {organiser?.name || "Organiser Name"}
          </h1>
          <p className="text-slate-500 max-w-md">
            {organiser?.description || "Welcome to our booking page. Please select a service below to schedule your appointment."}
          </p>
        </div>

        {/* Services List */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 px-1">Available Services</h2>
          
          {services.length > 0 ? (
            services.map((service) => (
              <div key={service.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex items-center justify-between group">
                <div>
                  <h3 className="font-semibold text-slate-800 text-lg mb-1">{service.name}</h3>
                  <div className="flex items-center text-sm text-slate-500 gap-3">
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {service.durationMinutes} min</span>
                    <span>&middot;</span>
                    <span className="font-medium text-slate-700">${service.price.toFixed(2)}</span>
                  </div>
                </div>
                <Link 
                  href={`/book/${service.id}`}
                  className="bg-slate-50 text-blue-600 hover:bg-blue-500 hover:text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 border border-slate-100 group-hover:border-blue-500"
                >
                  Book <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center text-slate-500">
              No services are currently published.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-slate-400">
          Powered by Appointment App
        </div>
      </div>
    </div>
  );
}
