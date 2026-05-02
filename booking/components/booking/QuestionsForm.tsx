import { useState } from "react";

interface QuestionsFormProps {
  onNext: () => void;
  isAdvancePayment: boolean;
  hideButton?: boolean;
}

export default function QuestionsForm({ onNext, isAdvancePayment, hideButton = false }: QuestionsFormProps) {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-5 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
            <input type="text" className="w-full rounded-xl border border-slate-200 bg-white h-11 px-4 text-sm focus:outline-none focus:border-blue-500" placeholder="Jane Doe" defaultValue="Jane Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <input type="email" className="w-full rounded-xl border border-slate-200 bg-white h-11 px-4 text-sm focus:outline-none focus:border-blue-500" placeholder="jane@example.com" defaultValue="jane@example.com" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone number</label>
          <input type="tel" className="w-full rounded-xl border border-slate-200 bg-white h-11 px-4 text-sm focus:outline-none focus:border-blue-500" placeholder="+1 (555) 000-0000" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">What is the primary reason for your visit?</label>
          <input type="text" className="w-full rounded-xl border border-slate-200 bg-white h-11 px-4 text-sm focus:outline-none focus:border-blue-500" placeholder="e.g., Routine checkup, specific pain..." />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Any pre-existing medical conditions?</label>
          <textarea className="w-full rounded-xl border border-slate-200 bg-white p-4 text-sm focus:outline-none focus:border-blue-500 min-h-[100px] resize-none" placeholder="Please list them here..." />
        </div>
      </div>

      {!hideButton && (
        <button 
          onClick={onNext}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-medium transition-colors shadow-sm"
        >
          {isAdvancePayment ? "Proceed to Payment" : "Confirm Booking"}
        </button>
      )}
    </div>
  );
}
