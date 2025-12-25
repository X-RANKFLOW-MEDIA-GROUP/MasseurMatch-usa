"use client";

import { Check } from "lucide-react";
import { cn } from "@/components/ui/utils";

interface Step {
  id: string;
  label: string;
  description?: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function StepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                {/* Circle */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                    isCompleted && "bg-gradient-to-r from-purple-500 to-pink-500 border-purple-500",
                    isCurrent && "border-purple-500 bg-slate-900 ring-4 ring-purple-500/20",
                    isUpcoming && "border-slate-700 bg-slate-900"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        isCurrent && "text-purple-400",
                        isUpcoming && "text-slate-500"
                      )}
                    >
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Label */}
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      "text-xs font-medium",
                      (isCompleted || isCurrent) && "text-white",
                      isUpcoming && "text-slate-500"
                    )}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-slate-500 mt-0.5 hidden md:block">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 -mt-8">
                  <div
                    className={cn(
                      "h-full transition-all duration-300",
                      isCompleted && "bg-gradient-to-r from-purple-500 to-pink-500",
                      !isCompleted && "bg-slate-700"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
