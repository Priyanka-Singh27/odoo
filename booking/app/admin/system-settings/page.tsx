"use client";

import { useState } from "react";
import { Globe, Mail, Shield, Clock, Bell, Database, Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminSystemSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  // General
  const [appName, setAppName] = useState("Appointment Booking System");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");

  // Auth
  const [otpExpiry, setOtpExpiry] = useState("15");
  const [sessionDuration, setSessionDuration] = useState("7");
  const [maxLoginAttempts, setMaxLoginAttempts] = useState("5");

  // Email
  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
  const [smtpPort, setSmtpPort] = useState("587");
  const [fromEmail, setFromEmail] = useState("noreply@booking.local");

  // Booking
  const [defaultDuration, setDefaultDuration] = useState("30");
  const [maxAdvanceDays, setMaxAdvanceDays] = useState("60");
  const [cancellationWindow, setCancellationWindow] = useState("24");

  const handleSave = async () => {
    setIsSaving(true);
    // Simulated save — in production this would POST to /api/admin/settings
    await new Promise((r) => setTimeout(r, 600));
    setIsSaving(false);
    toast.success("Settings saved successfully");
  };

  const Section = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
        <Icon className="w-4 h-4 text-slate-500" />
        <h2 className="text-[14px] font-bold text-slate-800">{title}</h2>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );

  const Field = ({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
      <div>
        <p className="text-[13px] font-semibold text-slate-800">{label}</p>
        {desc && <p className="text-[12px] text-slate-500 mt-0.5">{desc}</p>}
      </div>
      <div className="md:col-span-2">{children}</div>
    </div>
  );

  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl h-10 px-3 text-[13px] text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all";

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-slate-500 mt-1 text-sm">Manage system-wide defaults, integrations, and configuration.</p>
      </div>

      <Section title="General" icon={Globe}>
        <Field label="Application Name" desc="Shown in the browser title and emails">
          <input className={inputClass} value={appName} onChange={(e) => setAppName(e.target.value)} />
        </Field>
        <Field label="Timezone" desc="Default timezone for slot generation">
          <select className={inputClass} value={timezone} onChange={(e) => setTimezone(e.target.value)}>
            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
            <option value="America/New_York">America/New_York (EST)</option>
            <option value="Europe/London">Europe/London (GMT)</option>
            <option value="Asia/Dubai">Asia/Dubai (GST)</option>
          </select>
        </Field>
        <Field label="Date Format">
          <select className={inputClass} value={dateFormat} onChange={(e) => setDateFormat(e.target.value)}>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </Field>
      </Section>

      <Section title="Authentication & Security" icon={Shield}>
        <Field label="OTP Expiry" desc="Minutes before OTP expires">
          <input className={inputClass} type="number" value={otpExpiry} onChange={(e) => setOtpExpiry(e.target.value)} />
        </Field>
        <Field label="Session Duration" desc="Days before JWT expires">
          <input className={inputClass} type="number" value={sessionDuration} onChange={(e) => setSessionDuration(e.target.value)} />
        </Field>
        <Field label="Max Login Attempts" desc="Before temporary lockout">
          <input className={inputClass} type="number" value={maxLoginAttempts} onChange={(e) => setMaxLoginAttempts(e.target.value)} />
        </Field>
      </Section>

      <Section title="Email (SMTP)" icon={Mail}>
        <Field label="SMTP Host">
          <input className={inputClass} value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} />
        </Field>
        <Field label="SMTP Port">
          <input className={inputClass} value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} />
        </Field>
        <Field label="From Email" desc="Sender address for outgoing emails">
          <input className={inputClass} value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} />
        </Field>
      </Section>

      <Section title="Booking Defaults" icon={Clock}>
        <Field label="Default Duration" desc="Default appointment duration in minutes">
          <input className={inputClass} type="number" value={defaultDuration} onChange={(e) => setDefaultDuration(e.target.value)} />
        </Field>
        <Field label="Max Advance Booking" desc="How far ahead users can book (days)">
          <input className={inputClass} type="number" value={maxAdvanceDays} onChange={(e) => setMaxAdvanceDays(e.target.value)} />
        </Field>
        <Field label="Cancellation Window" desc="Hours before appointment when cancellation is allowed">
          <input className={inputClass} type="number" value={cancellationWindow} onChange={(e) => setCancellationWindow(e.target.value)} />
        </Field>
      </Section>

      {/* Sticky Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white/80 backdrop-blur-xl border-t border-slate-200 p-4 z-40">
        <div className="max-w-7xl mx-auto flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
