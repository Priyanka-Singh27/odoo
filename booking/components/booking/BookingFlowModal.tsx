"use client";

import React, { useState, useMemo } from "react";
import { X, Calendar as CalendarIcon, MapPin, CheckCircle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MultiStepProgress from "@/components/shared/MultiStepProgress";
import { Calendar } from "@/components/ui/calendar";
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
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedProvider, setSelectedProvider] = useState<{id: string, name: string} | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [capacity, setCapacity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");

  const [isSuccess, setIsSuccess] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);

  const [slotsData, setSlotsData] = useState<any[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  const manageCapacity = appointment?.manage_capacity === 1;
  const advancePayment = appointment?.advance_payment === 1;
  const manualConfirmation = appointment?.manual_confirmation === 1;

  // Dynamically calculate steps
  const steps = useMemo(() => {
    if (!appointment) return [];
    if (isRescheduling) return ["Date & Time"];
    const s = ["Select Provider", "Date & Time"];
    if (manageCapacity) s.push("Capacity");
    s.push("Questions");
    if (advancePayment) s.push("Payment");
    return s;
  }, [appointment, manageCapacity, advancePayment, isRescheduling]);

  React.useEffect(() => {
    if (selectedProvider && selectedDate && appointment) {
      const fetchSlots = async () => {
        setIsLoadingSlots(true);
        const dateStr = selectedDate.toISOString().split('T')[0];
        try {
          const res = await fetch(`/api/slots?appointmentId=${appointment.id}&providerId=${selectedProvider.id}&date=${dateStr}`);
          if (res.ok) {
            const data = await res.json();
            setSlotsData(data.data || []);
          }
        } catch (err) {}
        setIsLoadingSlots(false);
      };
      fetchSlots();
    } else {
      setSlotsData([]);
    }
  }, [selectedProvider, selectedDate, appointment]);

  React.useEffect(() => {
    if (selectedProvider && appointment) {
      const fetchAvailableDates = async () => {
        const monthStr = currentMonth.toISOString().split('T')[0].substring(0, 7);
        try {
          const res = await fetch(`/api/slots/monthly?appointmentId=${appointment.id}&providerId=${selectedProvider.id}&month=${monthStr}`);
          if (res.ok) {
            const data = await res.json();
            setAvailableDates(data.availableDates || []);
          }
        } catch (err) {}
      };
      fetchAvailableDates();
    } else {
      setAvailableDates([]);
    }
  }, [selectedProvider, currentMonth, appointment]);

  if (!isOpen || !appointment) return null;

  const currentStepName = steps[stepIndex];
  
  const handleNext = () => {
    if (stepIndex === steps.length - 1) {
      setIsSuccess(true);
      return;
    }
    setStepIndex(s => Math.min(steps.length - 1, s + 1));
  };

  const handlePrev = () => {
    setStepIndex(s => Math.max(0, s - 1));
  };

  const handleClose = () => {
    if (isSuccess || stepIndex === 0 || (isRescheduling && stepIndex === 0)) {
      onClose();
      setTimeout(() => resetState(), 300);
    } else {
      if (confirm("Are you sure you want to cancel your booking? Your progress will be lost.")) {
        onClose();
        setTimeout(() => resetState(), 300);
      }
    }
  };

  const resetState = () => {
    setStepIndex(0);
    setSelectedProvider(null);
    setSelectedDate(new Date());
    setSelectedSlot(null);
    setCapacity(1);
    setIsSuccess(false);
    setIsRescheduling(false);
  };

  const handleReschedule = () => {
    setIsSuccess(false);
    setIsRescheduling(true);
    setStepIndex(0); // Go to Date & Time step
  };

  const handleCancelAppointment = () => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      onClose();
      setTimeout(() => resetState(), 300);
    }
  };

  const isNextDisabled = () => {
    if (currentStepName === "Select Provider" && !selectedProvider) return true;
    if (currentStepName === "Date & Time" && (!selectedDate || !selectedSlot)) return true;
    return false;
  };

  const providers = appointment.provider_data ? JSON.parse(appointment.provider_data) : [];

  const calendarClassNames = {
    months: "w-full",
    month: "w-full space-y-4 relative",
    nav: "flex items-center justify-between w-full mb-4 z-10 relative",
    month_caption: "absolute inset-x-0 top-0 flex justify-center items-center pointer-events-none font-semibold text-slate-800 text-sm h-7",
    button_previous: "w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors z-10 pointer-events-auto",
    button_next: "w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors z-10 pointer-events-auto",
    table: "w-full border-collapse space-y-1",
    head_row: "flex w-full justify-between",
    head_cell: "text-slate-400 font-medium text-xs w-8 text-center",
    row: "flex w-full justify-between mt-2",
    cell: "h-8 w-8 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-transparent focus-within:relative focus-within:z-20",
    day: "h-8 w-8 p-0 font-normal hover:bg-blue-50 rounded-full transition-colors flex items-center justify-center",
    day_selected: "bg-blue-500 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-500 focus:text-white rounded-full font-medium shadow-sm !bg-blue-500 !text-white",
    day_today: "font-semibold",
    day_outside: "text-slate-300 opacity-50",
    day_disabled: "text-slate-300 opacity-50",
  };

  const calendarModifiers = {
    available: (date: Date) => {
      const dateStr = date.toISOString().split('T')[0];
      return availableDates.includes(dateStr);
    }
  };

  const calendarModifiersClassNames = {
    available: "bg-[#e6f4ea] text-[#1a7f37] rounded-full font-medium"
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 sm:p-6">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => {}} />
        <div className="relative w-full h-full sm:h-[85vh] sm:max-h-[850px] max-w-[720px] bg-white sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          <div className="p-8 flex-1 overflow-y-auto">
            <div className="flex flex-col items-center text-center mb-8">
              {manualConfirmation ? (
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
              )}
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                {manualConfirmation ? "Appointment Reserved" : "Appointment Confirmed"}
              </h2>
              {manualConfirmation && (
                <p className="text-slate-500">You will receive a mail when the organiser confirms your booking.</p>
              )}
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100 space-y-4 text-left">
              <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-1">Time</p>
                  <p className="text-slate-800 font-semibold">{selectedDate?.toDateString()}, {selectedSlot}</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                    Add to Google Calendar
                  </button>
                  <button className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                    Add to Outlook
                  </button>
                </div>
              </div>

              <div className="flex gap-12 border-b border-slate-200 pb-4">
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-1">Duration</p>
                  <p className="text-slate-800 font-semibold">{appointment.duration} min</p>
                </div>
                {manageCapacity && !isRescheduling && (
                  <div>
                    <p className="text-sm text-slate-500 font-medium mb-1">No. of people</p>
                    <p className="text-slate-800 font-semibold">{capacity}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-1">Provider</p>
                  <p className="text-slate-800 font-semibold">{selectedProvider?.name}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Venue</p>
                <p className="text-slate-800 font-semibold">{appointment.location || "Doctor's Office"}</p>
                <p className="text-slate-600 text-sm mt-1">64 Doctor Street<br/>Springfield 380005</p>
              </div>
            </div>

            {!manualConfirmation && (
              <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-center text-sm font-medium border border-blue-100">
                Thank you for your trust, we look forward to meeting you.
              </div>
            )}
          </div>
          
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col gap-4 shrink-0">
            <div className="flex gap-4">
              <button 
                onClick={handleCancelAppointment}
                className="flex-1 py-3 px-4 rounded-xl font-medium border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleReschedule}
                className="flex-1 py-3 px-4 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
              >
                Reschedule
              </button>
            </div>
            <button 
              onClick={() => {
                onClose();
                setTimeout(() => resetState(), 300);
              }}
              className="text-sm font-medium text-slate-500 hover:text-slate-700 mx-auto flex items-center transition-colors"
            >
              Back to appointments <span className="ml-1">↗</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleClose} />
      
      <div className="relative w-full h-full sm:h-[85vh] sm:max-h-[850px] max-w-[720px] bg-slate-50 sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-800 leading-tight">{appointment.name}</h2>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">
              {isRescheduling ? "Rescheduling" : `Step ${stepIndex + 1} of ${steps.length}`}
            </p>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 -mr-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        {isRescheduling ? (
          <div className="bg-amber-50 px-6 py-4 shrink-0 border-b border-amber-100 flex flex-col justify-center">
            <h3 className="text-base font-bold text-amber-900">Reschedule your appointment</h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-amber-800 font-medium">
              <CalendarIcon className="w-4 h-4" />
              Current reservation: {selectedDate?.toDateString()} - {selectedSlot}
            </div>
          </div>
        ) : (
          <div className="px-6 py-3 bg-white shrink-0 border-b border-slate-100">
            <MultiStepProgress steps={steps} currentStep={stepIndex + 1} />
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:pt-4 sm:pb-6 sm:px-6 bg-slate-50/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={stepIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col"
            >
              {/* Step 1: Select Provider */}
              {currentStepName === "Select Provider" && (
                <div className="max-w-xl mx-auto w-full">
                  <h3 className="text-base font-semibold text-slate-700 mb-4">With</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {providers.map((p: any) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedProvider(p)}
                        className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${
                          selectedProvider?.id === p.id 
                            ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500 shadow-sm" 
                            : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          <img src={`https://i.pravatar.cc/150?u=${p.id}`} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{p.name}</p>
                          <p className="text-xs text-slate-500">Staff Member</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Date & Time */}
              {currentStepName === "Date & Time" && (
                <div className="flex flex-col sm:flex-row gap-6 h-full">
                  <div className="w-full sm:w-[320px] shrink-0 flex flex-col gap-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        month={currentMonth}
                        onMonthChange={setCurrentMonth}
                        modifiers={calendarModifiers}
                        modifiersClassNames={calendarModifiersClassNames}
                        className="w-full relative"
                        classNames={calendarClassNames}
                      />
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                      <h4 className="text-sm font-semibold text-slate-800 mb-2">About</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {appointment.description || "Join us for a detailed consultation session with our experts."}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col min-h-[300px]">
                    <h3 className="text-base font-semibold text-slate-800 mb-4">
                      {selectedDate ? selectedDate.toDateString() : "Select a date"}
                    </h3>
                    
                    {isLoadingSlots ? (
                      <div className="flex items-center justify-center p-8 flex-1">
                        <p className="text-sm text-slate-500">Loading available slots...</p>
                      </div>
                    ) : slotsData.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 overflow-y-auto pr-2">
                        {slotsData.map((slot) => {
                          const isBooked = !slot.isAvailable;
                          const isSelected = selectedSlot === slot.startTime;
                          return (
                            <button
                              key={slot.id}
                              disabled={isBooked}
                              onClick={() => setSelectedSlot(slot.startTime)}
                              className={`py-2.5 rounded-xl text-sm font-medium border text-center transition-all ${
                                isSelected
                                  ? "bg-blue-500 text-white border-blue-500 shadow-sm"
                                  : isBooked
                                  ? "bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed"
                                  : "bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                              }`}
                            >
                              {slot.startTime}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 text-center flex-1">
                        <p className="text-sm text-slate-500 mb-2">No slots available on this date.</p>
                        <p className="text-xs text-slate-400">Please select another date from the calendar.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Capacity */}
              {currentStepName === "Capacity" && (
                <div className="flex flex-col sm:flex-row gap-6 h-full opacity-100">
                  <div className="w-full sm:w-[320px] shrink-0 opacity-50 pointer-events-none">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-6">
                      <Calendar 
                        mode="single" 
                        selected={selectedDate} 
                        month={currentMonth} 
                        modifiers={calendarModifiers}
                        modifiersClassNames={calendarModifiersClassNames}
                        className="w-full relative" 
                        classNames={calendarClassNames} 
                      />
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-6 opacity-50 pointer-events-none shrink-0">
                      <h3 className="text-base font-semibold text-slate-800 mb-4">{selectedDate?.toDateString()}</h3>
                      <button className="w-full py-2.5 rounded-xl text-sm font-medium bg-blue-500 text-white border border-blue-500 text-center">
                        {selectedSlot}
                      </button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex-1 flex flex-col justify-center items-center">
                      <h3 className="text-lg font-semibold text-slate-800 mb-6">Number of people</h3>
                      <CapacityStepper 
                        value={capacity} 
                        onChange={setCapacity} 
                        max={slotsData.find(s => s.startTime === selectedSlot)?.remainingCapacity || 10} 
                      />
                      <p className="text-sm text-slate-500 mt-6">
                        Limit: {slotsData.find(s => s.startTime === selectedSlot)?.remainingCapacity || 10} spots remaining
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Questions */}
              {currentStepName === "Questions" && (
                <div className="max-w-2xl mx-auto w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
                  <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-800">Details</h3>
                    <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">
                      {appointment.name}
                    </span>
                  </div>
                  <QuestionsForm isAdvancePayment={advancePayment} onNext={() => {}} hideButton />
                </div>
              )}

              {/* Step 5: Payment */}
              {currentStepName === "Payment" && (
                <div className="flex flex-col sm:flex-row gap-6 w-full max-w-4xl mx-auto">
                  <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-6">Payment Method</h3>
                    <div className="space-y-4 mb-8">
                      {["Credit Card", "Debit Card", "UPI Pay", "Paypal"].map(method => (
                        <label key={method} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                          paymentMethod === method ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:bg-slate-50"
                        }`}>
                          <input 
                            type="radio" 
                            name="paymentMethod" 
                            value={method} 
                            checked={paymentMethod === method}
                            onChange={() => setPaymentMethod(method)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="font-medium text-slate-800">{method}</span>
                        </label>
                      ))}
                    </div>
                    
                    {paymentMethod === "Credit Card" || paymentMethod === "Debit Card" ? (
                      <div className="space-y-4">
                        <input type="text" placeholder="Name on Card" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <input type="text" placeholder="Card Number" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <div className="flex gap-4">
                          <input type="text" placeholder="MM/YY" className="w-1/2 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          <input type="text" placeholder="CVV" className="w-1/2 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                      </div>
                    ) : paymentMethod === "UPI Pay" ? (
                      <input type="text" placeholder="Enter UPI ID (e.g. name@bank)" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    ) : null}
                  </div>
                  
                  <div className="w-full sm:w-[320px] shrink-0">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-0">
                      <h3 className="text-lg font-semibold text-slate-800 mb-6">Order Summary</h3>
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm text-slate-600">
                          <span>{appointment.name}</span>
                          <span className="font-medium text-slate-800">$1000.00</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600">
                          <span>Subtotal</span>
                          <span className="font-medium text-slate-800">$1000.00</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600">
                          <span>Taxes</span>
                          <span className="font-medium text-slate-800">$100.00</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-base font-bold text-slate-800 pt-4 border-t border-slate-100">
                        <span>Total</span>
                        <span>$1100.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="bg-white px-6 py-4 border-t border-slate-100 flex items-center justify-between shrink-0">
          {stepIndex > 0 && !(isRescheduling && stepIndex === 0) ? (
            <button 
              onClick={handlePrev}
              className="px-6 py-2.5 rounded-xl font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Back
            </button>
          ) : (
            <div></div> // Spacer
          )}
          
          <button 
            onClick={handleNext}
            disabled={isNextDisabled()}
            className={`px-8 py-2.5 rounded-xl font-medium transition-colors shadow-sm ${
              isNextDisabled() 
                ? "bg-blue-300 text-white cursor-not-allowed" 
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {currentStepName === "Questions" 
              ? (advancePayment ? "Proceed to Payment" : "Confirm")
              : currentStepName === "Payment"
              ? "Pay Now"
              : "Next"}
          </button>
        </div>

      </div>
    </div>
  );
}
