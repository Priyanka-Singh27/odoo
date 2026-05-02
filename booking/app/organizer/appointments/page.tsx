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
  Eye,
  Clock,
  MapPin,
  Users,
  Loader2,
  CalendarDays
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface AppointmentType {
  id: string;
  name: string;
  duration: number;
  location?: string;
  is_published: boolean;
  description?: string;
}

export default function AppointmentTypesList() {
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/appointments?role=organiser");
      if (res.ok) {
        const result = await res.json();
        setAppointments(result.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch appointments", error);
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
      }
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleCopyLink = (id: string) => {
    const link = `${window.location.origin}/public-booking/${id}`;
    navigator.clipboard.writeText(link).catch(() => {
      // Clipboard API unavailable (HTTP or not focused) – silently ignore
      console.warn("Clipboard write failed for:", link);
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this appointment type?")) return;
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAppointments(prev => prev.filter(apt => apt.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete appointment", error);
    }
  };

  const filtered = appointments.filter(apt =>
    apt.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Appointment Types</h1>
          <p className="text-slate-500 mt-1 text-sm">Create and manage your booking types and schedules.</p>
        </div>
        <Link href="/organizer/appointments/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
            <Plus className="w-4 h-4 mr-2" /> Create New
          </Button>
        </Link>
      </div>

      <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 w-full md:w-80 shadow-sm">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input 
          type="text" 
          placeholder="Search appointments..." 
          className="bg-transparent border-none focus:ring-0 text-sm ml-2 text-slate-900 placeholder:text-slate-400 w-full outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin mr-3" />
          <p className="text-slate-500">Loading appointments...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-16 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarDays className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {searchQuery ? `No results for "${searchQuery}"` : "No appointment types yet"}
          </h3>
          <p className="text-slate-500 mb-6 text-sm">
            {searchQuery ? "Try a different search term." : "Get started by creating your first appointment type."}
          </p>
          {!searchQuery && (
            <Link href="/organizer/appointments/new">
              <Button variant="outline" className="border-slate-200">Create First Appointment</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((apt) => (
            <div 
              key={apt.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:border-slate-300 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 leading-tight">{apt.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {apt.duration} min
                      </span>
                      {apt.location && (
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {apt.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 p-1 rounded-lg border-slate-200">
                    <Link href={`/organizer/appointments/${apt.id}/edit`}>
                      <DropdownMenuItem className="rounded-md px-2 py-2 cursor-pointer gap-2 text-sm text-slate-700">
                        <Edit className="w-4 h-4" /> Edit Details
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem 
                      className="rounded-md px-2 py-2 cursor-pointer gap-2 text-sm text-slate-700"
                      onClick={() => handleCopyLink(apt.id)}
                    >
                      <Copy className="w-4 h-4" /> Copy Link
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-100 my-1" />
                    <DropdownMenuItem 
                      className="rounded-md px-2 py-2 cursor-pointer gap-2 text-sm text-red-600 focus:text-red-600 focus:bg-red-50"
                      onClick={() => handleDelete(apt.id)}
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {apt.description && (
                <p className="text-xs text-slate-500 mb-4 line-clamp-2">{apt.description}</p>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    apt.is_published ? "bg-green-500" : "bg-slate-300"
                  )} />
                  <span className="text-xs font-medium text-slate-600">
                    {apt.is_published ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Link href={`/public-booking/${apt.id}`} target="_blank">
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                  <Switch 
                    checked={apt.is_published} 
                    onCheckedChange={() => handleTogglePublish(apt.id, apt.is_published)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
