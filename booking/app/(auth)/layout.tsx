export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex">
      {/* Left: Decorative Panel */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-blue-600 to-blue-900 text-white p-12 flex-col justify-between">
        <div>
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mb-6">
            A
          </div>
          <h1 className="text-4xl font-semibold leading-tight max-w-md">
            The premium platform for managing your appointments.
          </h1>
        </div>
        <div>
          <p className="text-blue-200">&copy; 2026 Appointment App. All rights reserved.</p>
        </div>
      </div>
      
      {/* Right: Form Area */}
      <div className="flex-1 flex items-center justify-center bg-[#F8FAFC] p-6">
        {children}
      </div>
    </div>
  );
}
