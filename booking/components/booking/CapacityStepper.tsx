import { Minus, Plus } from "lucide-react";

interface CapacityStepperProps {
  value: number;
  onChange: (val: number) => void;
  max: number;
  onNext: () => void;
}

export default function CapacityStepper({ value, onChange, max, onNext }: CapacityStepperProps) {
  const handleMinus = () => onChange(Math.max(1, value - 1));
  const handlePlus = () => onChange(Math.min(max, value + 1));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 max-w-md w-full">
      <h2 className="text-xl font-semibold text-slate-800 mb-6">Select Capacity</h2>
      
      <div className="flex flex-col items-center justify-center py-8">
        <label className="text-sm text-slate-500 mb-4">Number of people</label>
        
        <div className="flex items-center gap-6 mb-2">
          <button 
            onClick={handleMinus}
            disabled={value <= 1}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            <Minus className="w-5 h-5" />
          </button>
          
          <input 
            type="number" 
            value={value} 
            readOnly
            className="w-20 h-12 text-center rounded-xl border border-slate-200 text-lg font-semibold text-slate-800 focus:outline-none"
          />
          
          <button 
            onClick={handlePlus}
            disabled={value >= max}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-xs text-slate-400">Max: {max} available</p>
      </div>

      <button 
        onClick={onNext}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 font-medium transition-colors mt-4"
      >
        Continue
      </button>
    </div>
  );
}
