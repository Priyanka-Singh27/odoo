import { useState } from "react";

interface QuestionsFormProps {
  onNext: () => void;
  isAdvancePayment: boolean;
}

export default function QuestionsForm({ onNext, isAdvancePayment }: QuestionsFormProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 max-w-md w-full">
      <h2 className="text-xl font-semibold text-slate-800 mb-6">A few quick questions</h2>
      
      <div className="flex flex-col gap-5 mb-8">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">What is the primary reason for your visit?</label>
          <input type="text" className="w-full rounded-xl border border-slate-200 bg-white h-10 px-4 text-sm focus:outline-none focus:border-blue-500" placeholder="e.g., Routine checkup, specific pain..." />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Any pre-existing medical conditions?</label>
          <textarea className="w-full rounded-xl border border-slate-200 bg-white p-4 text-sm focus:outline-none focus:border-blue-500 min-h-[100px] resize-none" placeholder="Please list them here..." />
        </div>
        
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-500 focus:ring-blue-500" />
          <span className="text-sm text-slate-600">I have read and agree to the clinic policies</span>
        </label>
      </div>

      <button 
        onClick={onNext}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 font-medium transition-colors"
      >
        {isAdvancePayment ? "Proceed to Payment" : "Confirm Booking"}
      </button>
    </div>
  );
}
