"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Copy, 
  Edit, 
  Trash2, 
  Eye,
  Loader2,
  CalendarDays,
  CopyPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
// Import BookingFlowModal from components/booking/BookingFlowModal
import BookingFlowModal from "@/components/booking/BookingFlowModal";

interface AppointmentType {
  id: string;
  name: string;
  duration: number;
  appointment_type: 'user' | 'resource';
  is_published: boolean;
  providerCount?: number;
  createdAt?: string;
  description?: string;
  manage_capacity?: boolean;
  max_bookings_per_slot?: number;
  advance_payment?: boolean;
  manual_confirmation?: boolean;
}

export default function AppointmentTypesList() {
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [selectedApt, setSelectedApt] = useState<AppointmentType | null>(null);

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
    // Optimistic update
    setAppointments(prev => 
      prev.map(apt => apt.id === id ? { ...apt, is_published: !currentStatus } : apt)
    );
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !currentStatus }),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success(currentStatus ? "Appointment unpublished" : "Appointment published");
    } catch (error) {
      toast.error("Failed to update status");
      // Revert optimistic update
      setAppointments(prev => 
        prev.map(apt => apt.id === id ? { ...apt, is_published: currentStatus } : apt)
      );
    }
  };

  const handleShare = async (id: string) => {
    try {
      const res = await fetch(`/api/organiser/appointments/${id}/share-link`);
      if (res.ok) {
        const { url } = await res.json();
        navigator.clipboard.writeText(url).catch(() => {});
        toast.success("Link copied to clipboard");
      } else {
        toast.error("Failed to generate share link");
      }
    } catch {
      toast.error("Error sharing appointment");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAppointments(prev => prev.filter(apt => apt.id !== id));
        toast.success("Appointment deleted");
      } else {
        toast.error("Failed to delete appointment");
      }
    } catch {
      toast.error("Error deleting appointment");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDuplicate = async (apt: AppointmentType) => {
    try {
      const res = await fetch(`/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...apt,
          name: `${apt.name} (copy)`,
          isPublished: false,
        }),
      });
      if (res.ok) {
        toast.success("Appointment duplicated");
        fetchAppointments();
      } else {
        toast.error("Failed to duplicate appointment");
      }
    } catch {
      toast.error("Error duplicating appointment");
    }
  };

  const filtered = appointments.filter(apt =>
    apt.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Appointments</h1>
          <p className="text-slate-500 mt-1 text-sm">Create and manage your booking types and schedules.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 w-full md:w-64 shadow-sm">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none focus:ring-0 text-[13px] ml-2 text-slate-900 placeholder:text-slate-400 w-full outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link href="/organizer/appointments/new">
            <Button className="bg-[#378ADD] hover:bg-[#2866A0] text-white shadow-sm text-[13px] rounded-lg h-9 px-4">
              <Plus className="w-4 h-4 mr-2" /> New Appointment
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 text-[#378ADD] animate-spin mr-3" />
          <p className="text-slate-500 text-[13px]">Loading appointments...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-16 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <CalendarDays className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-[15px] font-semibold text-slate-900 mb-1">
            {searchQuery ? `No results for "${searchQuery}"` : "You haven't created any appointment types yet."}
          </h3>
          <p className="text-slate-500 mb-6 text-[13px]">
            {searchQuery ? "Try a different search term." : "Get started by creating your first appointment type."}
          </p>
          {!searchQuery && (
            <Link href="/organizer/appointments/new">
              <Button variant="outline" className="border-slate-200 text-[13px] h-9">
                Create First Appointment
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 border-b border-slate-100 hover:bg-slate-50">
                <TableHead className="text-[13px] font-medium text-slate-500 h-10">Name</TableHead>
                <TableHead className="text-[13px] font-medium text-slate-500 h-10 w-24">Duration</TableHead>
                <TableHead className="text-[13px] font-medium text-slate-500 h-10 w-32">Type</TableHead>
                <TableHead className="text-[13px] font-medium text-slate-500 h-10 w-32">Status</TableHead>
                <TableHead className="text-[13px] font-medium text-slate-500 h-10 text-right w-48">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((apt) => (
                <TableRow 
                  key={apt.id} 
                  className="border-b border-slate-100 hover:bg-slate-50/50 cursor-pointer"
                  onClick={() => setSelectedApt(apt)}
                >
                  <TableCell className="font-medium text-[13px] text-slate-900">{apt.name}</TableCell>
                  <TableCell className="text-[13px] text-slate-600">{apt.duration} min</TableCell>
                  <TableCell className="text-[13px] text-slate-600 capitalize">{apt.appointment_type || 'User'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-medium border",
                        apt.is_published 
                          ? "bg-[#EAF3DE] text-[#3B6D11] border-[#C0DD97]" 
                          : "bg-[#F1EFE8] text-[#5F5E5A] border-[#D3D1C7]"
                      )}>
                        <span className="mr-1.5 w-1.5 h-1.5 rounded-full bg-current" />
                        {apt.is_published ? "Published" : "Draft"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                    <Link href={`/organizer/appointments/${apt.id}/edit`}>
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-[13px] text-slate-600 hover:text-slate-900">
                        <Edit className="w-3.5 h-3.5 mr-1.5" /> Edit
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleShare(apt.id)}
                      className="h-8 px-2 text-[13px] text-slate-600 hover:text-slate-900"
                    >
                      <Copy className="w-3.5 h-3.5 mr-1.5" /> Share
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setPreviewId(apt.id)}
                      className="h-8 px-2 text-[13px] text-slate-600 hover:text-slate-900"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5" /> Preview
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 rounded-xl border-slate-100">
                        <DropdownMenuItem 
                          onClick={() => handleDuplicate(apt)}
                          className="text-[13px] cursor-pointer"
                        >
                          <CopyPlus className="w-3.5 h-3.5 mr-2" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setDeletingId(apt.id)}
                          className="text-[13px] text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete appointment?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the appointment type and all associated unbooked slots.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg h-9 text-[13px]">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deletingId && handleDelete(deletingId)}
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg h-9 text-[13px]"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Preview Modal */}
      {previewId && (
        <BookingFlowModal
          isOpen={!!previewId}
          onClose={() => setPreviewId(null)}
          appointment={filtered.find(a => a.id === previewId) ?? null}
        />
      )}

      {/* Side Panel for Appointment Details */}
      <Sheet open={!!selectedApt} onOpenChange={(open) => !open && setSelectedApt(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          {selectedApt && (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle className="text-xl text-slate-900">{selectedApt.name}</SheetTitle>
                <SheetDescription>
                  Configuration details for this appointment type.
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-slate-900 border-b pb-2">General Information</h4>
                  <div className="grid grid-cols-2 gap-y-3 text-sm">
                    <div className="text-slate-500">Duration</div>
                    <div className="text-slate-900 font-medium">{selectedApt.duration} minutes</div>
                    
                    <div className="text-slate-500">Providers</div>
                    <div className="text-slate-900 font-medium">{selectedApt.providerCount} assigned</div>
                    
                    <div className="text-slate-500">Status</div>
                    <div>
                      <span className={cn(
                        "inline-flex px-2 py-0.5 rounded-full text-[12px] font-medium border",
                        selectedApt.is_published 
                          ? "bg-[#EAF3DE] text-[#3B6D11] border-[#C0DD97]" 
                          : "bg-[#F1EFE8] text-[#5F5E5A] border-[#D3D1C7]"
                      )}>
                        {selectedApt.is_published ? "Published" : "Draft"}
                      </span>
                    </div>

                    <div className="text-slate-500">Created</div>
                    <div className="text-slate-900 font-medium">
                      {selectedApt.createdAt ? new Date(selectedApt.createdAt).toLocaleDateString() : "N/A"}
                    </div>
                  </div>
                </div>

                {/* Configuration Rules */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-slate-900 border-b pb-2">Booking Rules & Policies</h4>
                  <div className="grid grid-cols-[1fr_auto] gap-y-4 text-sm items-center">
                    
                    <div>
                      <div className="text-slate-900 font-medium">Capacity Management</div>
                      <div className="text-xs text-slate-500">Limit number of bookings per slot</div>
                    </div>
                    <div className="font-medium">
                      {selectedApt.manage_capacity ? "Enabled" : "Disabled"}
                    </div>

                    {selectedApt.manage_capacity && (
                      <>
                        <div className="text-slate-500 pl-4">Max bookings per slot</div>
                        <div className="font-medium">{selectedApt.max_bookings_per_slot}</div>
                      </>
                    )}

                    <div>
                      <div className="text-slate-900 font-medium">Manual Confirmation</div>
                      <div className="text-xs text-slate-500">Require organiser approval</div>
                    </div>
                    <div className="font-medium">
                      {selectedApt.manual_confirmation ? "Yes" : "No"}
                    </div>

                    <div>
                      <div className="text-slate-900 font-medium">Advance Payment</div>
                      <div className="text-xs text-slate-500">Require payment before booking</div>
                    </div>
                    <div className="font-medium">
                      {selectedApt.advance_payment ? "Required" : "Not Required"}
                    </div>
                  </div>
                </div>

                {selectedApt.description && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-slate-900 border-b pb-2">Description</h4>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap">{selectedApt.description}</p>
                  </div>
                )}
                
                <div className="pt-6 flex gap-3">
                  <Link href={`/organizer/appointments/${selectedApt.id}/edit`} className="flex-1">
                    <Button className="w-full bg-[#378ADD] hover:bg-[#2866A0] text-white">
                      Edit Settings
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
