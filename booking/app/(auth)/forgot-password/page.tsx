"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { otpSchema, resetPasswordSchema } from "@/lib/validators/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";

// Step 1 schema
const emailSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Forms
  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const otpForm = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const resetForm = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const otpValue = otpForm.watch("otp");
  const passwordValue = resetForm.watch("password") || "";

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 2 && cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown, step]);

  const onStep1Submit = async (data: { email: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      // Always proceed to step 2 to prevent email enumeration
      setStep(2);
      setCooldown(60);
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const onStep2Submit = async (data: { otp: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: data.otp, purpose: "reset" }),
      });
      const resData = await res.json();
      if (!res.ok) {
        setError(resData.error || "Invalid OTP");
      } else {
        setStep(3);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
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
        body: JSON.stringify({ purpose: "reset" }),
      });
      setCooldown(60);
    } catch (err) {
      setError("Failed to resend code");
    }
  };

  const onStep3Submit = async (data: z.infer<typeof resetPasswordSchema>) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!res.ok) {
        setError(resData.error || "Failed to reset password");
      } else {
        toast.success("Password reset successfully. Please log in.");
        router.push("/login");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 lg:hidden flex justify-center">
        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
          A
        </div>
      </div>
      
      <div className="flex justify-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= s ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>
              {s}
            </div>
            {s < 3 && <div className={`w-8 h-1 mx-2 rounded-full ${step > s ? "bg-blue-600" : "bg-slate-100"}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <>
          <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center lg:text-left">Reset Password</h2>
          <p className="text-slate-500 mb-8 text-center lg:text-left">Enter your email and we'll send you a code.</p>
          
          <form onSubmit={emailForm.handleSubmit(onStep1Submit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                {...emailForm.register("email")} 
                className="h-11 rounded-xl"
              />
              {emailForm.formState.errors.email && <p className="text-sm text-red-500">{emailForm.formState.errors.email.message}</p>}
            </div>

            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl">{error}</div>}

            <Button type="submit" disabled={isLoading} className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl mt-2">
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Send reset code
            </Button>
          </form>
        </>
      )}

      {step === 2 && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h2>
          <p className="text-slate-500 mb-8">Enter the 6-digit code we sent you.</p>
          
          <form onSubmit={otpForm.handleSubmit(onStep2Submit)} className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={(value) => {
                  otpForm.setValue("otp", value, { shouldValidate: true });
                  if (value.length === 6) otpForm.handleSubmit(onStep2Submit)();
                }}
              >
                <InputOTPGroup className="gap-2">
                  {[...Array(6)].map((_, i) => (
                    <InputOTPSlot key={i} index={i} className="w-12 h-14 text-lg rounded-xl border-slate-200" />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
            
            {otpForm.formState.errors.otp && <p className="text-sm text-red-500">{otpForm.formState.errors.otp.message}</p>}
            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl text-left">{error}</div>}

            <Button type="submit" disabled={isLoading || otpValue.length !== 6} className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Verify
            </Button>
          </form>
          
          <div className="mt-8 text-sm">
            {cooldown > 0 ? (
              <span className="text-slate-400">Resend code ({cooldown}s)</span>
            ) : (
              <button onClick={handleResend} className="text-blue-600 hover:text-blue-500 font-medium">Resend code</button>
            )}
          </div>
        </div>
      )}

      {step === 3 && (
        <>
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center lg:text-left">Set new password</h2>
          
          <form onSubmit={resetForm.handleSubmit(onStep3Submit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  {...resetForm.register("password")} 
                  className="h-11 rounded-xl pr-10"
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {resetForm.formState.errors.password && <p className="text-sm text-red-500">{resetForm.formState.errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input 
                  id="confirmPassword" 
                  type={showConfirmPassword ? "text" : "password"} 
                  {...resetForm.register("confirmPassword")} 
                  className="h-11 rounded-xl pr-10"
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {resetForm.formState.errors.confirmPassword && <p className="text-sm text-red-500">{resetForm.formState.errors.confirmPassword.message}</p>}
            </div>

            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl">{error}</div>}

            <Button type="submit" disabled={isLoading} className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl mt-4">
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Reset Password
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
