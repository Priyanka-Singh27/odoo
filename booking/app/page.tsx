"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Menu,
  X,
  ArrowRight,
  Clock,
  Users,
  Settings,
  CheckCircle,
  MessageSquare,
  BarChart3,
  Hospital,
  Dumbbell,
  Building2,
  ChevronRight,
} from "lucide-react";
import { useService } from "@/hooks/use-role";

/* ───────────────────────── Navbar ───────────────────────── */

function Navbar({ role, isLoading }: { role: string; isLoading: boolean }) {
  const [open, setOpen] = useState(false);

  const links = [
    { label: "How it works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
    { label: "For organisers", href: "#who-its-for" },
  ];

  const scrollTo = (id: string) => {
    setOpen(false);
    const el = document.querySelector(id);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#378ADD] flex items-center justify-center">
            <CalendarDays className="w-4 h-4 text-white" />
          </div>
          <span className="text-[17px] font-bold text-slate-900 tracking-tight">BookEase</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <button
              key={l.href}
              onClick={() => scrollTo(l.href)}
              className="text-[14px] font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {!isLoading && role !== "customer" ? (
            <Link
              href={role === "organiser" ? "/organizer/dashboard" : "/admin/dashboard"}
              className="text-[14px] font-semibold text-white bg-[#378ADD] hover:bg-[#2b75c4] px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2"
            >
              Go to Dashboard
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[14px] font-medium text-slate-600 hover:text-slate-900 px-4 py-2 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="text-[14px] font-semibold text-white bg-[#378ADD] hover:bg-[#2b75c4] px-5 py-2.5 rounded-xl transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-slate-600"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white px-5 pb-5 space-y-1">
          {links.map((l) => (
            <button
              key={l.href}
              onClick={() => scrollTo(l.href)}
              className="block w-full text-left py-3 text-[15px] font-medium text-slate-600 hover:text-slate-900 border-b border-slate-50"
            >
              {l.label}
            </button>
          ))}
          <div className="flex flex-col gap-2 pt-4">
            {!isLoading && role !== "customer" ? (
              <Link
                href={role === "organiser" ? "/organizer/dashboard" : "/admin/dashboard"}
                className="text-center py-2.5 text-[14px] font-semibold text-white bg-[#378ADD] rounded-xl flex items-center justify-center gap-2"
              >
                Go to Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-center py-2.5 text-[14px] font-medium text-slate-700 border border-slate-200 rounded-xl">
                  Log in
                </Link>
                <Link href="/signup" className="text-center py-2.5 text-[14px] font-semibold text-white bg-[#378ADD] rounded-xl">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

/* ───────────────────────── Hero ───────────────────────── */

function Hero() {
  return (
    <section className="bg-white pt-20 pb-16 md:pt-28 md:pb-24 px-5">
      <div className="max-w-3xl mx-auto text-center">
        {/* Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 mb-8">
          <CalendarDays className="w-3.5 h-3.5 text-[#378ADD]" />
          <span className="text-[13px] font-medium text-slate-600">Scheduling, simplified.</span>
        </div>

        {/* Headline */}
        <h1 className="text-[36px] md:text-[52px] font-bold text-slate-900 leading-[1.12] tracking-tight mb-5">
          Book smarter.
          <br />
          Run better appointments.
        </h1>

        {/* Subheadline */}
        <p className="text-[16px] md:text-[18px] text-slate-500 leading-relaxed max-w-xl mx-auto mb-10">
          A booking system for teams that actually need to manage
          availability, capacity, and confirmations — without the chaos.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <Link
            href="/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3 text-[15px] font-semibold text-white bg-[#378ADD] hover:bg-[#2b75c4] rounded-xl transition-colors"
          >
            Get started free
          </Link>
          <button
            onClick={() =>
              document.querySelector("#how-it-works")?.scrollIntoView({ behavior: "smooth" })
            }
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 text-[15px] font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
          >
            See how it works
            <span className="text-slate-400">↓</span>
          </button>
        </div>

        {/* Social proof */}
        <p className="text-[13px] text-slate-400 font-medium">
          Used by 200+ organisers across clinics, courts, and studios.
        </p>
      </div>

      {/* Hero mockup */}
      <div className="max-w-4xl mx-auto mt-16">
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
          {/* Browser bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-slate-200" />
              <div className="w-3 h-3 rounded-full bg-slate-200" />
              <div className="w-3 h-3 rounded-full bg-slate-200" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="bg-white border border-slate-200 rounded-md px-4 py-1 text-[12px] text-slate-400 w-64 text-center">
                bookease.app/home
              </div>
            </div>
          </div>
          {/* Screenshot */}
          <div className="aspect-[16/9] bg-[#F8FAFC] flex items-center justify-center overflow-hidden">
            <img
              src="/hero-mockup.png"
              alt="BookEase appointment booking interface"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── How It Works ───────────────────── */

const steps = [
  {
    num: "01",
    title: "Create your service",
    desc: "Set duration, providers, availability rules, and custom questions in minutes.",
  },
  {
    num: "02",
    title: "Share with customers",
    desc: "Publish your booking page or send a private link. No app install needed for customers.",
  },
  {
    num: "03",
    title: "Manage everything",
    desc: "Confirm bookings, track capacity, view reports. All in one place.",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#F8FAFC] py-16 md:py-24 px-5">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-[24px] md:text-[28px] font-bold text-slate-900 text-center mb-14 tracking-tight">
          How it works
        </h2>

        <div className="grid md:grid-cols-3 gap-8 md:gap-0">
          {steps.map((s, i) => (
            <div
              key={s.num}
              className={`relative text-center md:text-left md:px-8 ${
                i < steps.length - 1 ? "md:border-r md:border-slate-200" : ""
              }`}
            >
              <span className="text-[40px] font-bold text-slate-100 leading-none block mb-4">
                {s.num}
              </span>
              <h3 className="text-[16px] font-semibold text-slate-900 mb-2">{s.title}</h3>
              <p className="text-[14px] text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────── Features Section ──────────────────── */

const features = [
  {
    icon: Clock,
    title: "Real-time slot availability",
    desc: "Slots update instantly as bookings come in.",
  },
  {
    icon: Users,
    title: "Multi-provider support",
    desc: "Assign staff or physical resources per appointment.",
  },
  {
    icon: Settings,
    title: "Flexible scheduling rules",
    desc: "Weekly or flexible schedules, breaks, and capacity limits.",
  },
  {
    icon: CheckCircle,
    title: "Manual or auto confirmation",
    desc: "Approve bookings yourself or let them confirm instantly.",
  },
  {
    icon: MessageSquare,
    title: "Custom booking questions",
    desc: "Ask customers exactly what you need before they arrive.",
  },
  {
    icon: BarChart3,
    title: "Reports and insights",
    desc: "See peak hours, utilization, and booking trends at a glance.",
  },
];

function Features() {
  return (
    <section id="features" className="bg-white py-16 md:py-24 px-5">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-[24px] md:text-[28px] font-bold text-slate-900 text-center mb-4 tracking-tight">
          Everything you need. Nothing you don&apos;t.
        </h2>
        <p className="text-[15px] text-slate-500 text-center mb-14 max-w-lg mx-auto">
          Built for appointment-heavy businesses, not generic scheduling.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
          {features.map((f) => (
            <div key={f.title} className="flex gap-4">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center">
                <f.icon className="w-5 h-5 text-[#378ADD]" />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-slate-900 mb-1">{f.title}</h3>
                <p className="text-[14px] text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────── Who It's For Section ────────────────── */

const audiences = [
  {
    icon: Hospital,
    title: "Clinics & Healthcare",
    desc: "Manage doctor availability, patient questions, and appointment confirmations with ease.",
  },
  {
    icon: Dumbbell,
    title: "Sports & Recreation",
    desc: "Court bookings, lane reservations, group capacity — all handled without back-and-forth messages.",
  },
  {
    icon: Building2,
    title: "Consultants & Studios",
    desc: "One-on-one sessions, team workshops, or resource-based bookings. It all works.",
  },
];

function WhoItsFor() {
  return (
    <section id="who-its-for" className="bg-[#F8FAFC] py-16 md:py-24 px-5">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-[24px] md:text-[28px] font-bold text-slate-900 text-center mb-14 tracking-tight">
          Built for teams like yours
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {audiences.map((a) => (
            <div
              key={a.title}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-5">
                <a.icon className="w-5 h-5 text-[#378ADD]" />
              </div>
              <h3 className="text-[16px] font-semibold text-slate-900 mb-2">{a.title}</h3>
              <p className="text-[14px] text-slate-500 leading-relaxed mb-4">{a.desc}</p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-1 text-[13px] font-medium text-[#378ADD] hover:text-[#2b75c4] transition-colors"
              >
                Learn more <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────── CTA Strip ────────────────────── */

function CtaStrip() {
  return (
    <section className="bg-white py-16 md:py-20 px-5">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-[24px] md:text-[28px] font-bold text-slate-900 mb-6 tracking-tight">
          Ready to take back your calendar?
        </h2>
        <Link
          href="/signup"
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-[15px] font-semibold text-white bg-[#378ADD] hover:bg-[#2b75c4] rounded-xl transition-colors"
        >
          Get started — it&apos;s free
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

/* ────────────────────── Footer ────────────────────── */

function Footer() {
  const cols = [
    {
      heading: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#" },
        { label: "Changelog", href: "#" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Contact", href: "#" },
      ],
    },
    {
      heading: "Legal",
      links: [
        { label: "Privacy", href: "#" },
        { label: "Terms", href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-[#F8FAFC] border-t border-slate-100 pt-14 pb-8 px-5">
      <div className="max-w-5xl mx-auto">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-[#378ADD] flex items-center justify-center">
                <CalendarDays className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[15px] font-bold text-slate-900">BookEase</span>
            </div>
            <p className="text-[13px] text-slate-400 leading-relaxed">
              Scheduling for people who care about their time.
            </p>
          </div>

          {/* Link columns */}
          {cols.map((c) => (
            <div key={c.heading}>
              <h4 className="text-[13px] font-semibold text-slate-900 mb-3 uppercase tracking-wider">
                {c.heading}
              </h4>
              <ul className="space-y-2">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[14px] text-slate-500 hover:text-slate-700 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200 pt-6">
          <p className="text-[12px] text-slate-400 text-center">
            © 2026 BookEase. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ────────────────────── Main Page ────────────────────── */

export default function Home() {
  const router = useRouter();
  const { role, isLoading } = useService("appointment.role");

  return (
    <div className="min-h-screen bg-white">
      <Navbar role={role} isLoading={isLoading} />
      <Hero />
      <HowItWorks />
      <Features />
      <WhoItsFor />
      <CtaStrip />
      <Footer />
    </div>
  );
}
