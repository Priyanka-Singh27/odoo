"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, CalendarDays } from "lucide-react";
import { loginSchema } from "@/lib/validators/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginFormValues = z.infer<typeof loginSchema>;

export default function OrganizerLoginPage() {
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
      console.log('[organizer-login] Submitting login for:', data.email);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      console.log('[organizer-login] Response:', res.status, resData);
      if (!res.ok) {
        setError(resData.error || "Invalid credentials. Please try again.");
      } else {
        const role = resData.role;
        console.log(`[organizer-login] Login success, role=${role}, redirecting...`);
        if (role === "organiser") {
          router.push("/organizer/dashboard");
        } else if (role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/home");
        }
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
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-center items-center p-12 text-center relative overflow-hidden">
        <div className="relative z-10">
          <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-8 mx-auto shadow-lg">
            <CalendarDays className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">Organizer Portal</h1>
          <p className="text-slate-400 text-base max-w-sm">
            Manage your appointments, availability, and bookings all in one place.
          </p>
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden flex justify-center">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <CalendarDays className="w-6 h-6" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-1">Organizer Login</h2>
          <p className="text-slate-500 mb-8 text-sm">Sign in to manage your appointments and schedule.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register("email")}
                className="h-11"
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Log In
            </Button>
          </form>

          <p className="mt-8 text-center text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-500 font-medium">
              ← Back to portal selection
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
