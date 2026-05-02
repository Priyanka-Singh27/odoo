"use client";

import Link from "next/link";
import { Users, LayoutGrid, ShieldCheck, ArrowRight, CalendarDays } from "lucide-react";
import { useService } from "@/hooks/use-role";

export default function Home() {
  const { role, isLoading } = useService('appointment.role');

  const portals = [
    {
      title: "Customer Portal",
      description: "Book appointments, manage your schedule, and view history.",
      href: "/login",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
    },
    {
      title: "Organiser Portal",
      description: "Manage your services, availability, and upcoming bookings.",
      href: "/organizer/login",
      icon: LayoutGrid,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-100",
    },
    {
      title: "Admin Settings",
      description: "System configuration, user management, and global rules.",
      href: "/admin/login",
      icon: ShieldCheck,
      color: "text-slate-600",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white mb-6 shadow-sm">
            <CalendarDays className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight mb-3">
            Appointment Booking System
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            Please select the appropriate portal to continue. Access is restricted based on your assigned role.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {portals.map((portal) => (
            <Link
              key={portal.title}
              href={portal.href}
              className="group flex flex-col bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all hover:border-slate-300"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${portal.bgColor} ${portal.color} border ${portal.borderColor}`}>
                <portal.icon className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">
                {portal.title}
              </h2>
              <p className="text-slate-500 text-sm flex-grow mb-6">
                {portal.description}
              </p>
              <div className="flex items-center text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                Enter Portal
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>

        {!isLoading && role !== 'customer' && (
          <div className="flex justify-center">
            <Link 
              href={role === 'organiser' ? '/organiser/appointments' : '/admin/dashboard'}
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
            >
              Return to your {role} session
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
