"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/home");
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">Log In</h2>
      <form className="space-y-4" onSubmit={handleLogin}>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
          <input 
            type="email" 
            required
            placeholder="you@example.com" 
            className="w-full rounded-xl border border-slate-200 bg-white h-10 px-4 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <Link href="/forgot-password" className="text-xs text-blue-500 hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              required
              placeholder="••••••••" 
              className="w-full rounded-xl border border-slate-200 bg-white h-10 pl-4 pr-10 text-sm focus:outline-none focus:border-blue-500"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 text-sm font-medium transition-colors mt-2">
          Log In
        </button>
      </form>
      <div className="mt-6 text-center">
        <span className="text-sm text-slate-500">Don't have an account? </span>
        <Link href="/signup" className="text-sm text-blue-500 font-medium hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
