"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

interface PaymentStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function PaymentStep({ onNext, onBack }: PaymentStepProps) {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-purple-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">No Payment Required</h2>
        <p className="text-slate-400">
          MasseurMatch does not process payments or subscriptions on the platform.
        </p>
      </div>

      <Card className="glass-effect border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Directory-Only Listings</CardTitle>
          <CardDescription className="text-slate-400">
            All transactions happen off platform between clients and providers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-slate-300">
            You can continue setting up your profile without entering billing
            information.
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={onNext}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
