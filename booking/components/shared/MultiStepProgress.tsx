import { Check } from "lucide-react";

interface MultiStepProgressProps {
  steps: string[];
  currentStep: number;
}

export default function MultiStepProgress({ steps, currentStep }: MultiStepProgressProps) {
  return (
    <div className="flex items-center gap-2 mb-8 overflow-x-auto scrollbar-hide py-2">
      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;
        const isUpcoming = stepNum > currentStep;

        return (
          <div key={step} className="flex items-center gap-2 shrink-0">
            <div
              className={`flex items-center justify-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                isCompleted
                  ? "bg-blue-500 text-white"
                  : isActive
                  ? "border-2 border-blue-500 text-blue-600 bg-blue-50"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              <span className="flex items-center gap-1.5">
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="w-4 h-4 flex items-center justify-center text-xs bg-white/20 rounded-full">
                    {stepNum}
                  </span>
                )}
                {step}
              </span>
            </div>
            
            {/* Arrow separator */}
            {index < steps.length - 1 && (
              <span className="text-slate-300 font-bold">&rarr;</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
