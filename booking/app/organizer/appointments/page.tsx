"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Copy, 
  ExternalLink, 
  Edit, 
  Trash2, 
  CopyCheck,
  Eye,
  Globe,
  Lock,
  ChevronRight,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import AppointmentSidebar from "@/components/booking/AppointmentSidebar";
import { cn } from "@/lib/utils";

interface AppointmentType {
  id: string;
  name: string;
  duration: number;
  location: string;
  is_published: boolean;
  provider_data?: string;
  image_url?: string;
  description?: string;
}

export default function AppointmentTypesList() {
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewAppointment, setPreviewAppointment] = useState<AppointmentType | null>(null);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      // Fetching all (published and unpublished) for organiser
      const res = await fetch("/api/appointments?role=organiser");
      if (res.ok) {
        const result = await res.json();
        setAppointments(result.data);
      }
    } catch (error) {
      toast.error("Failed to fetch appointments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !currentStatus }),
      });

      if (res.ok) {
        setAppointments(prev => 
          prev.map(apt => apt.id === id ? { ...apt, is_published: !currentStatus } : apt)
        );
        toast.success(`Appointment ${!currentStatus ? "published" : "unpublished"} successfully`);
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleCopyLink = (id: string, isPublished: boolean) => {
    const baseUrl = window.location.origin;
    const link = isPublished 
      ? `${baseUrl}/public-booking/${id}` 
      : `${baseUrl}/public-booking/${id}?preview=true&token=private_${id}`;
    
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard!", {
      description: isPublished ? "Public link copied" : "Private preview link copied",
      icon: <CopyCheck className="w-4 h-4 text-green-500" />
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this appointment type?")) return;
    
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAppointments(prev => prev.filter(apt => apt.id !== id));
        toast.success("Appointment deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete appointment");
    }
  };

  const filteredAppointments = appointments.filter(apt => 
    apt.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Appointment Types</h1>
          <p className="text-slate-400 mt-1 text-sm font-medium">Create and manage your booking types and schedules</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/organiser/appointments/new">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 font-bold shadow-lg shadow-indigo-600/20">
              <Plus className="w-5 h-5 mr-2" /> Create New
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center bg-[#111827] border border-white/5 rounded-2xl px-5 py-3.5 w-full md:w-96 focus-within:border-indigo-500/30 transition-all shadow-xl shadow-black/20">
        <Search className="w-5 h-5 text-slate-500" />
        <input 
          type="text" 
          placeholder="Search by name..." 
          className="bg-transparent border-none focus:ring-0 text-[15px] ml-3 text-white placeholder:text-slate-500 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            </div>
          </div>
          <p className="text-slate-400 font-medium animate-pulse">Loading appointments...</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="bg-[#111827] border border-dashed border-white/10 rounded-[32px] p-16 text-center">
          <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <CalendarDays className="w-10 h-10 text-slate-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No appointments found</h3>
          <p className="text-slate-400 max-w-md mx-auto mb-8">
            {searchQuery ? `No matches found for "${searchQuery}". Try a different search term.` : "You haven't created any appointment types yet. Start by creating one now."}
          </p>
          {!searchQuery && (
            <Link href="/organiser/appointments/new">
              <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white rounded-xl px-8 h-12 font-bold">
                Create First Appointment
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
          {filteredAppointments.map((apt) => (
            <div 
              key={apt.id}
              className="group bg-[#111827] border border-white/5 hover:border-indigo-500/30 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-800 shrink-0 border border-white/5 shadow-inner">
                    {apt.image_url ? (
                      <img src={apt.image_url} alt={apt.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                        <Users className="w-6 h-6 text-indigo-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors leading-tight">
                      {apt.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[13px] font-medium text-slate-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> {apt.duration} min
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-700" />
                      <span className="text-[13px] font-medium text-slate-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" /> {apt.location || "Online"}
                      </span>
                    </div>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-[#1F2937] border-white/10 text-slate-300 p-2 rounded-2xl shadow-2xl">
                    <DropdownMenuItem 
                      className="rounded-xl px-3 py-2.5 focus:bg-white/5 focus:text-white cursor-pointer gap-3 font-medium"
                      onClick={() => setPreviewAppointment(apt)}
                    >
                      <Eye className="w-4 h-4 text-slate-400" /> Preview
                    </DropdownMenuItem>
                    <Link href={`/organiser/appointments/${apt.id}/edit`}>
                      <DropdownMenuItem className="rounded-xl px-3 py-2.5 focus:bg-white/5 focus:text-white cursor-pointer gap-3 font-medium">
                        <Edit className="w-4 h-4 text-slate-400" /> Edit Details
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem 
                      className="rounded-xl px-3 py-2.5 focus:bg-white/5 focus:text-white cursor-pointer gap-3 font-medium"
                      onClick={() => handleCopyLink(apt.id, apt.is_published)}
                    >
                      <Copy className="w-4 h-4 text-slate-400" /> Copy Link
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/5 mx-1" />
                    <DropdownMenuItem className="rounded-xl px-3 py-2.5 focus:bg-white/5 focus:text-white cursor-pointer gap-3 font-medium">
                      <Copy className="w-4 h-4 text-slate-400" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="rounded-xl px-3 py-2.5 focus:bg-red-400/10 focus:text-red-400 cursor-pointer gap-3 font-medium"
                      onClick={() => handleDelete(apt.id)}
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-2.5 h-2.5 rounded-full",
                    apt.is_published ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-slate-600"
                  )} />
                  <span className="text-[13px] font-bold text-slate-300">
                    {apt.is_published ? "Published" : "Unpublished"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Visibility</span>
                  <Switch 
                    checked={apt.is_published} 
                    onCheckedChange={() => handleTogglePublish(apt.id, apt.is_published)}
                    className="data-[state=checked]:bg-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <Button 
                  variant="outline" 
                  className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl font-bold text-xs h-10 gap-2"
                  onClick={() => setPreviewAppointment(apt)}
                >
                  <Eye className="w-4 h-4" /> Preview
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl font-bold text-xs h-10 gap-2"
                  onClick={() => handleCopyLink(apt.id, apt.is_published)}
                >
                  <ExternalLink className="w-4 h-4" /> Share Link
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reusable Sidebar Preview */}
      {previewAppointment && (
        <AppointmentSidebar 
          appointment={{
            ...previewAppointment,
            image_url: previewAppointment.image_url || ""
          } as any}
          isOpen={!!previewAppointment}
          onClose={() => setPreviewAppointment(null)}
          onBook={() => toast.info("Booking is disabled in preview mode")}
        />
      )}
    </div>
  );
}

// Icons for components
function CalendarDays(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  )
}

function Clock(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function MapPin(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}
