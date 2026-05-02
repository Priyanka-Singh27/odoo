"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { signupSchema } from "@/lib/validators/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const passwordValue = watch("password") || "";

  // Calculate password strength (0-3)
  const getPasswordStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score += 1;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 1;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw)) score += 1;
    return score;
  };

  const strength = getPasswordStrength(passwordValue);

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const resData = await res.json();
      
      if (!res.ok) {
        if (resData.error === 'Email already in use') {
          setError(resData.error);
        } else {
          setError(resData.error || "An error occurred during signup");
        }
      } else {
        router.push("/verify-otp?purpose=verify");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
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
      
      <h2 className="text-2xl font-bold text-slate-900 mb-6 lg:text-left text-center">Create your account</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input 
            id="fullName" 
            placeholder="John Doe" 
            {...register("fullName")} 
            className="h-11 rounded-xl"
          />
          {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="name@example.com" 
            {...register("email")} 
            className="h-11 rounded-xl"
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          {error && error === 'Email already in use' && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input 
              id="password" 
              type={showPassword ? "text" : "password"} 
              {...register("password")} 
              className="h-11 rounded-xl pr-10"
            />
            <button 
              type="button" 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {passwordValue.length > 0 && (
            <div className="flex gap-1.5 mt-2">
              <div className={`h-1.5 w-1/3 rounded-full transition-colors ${strength >= 1 ? 'bg-red-500' : 'bg-slate-200'}`} />
              <div className={`h-1.5 w-1/3 rounded-full transition-colors ${strength >= 2 ? 'bg-amber-400' : 'bg-slate-200'}`} />
              <div className={`h-1.5 w-1/3 rounded-full transition-colors ${strength >= 3 ? 'bg-green-500' : 'bg-slate-200'}`} />
            </div>
          )}
          
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>

        {error && error !== 'Email already in use' && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
            {error}
          </div>
        )}

        <Button 
          type="submit" 
          disabled={isLoading} 
          className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl mt-4"
        >
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Sign Up
        </Button>
      </form>
      
      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
          Log in &rarr;
        </Link>
      </p>
    </div>
  );
}
