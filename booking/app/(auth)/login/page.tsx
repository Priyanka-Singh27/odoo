"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { loginSchema } from "@/lib/validators/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginFormValues = z.infer<typeof loginSchema>;

const FEATURES = [
  { text: "Real-time slot availability" },
  { text: "Instant booking confirmation" },
  { text: "Manage teams and resources" },
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
        if (role === "organiser") router.push("/organiser/appointments");
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
    <div className="min-h-screen flex w-full">
      {/* Left panel - Brand Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#EBF4FF] flex-col p-12 justify-between">
        {/* Top left logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#378ADD] rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <span className="text-[#378ADD] font-bold text-xl tracking-tight">Appointment App</span>
        </div>

        {/* Center content */}
        <div>
          <h1 className="text-4xl font-bold text-slate-800 leading-tight mb-8 max-w-md">
            The smartest way to book, manage, and organise appointments.
          </h1>
          <div className="space-y-4">
            {FEATURES.map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#378ADD] fill-[#378ADD] text-white" />
                <span className="text-slate-700 font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <p className="text-slate-500 font-medium">Trusted by organisers, loved by customers.</p>
      </div>

      {/* Mobile top banner */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-[#EBF4FF] p-4 flex items-center justify-center gap-3 z-10 border-b border-blue-100">
        <div className="w-8 h-8 bg-[#378ADD] rounded-lg flex items-center justify-center">
          <Calendar className="w-4 h-4 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-[#378ADD] font-bold tracking-tight leading-none">Appointment App</span>
          <span className="text-blue-600/70 text-[10px] font-medium uppercase tracking-wider mt-0.5">Smart Booking</span>
        </div>
      </div>

      {/* Right panel - Form Side */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 pt-24 lg:pt-6">
        <div className="w-full max-w-[380px]">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-[22px] font-semibold text-slate-800 mb-1">Welcome back</h2>
            <p className="text-slate-400 text-sm">Fill in the details below to get started.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-slate-600">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register("email")}
                className="h-10 px-3 border-slate-200 rounded-xl focus:border-[#378ADD] focus:ring-[#378ADD]/10 placeholder:text-slate-300 text-sm"
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium text-slate-600">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className="h-10 px-3 pr-10 border-slate-200 rounded-xl focus:border-[#378ADD] focus:ring-[#378ADD]/10 placeholder:text-slate-300 text-sm"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
              <div className="flex justify-end mt-1">
                <Link href="/forgot-password" className="text-xs text-[#378ADD] hover:text-[#185FA5] font-medium">
                  Forgot password?
                </Link>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-[#FCEBEB] border border-[#F7C1C1] rounded-xl text-[#A32D2D] text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-[#378ADD] hover:bg-[#185FA5] text-white rounded-xl font-medium mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : "Sign In"}
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[#378ADD] hover:text-[#185FA5] font-medium">
              Sign up →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
