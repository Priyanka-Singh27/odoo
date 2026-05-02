"use client";

import { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");

  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
        {[1, 2, 3].map((s) => (
          <div 
            key={s} 
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold relative z-10 transition-colors ${
              s === step ? "bg-blue-500 text-white" : s < step ? "bg-blue-100 text-blue-500" : "bg-slate-100 text-slate-400"
            }`}
          >
            {s}
          </div>
        ))}
      </div>

      {step === 1 && (
        <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
          <h2 className="text-2xl font-semibold text-slate-800 mb-2">Reset Password</h2>
          <p className="text-sm text-slate-500 mb-6">Enter your email and we'll send you a reset code.</p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <input 
              type="email" 
              required
              placeholder="you@example.com" 
              className="w-full rounded-xl border border-slate-200 bg-white h-10 px-4 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 text-sm font-medium transition-colors">
            Send reset link
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="text-center">
          <h2 className="text-2xl font-semibold text-slate-800 mb-2">Verify OTP</h2>
          <p className="text-sm text-slate-500 mb-6">Enter the 6-digit code sent to your email.</p>
          
          <div className="flex justify-center mb-6">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} className="w-10 h-12 text-lg border-slate-200 rounded-l-xl" />
                <InputOTPSlot index={1} className="w-10 h-12 text-lg border-slate-200" />
                <InputOTPSlot index={2} className="w-10 h-12 text-lg border-slate-200" />
                <InputOTPSlot index={3} className="w-10 h-12 text-lg border-slate-200" />
                <InputOTPSlot index={4} className="w-10 h-12 text-lg border-slate-200" />
                <InputOTPSlot index={5} className="w-10 h-12 text-lg border-slate-200 rounded-r-xl" />
              </InputOTPGroup>
            </InputOTP>
          </div>
          
          <button type="submit" disabled={otp.length !== 6} className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-xl py-3 text-sm font-medium transition-colors">
            Verify Code
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={(e) => { e.preventDefault(); router.push("/login"); }}>
          <h2 className="text-2xl font-semibold text-slate-800 mb-2">New Password</h2>
          <p className="text-sm text-slate-500 mb-6">Create a new secure password.</p>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••" 
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white h-10 pl-4 pr-10 text-sm focus:outline-none focus:border-blue-500"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                required
                className="w-full rounded-xl border border-slate-200 bg-white h-10 px-4 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 text-sm font-medium transition-colors">
            Reset password
          </button>
        </form>
      )}
      
      {step === 1 && (
        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-slate-500 hover:text-blue-500 font-medium transition-colors">
            &larr; Back to login
          </Link>
        </div>
      )}
    </div>
  );
}
