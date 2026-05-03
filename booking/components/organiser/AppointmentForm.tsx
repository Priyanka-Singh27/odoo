"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  ArrowLeft, Upload, X, Plus, GripVertical, Trash2, Clock, Save, Eye, Send, Loader2,
  Users as UsersIcon, Package, Calendar, ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import AppointmentSidebar from "@/components/booking/AppointmentSidebar";

// DND Kit
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Question {
  id: string;
  text: string;
  type: "short_text" | "long_text" | "multi_choice" | "checkbox";
  required: boolean;
}

interface WorkingHour {
  day: string;
  isOpen: boolean;
  from: string;
  to: string;
}

// Sortable Item Component
function SortableQuestion({ 
  q, idx, onUpdate, onRemove 
}: { 
  q: Question; idx: number; 
  onUpdate: (id: string, updates: Partial<Question>) => void;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: q.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    position: "relative" as const,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={cn(
        "flex gap-4 p-5 bg-white border rounded-2xl group transition-colors",
        isDragging ? "border-[#378ADD] shadow-md z-10" : "border-slate-100 hover:border-slate-200"
      )}
    >
      <div 
        {...attributes} 
        {...listeners}
        className="pt-3 cursor-grab text-slate-400 hover:text-slate-600 focus:outline-none"
      >
        <GripVertical className="w-5 h-5" />
      </div>
      <div className="flex-1 grid md:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-5 space-y-2">
          <Label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Question Text</Label>
          <Input 
            value={q.text}
            onChange={(e) => onUpdate(q.id, { text: e.target.value })}
            className="bg-slate-50 border-slate-200 rounded-lg h-10 text-[13px] text-slate-900"
          />
        </div>
        <div className="md:col-span-4 space-y-2">
          <Label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Type</Label>
          <Select 
            value={q.type}
            onValueChange={(val: any) => onUpdate(q.id, { type: val })}
          >
            <SelectTrigger className="bg-slate-50 border-slate-200 rounded-lg h-10 text-[13px] text-slate-900">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200">
              <SelectItem value="short_text">Short Text</SelectItem>
              <SelectItem value="long_text">Long Text</SelectItem>
              <SelectItem value="multi_choice">Multiple Choice</SelectItem>
              <SelectItem value="checkbox">Checkbox</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2 flex flex-col items-center gap-3 mb-2">
          <Label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Required</Label>
          <Switch 
            checked={q.required}
            onCheckedChange={(checked) => onUpdate(q.id, { required: checked })}
          />
        </div>
        <div className="md:col-span-1 pb-1 flex justify-end">
          <button 
            onClick={() => onRemove(q.id)}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AppointmentForm({ id }: { id?: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("30");
  const [location, setLocation] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<"user" | "resource">("user");
  const [assignedStaff, setAssignedStaff] = useState<{id: string, name: string}[]>([]);
  const [availableStaff, setAvailableStaff] = useState<{id: string, full_name: string}[]>([]);
  
  const [scheduleType, setScheduleType] = useState<"weekly" | "flexible">("weekly");
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([
    { day: "Monday", isOpen: true, from: "09:00", to: "17:00" },
    { day: "Tuesday", isOpen: true, from: "09:00", to: "17:00" },
    { day: "Wednesday", isOpen: true, from: "09:00", to: "17:00" },
    { day: "Thursday", isOpen: true, from: "09:00", to: "17:00" },
    { day: "Friday", isOpen: true, from: "09:00", to: "17:00" },
    { day: "Saturday", isOpen: false, from: "09:00", to: "17:00" },
    { day: "Sunday", isOpen: false, from: "09:00", to: "17:00" },
  ]);

  const [slotCreation, setSlotCreation] = useState<"auto" | "manual">("auto");
  const [maxBookings, setMaxBookings] = useState("1");
  const [manageCapacity, setManageCapacity] = useState(false);
  const [advancePayment, setAdvancePayment] = useState(false);
  const [price, setPrice] = useState("0");
  const [currency, setCurrency] = useState("USD");
  const [manualConfirmation, setManualConfirmation] = useState(false);
  const [assignmentType, setAssignmentType] = useState<"auto" | "manual">("auto");
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [confirmationMessage, setConfirmationMessage] = useState("Thank you for your trust, we look forward to meeting you.");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetch("/api/staff").then(res => res.json()).then(data => setAvailableStaff(data || []));

    if (id) {
      setIsLoading(true);
      fetch(`/api/appointments/${id}`).then(res => res.json()).then(data => {
        setName(data.name || "");
        setDescription(data.description || "");
        setDuration(data.duration?.toString() || "30");
        setManualConfirmation(data.manual_confirmation === 1 || data.manual_confirmation === true);
        setIsDirty(false);
        setIsLoading(false);
      });
    }
  }, [id]);

  // Track dirty state
  useEffect(() => {
    if (name || description || assignedStaff.length > 0) setIsDirty(true);
  }, [name, description, duration, location, assignedStaff, questions]);

  const handleBack = () => {
    if (isDirty) {
      setShowExitDialog(true);
    } else {
      router.back();
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const updateQuestion = (qId: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === qId ? { ...q, ...updates } : q));
  };

  const removeQuestion = (qId: string) => {
    setQuestions(questions.filter(q => q.id !== qId));
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setCoverImage(data.url);
        setIsDirty(true);
        toast.success("Image uploaded");
      } else {
        const err = await res.json();
        toast.error(err.error || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (isPublish: boolean) => {
    setIsSaving(true);
    try {
      const payload = {
        name,
        description,
        duration: parseInt(duration),
        location,
        appointment_type: type,
        isPublished: isPublish,
        manualConfirmation,
        manage_capacity: manageCapacity,
        max_bookings_per_slot: parseInt(maxBookings),
        advance_payment: advancePayment,
        price: advancePayment ? parseFloat(price) : 0,
        currency,
        cover_image: coverImage,
        confirmation_message: confirmationMessage,
        questions,
        assignedStaff,
        working_hours: workingHours,
        schedule_type: scheduleType,
      };

      const res = await fetch(id ? `/api/appointments/${id}` : "/api/appointments", {
        method: id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsDirty(false);
        toast.success(isPublish ? "Appointment published successfully" : "Appointment saved as draft");
        router.push("/organizer/appointments");
      } else {
        toast.error("Failed to save appointment");
      }
    } catch (e) {
      toast.error("An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-white border border-slate-100 rounded-2xl p-8 space-y-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 flex items-center gap-3">
        <div className="w-1.5 h-5 bg-[#378ADD] rounded-full" />
        {title}
      </h2>
      <div className="space-y-6">{children}</div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-32">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={handleBack}
          className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {id ? "Edit Appointment" : "Create New Appointment"}
          </h1>
          <p className="text-slate-500 mt-1 text-[13px]">Configure your booking flow and rules</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Section A: Basic Info */}
        <Section title="Basic Information">
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[13px] font-semibold text-slate-700">Appointment Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Initial Consultation"
                className="bg-slate-50 border-slate-200 rounded-xl h-11 text-[13px] text-slate-900 focus:bg-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-[13px] font-semibold text-slate-700">Cover Image</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                  e.target.value = '';
                }}
              />
              {coverImage ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 group">
                  <img
                    src={coverImage}
                    alt="Cover"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2.5 bg-white rounded-xl text-slate-700 hover:bg-slate-100 transition-colors shadow-md"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverImage(null)}
                      className="p-2.5 bg-white rounded-xl text-red-600 hover:bg-red-50 transition-colors shadow-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={(e) => {
                    e.preventDefault(); e.stopPropagation();
                    const file = e.dataTransfer.files?.[0];
                    if (file && file.type.startsWith('image/')) handleImageUpload(file);
                  }}
                  className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center hover:border-[#378ADD] hover:bg-blue-50/50 transition-all cursor-pointer"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-8 h-8 text-[#378ADD] animate-spin mx-auto mb-3" />
                      <p className="text-[13px] font-medium text-slate-700">Uploading...</p>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-3 border border-slate-100">
                        <Upload className="w-5 h-5 text-slate-400" />
                      </div>
                      <p className="text-[13px] font-medium text-slate-700">Click or drag to upload image</p>
                      <p className="text-slate-400 text-[12px] mt-1">PNG, JPG up to 5MB</p>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="intro" className="text-[13px] font-semibold text-slate-700">Introduction</Label>
              <textarea 
                id="intro"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-[13px] text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#378ADD]/20 focus:border-[#378ADD] outline-none transition-all placeholder:text-slate-400"
                placeholder="Describe what this appointment is about..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-[13px] font-semibold text-slate-700">Duration (minutes)</Label>
                <div className="relative">
                  <Input 
                    id="duration" 
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="bg-slate-50 border-slate-200 rounded-xl h-11 text-[13px] text-slate-900 pl-11"
                  />
                  <Clock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-[13px] font-semibold text-slate-700">Location</Label>
                <Input 
                  id="location" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Doctor's Office, Zoom"
                  className="bg-slate-50 border-slate-200 rounded-xl h-11 text-[13px] text-slate-900"
                />
              </div>
            </div>
          </div>
        </Section>

        {/* Section B: Type & Providers */}
        <Section title="Type & Providers">
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-[13px] font-semibold text-slate-700">Appointment Type</Label>
              <RadioGroup value={type} onValueChange={(val: any) => { setType(val); setAssignedStaff([]); }} className="flex gap-4">
                <div 
                  className={cn(
                    "flex-1 flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer",
                    type === 'user' ? "bg-blue-50 border-[#378ADD] text-[#378ADD]" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  )}
                  onClick={() => { setType('user'); setAssignedStaff([]); }}
                >
                  <UsersIcon className={cn("w-5 h-5", type === 'user' ? "text-[#378ADD]" : "text-slate-400")} />
                  <span className="font-semibold text-[14px] text-slate-900">User (Staff)</span>
                </div>
                <div 
                  className={cn(
                    "flex-1 flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer",
                    type === 'resource' ? "bg-blue-50 border-[#378ADD] text-[#378ADD]" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  )}
                  onClick={() => { setType('resource'); setAssignedStaff([]); }}
                >
                  <Package className={cn("w-5 h-5", type === 'resource' ? "text-[#378ADD]" : "text-slate-400")} />
                  <span className="font-semibold text-[14px] text-slate-900">Resource</span>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label className="text-[13px] font-semibold text-slate-700">
                Assign {type === 'user' ? 'Staff' : 'Resources'}
              </Label>
              <Select onValueChange={(val) => {
                const staff = availableStaff.find(s => s.id === val);
                if (staff && !assignedStaff.some(s => s.id === val)) {
                  setAssignedStaff([...assignedStaff, { id: staff.id, name: staff.full_name }]);
                }
              }}>
                <SelectTrigger className="bg-slate-50 border-slate-200 rounded-xl h-11 text-[13px] text-slate-900">
                  <SelectValue placeholder={`Search and add ${type === 'user' ? 'users' : 'resources'}...`} />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  {availableStaff.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.full_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {assignedStaff.map(staff => (
                  <div key={staff.id} className="flex items-center gap-2 bg-[#E6F1FB] border border-blue-200 text-[#378ADD] px-3 py-1.5 rounded-lg text-[12px] font-semibold">
                    {staff.name}
                    <button onClick={() => setAssignedStaff(assignedStaff.filter(s => s.id !== staff.id))} className="hover:text-red-500">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Section C: Working Hours */}
        <Section title="Working Hours & Schedule">
           <div className="space-y-6">
              <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                <button 
                  className={cn("px-5 py-2 rounded-lg text-[13px] font-semibold transition-all", scheduleType === 'weekly' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                  onClick={() => setScheduleType('weekly')}
                >
                  Weekly
                </button>
                <button 
                  className={cn("px-5 py-2 rounded-lg text-[13px] font-semibold transition-all", scheduleType === 'flexible' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                  onClick={() => setScheduleType('flexible')}
                >
                  Flexible
                </button>
              </div>

              {scheduleType === 'weekly' ? (
                <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white">
                   <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                          <th className="px-6 py-3 text-[12px] font-semibold text-slate-500 uppercase">Day</th>
                          <th className="px-6 py-3 text-[12px] font-semibold text-slate-500 uppercase">Open</th>
                          <th className="px-6 py-3 text-[12px] font-semibold text-slate-500 uppercase">From</th>
                          <th className="px-6 py-3 text-[12px] font-semibold text-slate-500 uppercase">To</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {workingHours.map((hour, idx) => (
                          <tr key={hour.day} className="hover:bg-slate-50/50">
                            <td className="px-6 py-3 font-medium text-slate-900 text-[13px]">{hour.day}</td>
                            <td className="px-6 py-3">
                               <Switch 
                                 checked={hour.isOpen} 
                                 onCheckedChange={(checked) => {
                                   const newHours = [...workingHours];
                                   newHours[idx].isOpen = checked;
                                   setWorkingHours(newHours);
                                 }}
                               />
                            </td>
                            <td className="px-6 py-3">
                               <input 
                                 type="time" 
                                 value={hour.from} 
                                 disabled={!hour.isOpen}
                                 onChange={(e) => {
                                   const newHours = [...workingHours];
                                   newHours[idx].from = e.target.value;
                                   setWorkingHours(newHours);
                                 }}
                                 className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[13px] text-slate-900 disabled:opacity-50 outline-none focus:border-[#378ADD]"
                               />
                            </td>
                            <td className="px-6 py-3">
                               <input 
                                 type="time" 
                                 value={hour.to} 
                                 disabled={!hour.isOpen}
                                 onChange={(e) => {
                                   const newHours = [...workingHours];
                                   newHours[idx].to = e.target.value;
                                   setWorkingHours(newHours);
                                 }}
                                 className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[13px] text-slate-900 disabled:opacity-50 outline-none focus:border-[#378ADD]"
                               />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
              ) : (
                <div className="p-10 border border-dashed border-slate-200 rounded-2xl text-center bg-slate-50">
                   <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                   <p className="text-slate-500 font-medium text-[13px] mb-4">Add specific date blocks for this appointment</p>
                   <Button variant="outline" className="border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl gap-2 font-semibold">
                     <Plus className="w-4 h-4" /> Add Time Block
                   </Button>
                </div>
              )}
           </div>
        </Section>

        {/* Section D: Booking Rules */}
        <Section title="Booking Rules">
           <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6 items-end">
                <div className="space-y-2">
                   <Label className="text-[13px] font-semibold text-slate-700">Max Bookings per Slot</Label>
                   <Input 
                     type="number"
                     value={maxBookings}
                     onChange={(e) => setMaxBookings(e.target.value)}
                     className="bg-slate-50 border-slate-200 rounded-xl h-11 text-[13px] text-slate-900"
                   />
                </div>
                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl h-11">
                   <span className="text-[13px] font-semibold text-slate-700">Manage Capacity</span>
                   <Switch 
                     checked={manageCapacity}
                     onCheckedChange={setManageCapacity}
                   />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 items-end">
                 <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="space-y-0.5">
                       <p className="font-semibold text-slate-900 text-[13px]">Advance Payment</p>
                       <p className="text-[12px] text-slate-500">Require payment before booking</p>
                    </div>
                    <Switch 
                      checked={advancePayment}
                      onCheckedChange={setAdvancePayment}
                    />
                 </div>
                 {advancePayment && (
                    <div className="flex gap-2">
                       <div className="flex-1 space-y-2">
                          <Label className="text-[13px] font-semibold text-slate-700">Amount</Label>
                          <Input 
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="bg-slate-50 border-slate-200 rounded-xl h-11 text-[13px]"
                          />
                       </div>
                       <div className="w-24 space-y-2">
                          <Label className="text-[13px] font-semibold text-slate-700">Currency</Label>
                          <Select value={currency} onValueChange={(val) => val && setCurrency(val)}>
                            <SelectTrigger className="bg-slate-50 border-slate-200 rounded-xl h-11 text-[13px]">
                               <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                               <SelectItem value="USD">USD</SelectItem>
                               <SelectItem value="EUR">EUR</SelectItem>
                            </SelectContent>
                          </Select>
                       </div>
                    </div>
                 )}
              </div>

              <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-200 rounded-xl">
                 <div className="space-y-0.5">
                    <p className="font-semibold text-slate-900 text-[13px]">Manual Confirmation</p>
                    <p className="text-[12px] text-slate-500">Bookings go to "Reserved" until you confirm them</p>
                 </div>
                 <Switch 
                   checked={manualConfirmation}
                   onCheckedChange={setManualConfirmation}
                 />
              </div>
           </div>
        </Section>

        {/* Section E: Custom Questions */}
        <Section title="Custom Questions">
           <div className="space-y-5">
              <p className="text-slate-500 text-[13px] font-medium">Ask your customers for more details during booking</p>
              
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={questions.map(q => q.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3">
                    {questions.map((q, idx) => (
                      <SortableQuestion 
                        key={q.id} 
                        q={q} 
                        idx={idx} 
                        onUpdate={updateQuestion} 
                        onRemove={removeQuestion} 
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              <Button 
                variant="outline" 
                onClick={() => setQuestions([...questions, { id: Math.random().toString(36).substr(2, 9), text: "", type: "short_text", required: false }])}
                className="w-full border-dashed border-slate-200 hover:border-[#378ADD] hover:bg-blue-50/50 text-[#378ADD] rounded-xl h-12 gap-2 font-semibold transition-all"
              >
                <Plus className="w-4 h-4" /> Add New Question
              </Button>
           </div>
        </Section>

        {/* Section F: Confirmation Message */}
        <Section title="Confirmation Message">
           <div className="space-y-3">
              <p className="text-slate-500 text-[13px] font-medium">Shown to customers after a successful booking</p>
              <textarea 
                value={confirmationMessage}
                onChange={(e) => setConfirmationMessage(e.target.value)}
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-[13px] text-slate-900 focus:ring-2 focus:ring-[#378ADD]/20 focus:border-[#378ADD] outline-none transition-all placeholder:text-slate-400"
              />
           </div>
        </Section>
      </div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white/80 backdrop-blur-xl border-t border-slate-200 p-4 z-40">
         <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg px-6 h-10 text-[13px] font-semibold"
            >
              Cancel
            </Button>
            <div className="flex items-center gap-3">
               <Button 
                 variant="outline" 
                 onClick={() => setIsPreviewOpen(true)}
                 className="hidden sm:flex border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg px-5 h-10 text-[13px] font-semibold gap-2"
               >
                 <Eye className="w-3.5 h-3.5" /> Preview
               </Button>
               <Button 
                 variant="secondary"
                 disabled={isSaving}
                 onClick={() => handleSave(false)}
                 className="bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg px-6 h-10 text-[13px] font-semibold gap-2"
               >
                 {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                 Save Draft
               </Button>
               <Button 
                 disabled={isSaving}
                 onClick={() => handleSave(true)}
                 className="bg-[#378ADD] hover:bg-[#2866A0] text-white rounded-lg px-8 h-10 text-[13px] font-semibold gap-2"
               >
                 {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                 Publish
               </Button>
            </div>
         </div>
      </div>

      {/* Exit Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave this page?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg h-9 text-[13px]">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => router.back()}
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg h-9 text-[13px]"
            >
              Discard changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Preview Sidebar */}
      {isPreviewOpen && (
        <AppointmentSidebar 
          appointment={{
            id: 'preview',
            name: name || "New Appointment",
            description: description || "Your introduction goes here...",
            duration: parseInt(duration) || 30,
            location: location || "Main Venue",
            is_published: true,
            provider_data: JSON.stringify(assignedStaff)
          } as any}
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          onBook={() => toast.info("Booking is disabled in preview mode")}
        />
      )}
    </div>
  );
}
