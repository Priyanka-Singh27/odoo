"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, CalendarCheck2, Clock, Star } from "lucide-react";
import { loginSchema } from "@/lib/validators/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginFormValues = z.infer<typeof loginSchema>;

const FEATURES = [
  { icon: CalendarCheck2, text: "Book appointments in seconds" },
  { icon: Clock, text: "Manage your schedule effortlessly" },
  { icon: Star, text: "Connect with top professionals" },
];

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!res.ok) {
        setError(resData.error || "An error occurred");
        if (resData.redirect) router.push(resData.redirect);
      } else {
        const role = resData.role;
        if (role === "organiser") router.push("/organizer/appointments");
        else if (role === "admin") router.push("/admin/dashboard");
        else router.push("/home");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #1a2e4a 50%, #0f1e35 100%)" }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #3b82f6, transparent 70%)", transform: "translate(30%, -30%)" }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #60a5fa, transparent 70%)", transform: "translate(-30%, 30%)" }} />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        </div>

        {/* Top logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
            <CalendarCheck2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">BookEase</span>
        </div>

        {/* Center content */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/20 rounded-full px-4 py-1.5 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-300 text-xs font-medium tracking-wide">Customer Portal</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight tracking-tight">
            Your schedule,<br />
            <span className="text-blue-400">simplified.</span>
          </h1>
          <p className="text-slate-400 text-base max-w-xs leading-relaxed mb-10">
            Book, manage, and track your appointments all in one place.
          </p>
          <div className="space-y-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-400/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-slate-300 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom social proof */}
        <div className="relative z-10">
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-slate-400 text-sm italic">"The easiest way to manage my appointments."</p>
          <p className="text-slate-500 text-xs mt-1">— Verified Customer</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-[55%] bg-white flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[380px]">
          {/* Mobile logo */}
          <div className="mb-8 lg:hidden flex justify-center">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md">
              <CalendarCheck2 className="w-6 h-6" />
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-1.5">Welcome back</h2>
            <p className="text-slate-500 text-sm">Sign in to your customer account to continue.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-700 font-medium text-sm">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700 font-medium text-sm">Password</Label>
                <Link href="/forgot-password" className="text-xs text-blue-600 hover:text-blue-500 font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            {error && (
              <div className="flex items-start gap-2.5 p-3.5 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-red-600 text-xs font-bold">!</span>
                </div>
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm shadow-blue-600/20 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account?{" "}
              <Link href="/signup" className="text-blue-600 hover:text-blue-500 font-semibold">
                Create one free →
              </Link>
            </p>
          </div>

          <p className="mt-4 text-center text-xs text-slate-400">
            Looking for the{" "}
            <Link href="/organizer/login" className="text-slate-500 hover:text-slate-700 underline underline-offset-2">
              Organizer
            </Link>
            {" "}or{" "}
            <Link href="/admin/login" className="text-slate-500 hover:text-slate-700 underline underline-offset-2">
              Admin
            </Link>
            {" "}portal?
          </p>
        </div>
      </div>
    </div>
  );
}
