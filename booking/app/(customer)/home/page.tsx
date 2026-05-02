"use client";

import { useRouter } from "next/navigation";
import DoctorCard from "@/components/booking/DoctorCard";
import DoctorDetail from "@/components/booking/DoctorDetail";
import BookingRightPanel from "@/components/booking/BookingRightPanel";

export default function CustomerHome() {
  const router = useRouter();

  const categories = [
    "Cardiology", "Psychology", "Traumatology", "Pediatrics", 
    "Anesthiology", "Ophthalmology", "Dentistry", "General Diagnosis", "Neuro Surgery"
  ];
  const activeCategory = "Psychology";

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-semibold text-slate-800">Book Appointment</h1>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto py-3 mb-6 scrollbar-hide shrink-0 border-b border-slate-100 pb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              cat === activeCategory
                ? "bg-blue-500 text-white"
                : "bg-transparent text-slate-600 hover:bg-slate-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Three Column Layout */}
      <div className="flex gap-6 flex-1 min-h-0">
        
        {/* Left Column Container (List + Detail) */}
        <div className="flex-1 flex gap-6 min-w-0">
          
          {/* Doctor List */}
          <div className="w-[280px] shrink-0 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-700">Choose Doctor</h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              <DoctorCard 
                name="Amanda Clara" 
                specialty="Psychologist" 
                experience="12 yrs exp" 
                imageUrl="https://i.pravatar.cc/150?u=amanda" 
                specialtyChip="Psychology" 
                isActive={true} 
                onClick={() => router.push('/book/123')}
              />
              <DoctorCard 
                name="Esther Howard" 
                specialty="Pediatrician" 
                experience="8 yrs exp" 
                imageUrl="https://i.pravatar.cc/150?u=esther" 
                specialtyChip="Pediatrics" 
                isActive={false} 
                onClick={() => router.push('/book/124')}
              />
              <DoctorCard 
                name="Ralph Edwards" 
                specialty="Cardiologist" 
                experience="15 yrs exp" 
                imageUrl="https://i.pravatar.cc/150?u=ralph" 
                specialtyChip="Cardiology" 
                isActive={false} 
                onClick={() => router.push('/book/125')}
              />
            </div>
          </div>

          {/* Doctor Detail */}
          <DoctorDetail onBook={() => router.push('/book/123')} />
        </div>

        {/* Right Panel */}
        <BookingRightPanel onNext={() => router.push('/book/123')} />
      </div>
    </div>
  );
}
