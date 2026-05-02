import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex">
      {/* Left Column (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] flex-col justify-center items-center p-12 text-center relative overflow-hidden">
        <div className="relative z-10">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-8 shadow-lg shadow-blue-500/20">
            A
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Appointment App</h1>
          <p className="text-slate-400 text-lg max-w-md mx-auto">
            Manage your schedule, connect with professionals, and seamlessly book appointments.
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Right Column (Auth Forms) */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
