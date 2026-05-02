"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Plus, 
  GripVertical, 
  Trash2, 
  Clock, 
  Save, 
  Eye, 
  Send,
  Loader2,
  Users as UsersIcon,
  Package,
  Calendar,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import AppointmentSidebar from "@/components/booking/AppointmentSidebar";

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

export default function AppointmentForm({ id }: { id?: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("30");
  const [location, setLocation] = useState("");
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
  const [maxPeople, setMaxPeople] = useState("10");
  const [advancePayment, setAdvancePayment] = useState(false);
  const [price, setPrice] = useState("1000");
  const [manualConfirmation, setManualConfirmation] = useState(false);
  const [assignmentType, setAssignmentType] = useState<"auto" | "manual">("auto");
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [confirmationMessage, setConfirmationMessage] = useState("Thank you for your trust, we look forward to meeting you.");

  useEffect(() => {
    // Fetch staff
    fetch("/api/staff").then(res => res.json()).then(data => setAvailableStaff(data));

    if (id) {
      // Fetch existing appointment
      fetch(`/api/appointments/${id}`).then(res => res.json()).then(data => {
        setName(data.name);
        setDescription(data.description);
        setDuration(data.duration.toString());
        setManualConfirmation(data.manual_confirmation === 1);
        // ... populate other fields ...
      });
    }
  }, [id]);

  const handleAddStaff = (staffId: string) => {
    const staff = availableStaff.find(s => s.id === staffId);
    if (staff && !assignedStaff.some(s => s.id === staffId)) {
      setAssignedStaff([...assignedStaff, { id: staff.id, name: staff.full_name }]);
    }
  };

  const handleRemoveStaff = (staffId: string) => {
    setAssignedStaff(assignedStaff.filter(s => s.id !== staffId));
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, {
      id: Math.random().toString(36).substr(2, 9),
      text: "",
      type: "short_text",
      required: false
    }]);
  };

  const handleRemoveQuestion = (qId: string) => {
    setQuestions(questions.filter(q => q.id !== qId));
  };

  const handleSave = async (isPublish: boolean) => {
    setIsSaving(true);
    try {
      const res = await fetch(id ? `/api/appointments/${id}` : "/api/appointments", {
        method: id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          duration: parseInt(duration),
          isPublished: isPublish,
          manualConfirmation,
          // ... other fields ...
        }),
      });

      if (res.ok) {
        toast.success(isPublish ? "Appointment published successfully" : "Appointment saved as draft");
        router.push("/organiser/appointments");
      }
    } catch (e) {
      toast.error("Failed to save appointment");
    } finally {
      setIsSaving(false);
    }
  };

  const Section = ({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) => (
    <div className={cn("bg-[#111827] border border-white/5 rounded-[32px] p-8 space-y-6 shadow-xl", className)}>
      <h2 className="text-xl font-bold text-white flex items-center gap-3">
        <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
        {title}
      </h2>
      <div className="space-y-6">{children}</div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-32 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => router.back()}
          className="p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {id ? "Edit Appointment" : "Create New Appointment"}
          </h1>
          <p className="text-slate-400 mt-1 text-sm font-medium">Configure your booking flow and rules</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Section A: Basic Info */}
        <Section title="Basic Information">
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-300 font-bold ml-1">Appointment Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dental Care, Tennis Court"
                className="bg-white/5 border-white/10 rounded-2xl h-12 text-white focus:border-indigo-500/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-300 font-bold ml-1">Cover Image</Label>
              <div className="border-2 border-dashed border-white/10 rounded-[32px] p-12 text-center hover:border-indigo-500/30 transition-all bg-white/[0.01] group cursor-pointer">
                 <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-500/10 transition-colors">
                    <Upload className="w-8 h-8 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                 </div>
                 <p className="text-white font-bold">Click or drag to upload image</p>
                 <p className="text-slate-500 text-xs mt-1 font-medium">PNG, JPG up to 10MB</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="intro" className="text-slate-300 font-bold ml-1">Introduction</Label>
              <textarea 
                id="intro"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-600"
                placeholder="Describe what this appointment is about..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-slate-300 font-bold ml-1">Duration (minutes)</Label>
                <div className="relative">
                  <Input 
                    id="duration" 
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="bg-white/5 border-white/10 rounded-2xl h-12 text-white pl-12"
                  />
                  <Clock className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-slate-300 font-bold ml-1">Location</Label>
                <Input 
                  id="location" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Doctor's Office, Zoom"
                  className="bg-white/5 border-white/10 rounded-2xl h-12 text-white"
                />
              </div>
            </div>
          </div>
        </Section>

        {/* Section B: Type & Providers */}
        <Section title="Type & Providers">
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-slate-300 font-bold ml-1">Appointment Type</Label>
              <RadioGroup value={type} onValueChange={(val: any) => { setType(val); setAssignedStaff([]); }} className="flex gap-4">
                <div 
                  className={cn(
                    "flex-1 flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer",
                    type === 'user' ? "bg-indigo-600/10 border-indigo-500/50 text-white" : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                  )}
                  onClick={() => { setType('user'); setAssignedStaff([]); }}
                >
                  <RadioGroupItem value="user" id="type-user" className="hidden" />
                  <UsersIcon className={cn("w-5 h-5", type === 'user' ? "text-indigo-400" : "text-slate-500")} />
                  <span className="font-bold text-[15px]">User (Staff)</span>
                </div>
                <div 
                  className={cn(
                    "flex-1 flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer",
                    type === 'resource' ? "bg-indigo-600/10 border-indigo-500/50 text-white" : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                  )}
                  onClick={() => { setType('resource'); setAssignedStaff([]); }}
                >
                  <RadioGroupItem value="resource" id="type-resource" className="hidden" />
                  <Package className={cn("w-5 h-5", type === 'resource' ? "text-indigo-400" : "text-slate-500")} />
                  <span className="font-bold text-[15px]">Resource</span>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label className="text-slate-300 font-bold ml-1">
                Assign {type === 'user' ? 'Staff' : 'Resources'}
              </Label>
              <Select onValueChange={handleAddStaff}>
                <SelectTrigger className="bg-white/5 border-white/10 rounded-2xl h-12 text-white">
                  <SelectValue placeholder={`Search and add ${type === 'user' ? 'users' : 'resources'}...`} />
                </SelectTrigger>
                <SelectContent className="bg-[#1F2937] border-white/10 text-slate-200 rounded-xl">
                  {availableStaff.map(s => (
                    <SelectItem key={s.id} value={s.id} className="focus:bg-white/5 focus:text-white rounded-lg">
                      {s.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {assignedStaff.map(staff => (
                  <div key={staff.id} className="flex items-center gap-2 bg-indigo-600/20 border border-indigo-500/30 text-indigo-100 px-3 py-1.5 rounded-full text-sm font-bold">
                    {staff.name}
                    <button onClick={() => handleRemoveStaff(staff.id)} className="hover:text-white">
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
              <div className="flex bg-white/5 p-1 rounded-2xl w-fit">
                <button 
                  className={cn("px-6 py-2.5 rounded-xl text-sm font-bold transition-all", scheduleType === 'weekly' ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-white")}
                  onClick={() => setScheduleType('weekly')}
                >
                  Weekly
                </button>
                <button 
                  className={cn("px-6 py-2.5 rounded-xl text-sm font-bold transition-all", scheduleType === 'flexible' ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-white")}
                  onClick={() => setScheduleType('flexible')}
                >
                  Flexible
                </button>
              </div>

              {scheduleType === 'weekly' ? (
                <div className="border border-white/5 rounded-3xl overflow-hidden bg-white/[0.01]">
                   <table className="w-full text-left border-collapse">
                      <thead className="bg-white/5 border-b border-white/5">
                        <tr>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Day</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Open</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">From</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">To</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {workingHours.map((hour, idx) => (
                          <tr key={hour.day} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-6 py-4 font-bold text-white text-[15px]">{hour.day}</td>
                            <td className="px-6 py-4">
                               <Switch 
                                 checked={hour.isOpen} 
                                 onCheckedChange={(checked) => {
                                   const newHours = [...workingHours];
                                   newHours[idx].isOpen = checked;
                                   setWorkingHours(newHours);
                                 }}
                                 className="data-[state=checked]:bg-indigo-600"
                               />
                            </td>
                            <td className="px-6 py-4">
                               <input 
                                 type="time" 
                                 value={hour.from} 
                                 disabled={!hour.isOpen}
                                 onChange={(e) => {
                                   const newHours = [...workingHours];
                                   newHours[idx].from = e.target.value;
                                   setWorkingHours(newHours);
                                 }}
                                 className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white disabled:opacity-30 outline-none focus:border-indigo-500/50"
                               />
                            </td>
                            <td className="px-6 py-4">
                               <input 
                                 type="time" 
                                 value={hour.to} 
                                 disabled={!hour.isOpen}
                                 onChange={(e) => {
                                   const newHours = [...workingHours];
                                   newHours[idx].to = e.target.value;
                                   setWorkingHours(newHours);
                                 }}
                                 className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white disabled:opacity-30 outline-none focus:border-indigo-500/50"
                               />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
              ) : (
                <div className="space-y-4">
                   <div className="p-12 border border-dashed border-white/10 rounded-[32px] text-center bg-white/[0.01]">
                      <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400 font-medium mb-6">Add specific date blocks for this appointment</p>
                      <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white rounded-xl gap-2 font-bold">
                        <Plus className="w-4 h-4" /> Add Time Block
                      </Button>
                   </div>
                </div>
              )}
           </div>
        </Section>

        {/* Section D: Slot Configuration */}
        <Section title="Slot Configuration">
           <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                 <Label className="text-slate-300 font-bold ml-1">Slot Duration</Label>
                 <div className="relative">
                    <Input 
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="bg-white/5 border-white/10 rounded-2xl h-12 text-white pl-12"
                    />
                    <Clock className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                 </div>
              </div>
              <div className="space-y-4">
                 <Label className="text-slate-300 font-bold ml-1">Slot Creation</Label>
                 <RadioGroup value={slotCreation} onValueChange={(val: any) => setSlotCreation(val)} className="flex gap-4">
                    <div 
                      className={cn(
                        "flex-1 flex items-center gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer",
                        slotCreation === 'auto' ? "bg-indigo-600/10 border-indigo-500/50 text-white" : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                      )}
                      onClick={() => setSlotCreation('auto')}
                    >
                      <span className="font-bold text-sm">Auto</span>
                    </div>
                    <div 
                      className={cn(
                        "flex-1 flex items-center gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer",
                        slotCreation === 'manual' ? "bg-indigo-600/10 border-indigo-500/50 text-white" : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                      )}
                      onClick={() => setSlotCreation('manual')}
                    >
                      <span className="font-bold text-sm">Manual</span>
                    </div>
                 </RadioGroup>
              </div>
           </div>
        </Section>

        {/* Section E: Booking Rules */}
        <Section title="Booking Rules">
           <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8 items-end">
                <div className="space-y-4">
                   <Label className="text-slate-300 font-bold ml-1">Max Bookings per Slot</Label>
                   <Input 
                     type="number"
                     value={maxBookings}
                     onChange={(e) => setMaxBookings(e.target.value)}
                     className="bg-white/5 border-white/10 rounded-2xl h-12 text-white"
                   />
                </div>
                <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl h-12">
                   <span className="text-sm font-bold text-slate-300">Manage Capacity</span>
                   <Switch 
                     checked={manageCapacity}
                     onCheckedChange={setManageCapacity}
                     className="data-[state=checked]:bg-indigo-600"
                   />
                </div>
              </div>

              {manageCapacity && (
                 <div className="p-6 bg-indigo-600/5 border border-indigo-500/20 rounded-3xl animate-in zoom-in-95 duration-300">
                    <Label className="text-indigo-300 font-bold block mb-4">Max people per booking</Label>
                    <Input 
                      type="number"
                      value={maxPeople}
                      onChange={(e) => setMaxPeople(e.target.value)}
                      className="bg-white/5 border-indigo-500/20 rounded-2xl h-12 text-white"
                    />
                 </div>
              )}

              <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                 <div className="space-y-1">
                    <p className="font-bold text-white">Manual Confirmation</p>
                    <p className="text-xs text-slate-500 font-medium">Bookings go to "Reserved" until you confirm them</p>
                 </div>
                 <Switch 
                   checked={manualConfirmation}
                   onCheckedChange={setManualConfirmation}
                   className="data-[state=checked]:bg-indigo-600"
                 />
              </div>

              <div className="space-y-4">
                 <Label className="text-slate-300 font-bold ml-1">Assignment of {type === 'user' ? 'Staff' : 'Resource'}</Label>
                 <RadioGroup value={assignmentType} onValueChange={(val: any) => setAssignmentType(val)} className="flex gap-4">
                    <div 
                      className={cn(
                        "flex-1 flex flex-col gap-1 p-4 rounded-3xl border transition-all cursor-pointer",
                        assignmentType === 'auto' ? "bg-indigo-600/10 border-indigo-500/50 text-white shadow-lg shadow-indigo-500/5" : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                      )}
                      onClick={() => setAssignmentType('auto')}
                    >
                      <span className="font-bold text-[15px]">Auto Assign</span>
                      <span className="text-[10px] uppercase tracking-wider font-bold opacity-60">System decides</span>
                    </div>
                    <div 
                      className={cn(
                        "flex-1 flex flex-col gap-1 p-4 rounded-3xl border transition-all cursor-pointer",
                        assignmentType === 'manual' ? "bg-indigo-600/10 border-indigo-500/50 text-white shadow-lg shadow-indigo-500/5" : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                      )}
                      onClick={() => setAssignmentType('manual')}
                    >
                      <span className="font-bold text-[15px]">Customer Selects</span>
                      <span className="text-[10px] uppercase tracking-wider font-bold opacity-60">Manual choice</span>
                    </div>
                 </RadioGroup>
              </div>
           </div>
        </Section>

        {/* Section F: Custom Questions */}
        <Section title="Custom Questions">
           <div className="space-y-6">
              <p className="text-slate-400 text-sm font-medium ml-1">Ask your customers for more details during booking</p>
              
              <div className="space-y-4">
                {questions.map((q, idx) => (
                  <div key={q.id} className="flex gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-3xl group animate-in slide-in-from-left-4 duration-300">
                    <div className="pt-3 cursor-grab active:cursor-grabbing text-slate-600 hover:text-slate-400 transition-colors">
                       <GripVertical className="w-5 h-5" />
                    </div>
                    <div className="flex-1 grid md:grid-cols-12 gap-4 items-end">
                       <div className="md:col-span-5 space-y-2">
                          <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Question Text</Label>
                          <Input 
                            value={q.text}
                            onChange={(e) => {
                              const newQ = [...questions];
                              newQ[idx].text = e.target.value;
                              setQuestions(newQ);
                            }}
                            className="bg-white/5 border-white/10 rounded-2xl h-11 text-white"
                          />
                       </div>
                       <div className="md:col-span-4 space-y-2">
                          <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Type</Label>
                          <Select 
                            value={q.type}
                            onValueChange={(val: any) => {
                              const newQ = [...questions];
                              newQ[idx].type = val;
                              setQuestions(newQ);
                            }}
                          >
                             <SelectTrigger className="bg-white/5 border-white/10 rounded-2xl h-11 text-white">
                                <SelectValue />
                             </SelectTrigger>
                             <SelectContent className="bg-[#1F2937] border-white/10 text-slate-200">
                                <SelectItem value="short_text">Short Text</SelectItem>
                                <SelectItem value="long_text">Long Text</SelectItem>
                                <SelectItem value="multi_choice">Multiple Choice</SelectItem>
                                <SelectItem value="checkbox">Checkbox</SelectItem>
                             </SelectContent>
                          </Select>
                       </div>
                       <div className="md:col-span-2 flex flex-col items-center gap-2 mb-2">
                          <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Required</Label>
                          <Switch 
                            checked={q.required}
                            onCheckedChange={(checked) => {
                              const newQ = [...questions];
                              newQ[idx].required = checked;
                              setQuestions(newQ);
                            }}
                            className="data-[state=checked]:bg-indigo-600"
                          />
                       </div>
                       <div className="md:col-span-1 pb-1">
                          <button 
                            onClick={() => handleRemoveQuestion(q.id)}
                            className="p-2.5 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                          >
                             <Trash2 className="w-5 h-5" />
                          </button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                variant="outline" 
                onClick={handleAddQuestion}
                className="w-full border-dashed border-white/10 hover:border-indigo-500/30 hover:bg-indigo-500/5 text-slate-400 hover:text-indigo-400 rounded-3xl h-16 gap-3 font-bold transition-all"
              >
                <Plus className="w-5 h-5" /> Add New Question
              </Button>
           </div>
        </Section>

        {/* Section G: Confirmation Message */}
        <Section title="Confirmation Message">
           <div className="space-y-4">
              <p className="text-slate-400 text-sm font-medium ml-1">Shown to customers after a successful booking</p>
              <textarea 
                value={confirmationMessage}
                onChange={(e) => setConfirmationMessage(e.target.value)}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-[32px] p-6 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-600"
              />
           </div>
        </Section>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-72 bg-[#0B0F1A]/80 backdrop-blur-2xl border-t border-white/5 p-6 z-40">
         <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="border-white/10 hover:bg-white/5 text-white rounded-xl px-8 h-12 font-bold"
            >
              Cancel
            </Button>
            <div className="flex items-center gap-4">
               <Button 
                 variant="outline" 
                 onClick={() => setIsPreviewOpen(true)}
                 className="hidden sm:flex border-white/10 hover:bg-white/5 text-white rounded-xl px-8 h-12 font-bold gap-2"
               >
                 <Eye className="w-4 h-4" /> Preview
               </Button>
               <Button 
                 variant="secondary"
                 disabled={isSaving}
                 onClick={() => handleSave(false)}
                 className="bg-white/5 hover:bg-white/10 text-white border-white/10 rounded-xl px-8 h-12 font-bold gap-2"
               >
                 {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                 Save Draft
               </Button>
               <Button 
                 disabled={isSaving}
                 onClick={() => handleSave(true)}
                 className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-10 h-12 font-bold gap-2 shadow-xl shadow-indigo-600/20"
               >
                 {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                 Publish
               </Button>
            </div>
         </div>
      </div>

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
