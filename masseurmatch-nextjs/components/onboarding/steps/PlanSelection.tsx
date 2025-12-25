"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { useOnboarding } from "@/lib/hooks/useOnboarding";
import type { SubscriptionPlan } from "@/lib/types/database";

interface Plan {
  id: SubscriptionPlan;
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "standard",
    name: "Standard",
    price: "$29/month",
    description: "Better ranking in searches + extra SEO",
    features: [
      "4 approved photos",
      "Complete FAQ and Schema.org on page",
      "Better position in search",
      "Email support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$59/month",
    description: "7-day trial with card required",
    features: [
      "All Standard features",
      "8 photos and basic Spike Insights",
      "7-day trial period",
      "Greater search prominence",
      "Priority support",
    ],
    popular: true,
  },
  {
    id: "elite",
    name: "Elite",
    price: "$119/month",
    description: "7-day trial with card required",
    features: [
      "All Pro features",
      "12 photos and complete Spike Predictor",
      "Top of inventory (limited supply per city)",
      "Priority exposure and advanced insights",
      "Dedicated support",
    ],
  },
];

interface PlanSelectionProps {
  onNext: () => void;
  onPlanSelected: (requiresPayment: boolean) => void;
}

export function PlanSelection({ onNext, onPlanSelected }: PlanSelectionProps) {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const { selectPlan, loading, error } = useOnboarding();

  const handleSelectPlan = async () => {
    if (!selectedPlan) return;

    try {
      const result = await selectPlan(selectedPlan);
      onPlanSelected(result.requiresPayment);
      onNext();
    } catch (err) {
      console.error("Failed to select plan:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Choose Your Plan</h2>
        <p className="text-slate-400">Select the plan that best fits your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative cursor-pointer transition-all h-full ${
                selectedPlan === plan.id
                  ? "border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/50"
                  : "border-slate-800 hover:border-slate-700 bg-slate-900/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-semibold text-white">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </div>
                </div>
              )}

              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-xl text-white">{plan.name}</CardTitle>
                  {selectedPlan === plan.id && (
                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-white">{plan.price}</p>
                  <p className="text-sm text-slate-400">{plan.description}</p>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="flex justify-center pt-4">
        <Button
          onClick={handleSelectPlan}
          disabled={!selectedPlan || loading}
          size="lg"
          className="px-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          {loading ? "Processing..." : "Continue"}
        </Button>
      </div>
    </div>
  );
}
