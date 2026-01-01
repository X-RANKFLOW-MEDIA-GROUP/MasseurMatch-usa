"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface PlanSelectionProps {
  onNext: () => void;
  onPlanSelected: (requiresPayment: boolean) => void;
}

export function PlanSelection({ onNext, onPlanSelected }: PlanSelectionProps) {
  const handleContinue = () => {
    onPlanSelected(false);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Profile Setup</h2>
        <p className="text-slate-400">
          There are no plans, payments, or subscriptions required to list on
          MasseurMatch.
        </p>
      </div>

      <Card className="glass-effect border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">What to Expect</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-purple-400 mt-0.5" />
            <p className="text-slate-300">Directory-only listing with self-managed details.</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-purple-400 mt-0.5" />
            <p className="text-slate-300">No payments, subscriptions, or billing information required.</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-purple-400 mt-0.5" />
            <p className="text-slate-300">No identity or license verification is performed.</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center pt-4">
        <Button
          onClick={handleContinue}
          size="lg"
          className="px-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
