"use client";

import { useState, useEffect } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(42);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (timeLeft <= 0) return;
    const intervalId = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/home");
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center">
      <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold text-slate-800 mb-2">Check your email</h2>
      <p className="text-sm text-slate-500 mb-8">We sent a 6-digit code to your@email.com</p>
      
      <form onSubmit={handleVerify} className="space-y-6">
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} className="w-12 h-12 text-lg border-slate-200 rounded-l-xl" />
              <InputOTPSlot index={1} className="w-12 h-12 text-lg border-slate-200" />
              <InputOTPSlot index={2} className="w-12 h-12 text-lg border-slate-200" />
              <InputOTPSlot index={3} className="w-12 h-12 text-lg border-slate-200" />
              <InputOTPSlot index={4} className="w-12 h-12 text-lg border-slate-200" />
              <InputOTPSlot index={5} className="w-12 h-12 text-lg border-slate-200 rounded-r-xl" />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <button 
          type="submit" 
          disabled={otp.length !== 6}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-xl py-3 text-sm font-medium transition-colors"
        >
          Verify
        </button>
      </form>

      <div className="mt-6 text-center">
        {timeLeft > 0 ? (
          <span className="text-sm text-slate-500">Resend code in 0:{timeLeft.toString().padStart(2, '0')}</span>
        ) : (
          <button 
            onClick={() => setTimeLeft(60)}
            className="text-sm text-blue-500 font-medium hover:underline focus:outline-none"
          >
            Resend code
          </button>
        )}
      </div>
    </div>
  );
}
