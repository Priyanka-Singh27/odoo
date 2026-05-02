import { Minus, Plus } from "lucide-react";

interface CapacityStepperProps {
  value: number;
  onChange: (val: number) => void;
  max: number;
  onNext?: () => void;
  hideButton?: boolean;
}

export default function CapacityStepper({ value, onChange, max, onNext, hideButton = false }: CapacityStepperProps) {
  const handleMinus = () => onChange(Math.max(1, value - 1));
  const handlePlus = () => onChange(Math.min(max, value + 1));

  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center gap-6 mb-2">
          <button 
            onClick={handleMinus}
            disabled={value <= 1}
            className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors bg-white shadow-sm"
          >
            <Minus className="w-5 h-5" />
          </button>
          
          <input 
            type="number" 
            value={value} 
            readOnly
            className="w-24 h-14 text-center rounded-2xl border border-slate-200 text-2xl font-bold text-slate-800 focus:outline-none bg-white shadow-sm"
          />
          
          <button 
            onClick={handlePlus}
            disabled={value >= max}
            className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors bg-white shadow-sm"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {!hideButton && onNext && (
        <button 
          onClick={onNext}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-medium transition-colors mt-8 shadow-sm"
        >
          Continue
        </button>
      )}
    </div>
  );
}
