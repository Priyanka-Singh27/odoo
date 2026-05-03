"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { otpSchema } from "@/lib/validators/auth";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

type OtpFormValues = z.infer<typeof otpSchema>;

export default function VerifyOtpPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>}>
      <VerifyOtpPage />
    </Suspense>
  );
}

function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const purpose = searchParams?.get("purpose") || "verify";
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(60);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const otpValue = watch("otp");

  const [email, setEmail] = useState("");

  useEffect(() => {
    // Read pending_email cookie
    const match = document.cookie.match(/(^| )pending_email=([^;]+)/);
    if (match) {
      setEmail(decodeURIComponent(match[2]));
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const onSubmit = async (data: OtpFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: data.otp, purpose }),
      });
      
      const resData = await res.json();
      
      if (!res.ok) {
        setError(resData.error || "An error occurred");
      } else {
        if (purpose === "verify") {
          // Force a full refresh to let middleware handle the redirect
          window.location.href = "/";
        } else if (purpose === "reset") {
          // In the standalone verify page, if they are resetting, we shouldn't really be here, 
          // because forgot-password handles all 3 steps inline. But if they are, redirect them to step 3.
          router.push("/forgot-password?step=3");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setError(null);
    try {
      await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purpose }),
      });
      setCooldown(60);
    } catch (err) {
      setError("Failed to resend code");
    }
  };

  return (
    <div className="w-full text-center">
      <div className="mb-8 lg:hidden flex justify-center">
        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
          A
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h2>
      <p className="text-slate-500 mb-8">
        We sent a 6-digit code to <span className="font-medium text-slate-900">{email || "your email"}</span>
      </p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otpValue}
            onChange={(value) => {
              setValue("otp", value, { shouldValidate: true });
              if (value.length === 6) {
                // Auto-submit when filled
                handleSubmit(onSubmit)();
              }
            }}
          >
            <InputOTPGroup className="gap-2">
              {[...Array(6)].map((_, i) => (
                <InputOTPSlot key={i} index={i} className="w-12 h-14 text-lg rounded-xl border-slate-200" />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
        
        {errors.otp && <p className="text-sm text-red-500">{errors.otp.message}</p>}

        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 text-left">
            {error}
          </div>
        )}

        <Button 
          type="submit" 
          disabled={isLoading || otpValue.length !== 6} 
          className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl mt-4"
        >
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Verify
        </Button>
      </form>
      
      <div className="mt-8 text-sm">
        {cooldown > 0 ? (
          <span className="text-slate-400">Resend code ({cooldown}s)</span>
        ) : (
          <button 
            onClick={handleResend}
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Resend code
          </button>
        )}
      </div>
    </div>
  );
}
