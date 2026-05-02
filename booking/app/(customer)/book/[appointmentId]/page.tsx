"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import MultiStepProgress from "@/components/shared/MultiStepProgress";
import BookingSummaryCard from "@/components/booking/BookingSummaryCard";
import DoctorCard from "@/components/booking/DoctorCard";
import DoctorDetail from "@/components/booking/DoctorDetail";
import BookingRightPanel from "@/components/booking/BookingRightPanel";
import CapacityStepper from "@/components/booking/CapacityStepper";
import QuestionsForm from "@/components/booking/QuestionsForm";
import PaymentForm from "@/components/booking/PaymentForm";

export default function BookingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [capacity, setCapacity] = useState(1);

  const steps = ["Select Provider", "Choose Date & Time", "Capacity", "Questions", "Payment"];
  
  // Mock feature flags
  const manageCapacity = true;
  const advancePayment = true;

  const nextStep = () => {
    if (step === 5 || (!advancePayment && step === 4)) {
      router.push("/confirmation");
      return;
    }
    
    if (!manageCapacity && step === 2) {
      setStep(4);
      return;
    }

    setStep((s) => Math.min(5, s + 1));
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden">
      <MultiStepProgress steps={steps} currentStep={step} />

      <div className="flex gap-6 flex-1 min-h-0 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex gap-6 h-full"
          >
            {/* Main Content Area */}
            {step === 1 && (
              <div className="flex-1 flex gap-6 min-w-0 h-full">
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
                      onClick={nextStep}
                    />
                    <DoctorCard 
                      name="Esther Howard" 
                      specialty="Pediatrician" 
                      experience="8 yrs exp" 
                      imageUrl="https://i.pravatar.cc/150?u=esther" 
                      specialtyChip="Pediatrics" 
                    />
                  </div>
                </div>
                <DoctorDetail />
              </div>
            )}

            {step === 2 && (
              <div className="flex-1 flex flex-col gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex gap-4 items-center h-[112px]">
                  <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                    <img src="https://i.pravatar.cc/150?u=amanda" alt="Amanda Clara" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-800">Amanda Clara</h2>
                    <p className="text-sm text-slate-500">Psychologist · 12 years experience</p>
                  </div>
                </div>
                <div className="flex-1 flex justify-center items-center bg-white rounded-2xl shadow-sm border border-slate-100 border-dashed">
                  <p className="text-slate-400">Select a date and time from the right panel</p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex-1 flex justify-center items-center bg-white/50 rounded-2xl">
                <CapacityStepper value={capacity} onChange={setCapacity} max={10} onNext={nextStep} />
              </div>
            )}

            {step === 4 && (
              <div className="flex-1 flex justify-center items-center bg-white/50 rounded-2xl">
                <QuestionsForm onNext={nextStep} isAdvancePayment={advancePayment} />
              </div>
            )}

            {step === 5 && (
              <div className="flex-1 flex justify-center items-start pt-10">
                <PaymentForm onNext={nextStep} price={1100} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Right Panel */}
        {step === 2 ? (
          <BookingRightPanel onNext={nextStep} />
        ) : step !== 5 ? (
          <BookingSummaryCard 
            serviceName="Psychological Consultation"
            providerName={step >= 2 ? "Amanda Clara" : undefined}
            date={step >= 3 ? "Dec 12, 2026" : undefined}
            time={step >= 3 ? "12:00 AM" : undefined}
            capacity={step >= 4 ? capacity : undefined}
            price={1100}
          />
        ) : null}
      </div>
    </div>
  );
}
