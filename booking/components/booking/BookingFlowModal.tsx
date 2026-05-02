"use client";

import React, { useState } from "react";
import { X, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MultiStepProgress from "@/components/shared/MultiStepProgress";
import BookingSummaryCard from "@/components/booking/BookingSummaryCard";
import DoctorCard from "@/components/booking/DoctorCard";
import DoctorDetail from "@/components/booking/DoctorDetail";
import BookingRightPanel from "@/components/booking/BookingRightPanel";
import CapacityStepper from "@/components/booking/CapacityStepper";
import QuestionsForm from "@/components/booking/QuestionsForm";
import PaymentForm from "@/components/booking/PaymentForm";
import { AppointmentType } from "./AppointmentCard";

interface BookingFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentType | null;
}

export default function BookingFlowModal({ isOpen, onClose, appointment }: BookingFlowModalProps) {
  const [step, setStep] = useState(1);
  const [capacity, setCapacity] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !appointment) return null;

  const steps = ["Provider", "Date & Time", "Capacity", "Questions", "Payment"];
  
  // Use appointment properties to control flow
  const manageCapacity = appointment.manage_capacity === 1;
  const advancePayment = appointment.advance_payment === 1;

  const nextStep = () => {
    if (step === 5 || (!advancePayment && step === 4)) {
      setIsSuccess(true);
      return;
    }
    
    if (!manageCapacity && step === 2) {
      setStep(4); // Skip capacity
      return;
    }

    setStep((s) => Math.min(5, s + 1));
  };

  const prevStep = () => {
    if (step === 4 && !manageCapacity) {
      setStep(2);
      return;
    }
    setStep((s) => Math.max(1, s - 1));
  };

  const handleClose = () => {
    if (isSuccess || step === 1) {
      onClose();
      setTimeout(() => {
        setStep(1);
        setIsSuccess(false);
      }, 300);
    } else {
      if (confirm("Are you sure you want to cancel your booking? Your progress will be lost.")) {
        onClose();
        setTimeout(() => {
          setStep(1);
          setIsSuccess(false);
        }, 300);
      }
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleClose} />
        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Booking Confirmed!</h2>
          <p className="text-slate-500 mb-8">
            Your appointment for {appointment.name} has been successfully scheduled. We've sent a confirmation email with details.
          </p>
          <button 
            onClick={handleClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleClose} />
      
      <div className="relative w-full h-full sm:h-[80vh] sm:max-h-[800px] max-w-[900px] bg-slate-50 sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            {step > 1 && (
              <button 
                onClick={prevStep}
                className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h2 className="text-lg font-bold text-slate-800 leading-tight">{appointment.name}</h2>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Step {step} of {advancePayment ? 5 : 4}</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 -mr-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-white shrink-0 border-b border-slate-100">
          <MultiStepProgress steps={steps} currentStep={step} />
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col sm:flex-row gap-6 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col sm:flex-row gap-6 h-full min-h-[400px]"
            >
              {/* Step 1: Select Provider */}
              {step === 1 && (
                <div className="flex-1 flex flex-col sm:flex-row gap-6 w-full">
                  <div className="w-full sm:w-[280px] shrink-0 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-full">
                    <div className="p-4 border-b border-slate-100 bg-slate-50">
                      <h3 className="text-sm font-semibold text-slate-700">Choose Provider</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
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
                  <div className="hidden sm:block flex-1">
                    <DoctorDetail />
                  </div>
                </div>
              )}

              {/* Step 2: Date & Time */}
              {step === 2 && (
                <div className="flex-1 flex flex-col gap-6 w-full">
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6 flex gap-4 items-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                      <img src="https://i.pravatar.cc/150?u=amanda" alt="Amanda Clara" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-semibold text-slate-800">Amanda Clara</h2>
                      <p className="text-xs sm:text-sm text-slate-500">Psychologist · 12 years experience</p>
                    </div>
                  </div>
                  <div className="flex-1 hidden sm:flex justify-center items-center bg-white/50 rounded-2xl border border-slate-200 border-dashed">
                    <p className="text-slate-400">Select a date and time from the panel</p>
                  </div>
                </div>
              )}

              {/* Step 3: Capacity */}
              {step === 3 && (
                <div className="flex-1 flex justify-center items-center bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <CapacityStepper value={capacity} onChange={setCapacity} max={10} onNext={nextStep} />
                </div>
              )}

              {/* Step 4: Questions */}
              {step === 4 && (
                <div className="flex-1 flex justify-center items-center bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <QuestionsForm onNext={nextStep} isAdvancePayment={advancePayment} />
                </div>
              )}

              {/* Step 5: Payment */}
              {step === 5 && (
                <div className="flex-1 flex justify-center items-start pt-4 sm:pt-10 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <PaymentForm onNext={nextStep} price={1100} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Right Panel / Summary */}
          <div className="w-full sm:w-[320px] lg:w-[340px] shrink-0">
            {step === 2 ? (
              <BookingRightPanel onNext={nextStep} />
            ) : step !== 5 && step !== 1 ? (
              <BookingSummaryCard 
                serviceName={appointment.name}
                providerName={step >= 2 ? "Amanda Clara" : undefined}
                date={step >= 3 ? "Dec 12, 2026" : undefined}
                time={step >= 3 ? "12:00 AM" : undefined}
                capacity={step >= 4 && manageCapacity ? capacity : undefined}
                price={advancePayment ? 1100 : undefined}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
