"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { StepIndicator } from "./StepIndicator";
import { PlanSelection } from "./steps/PlanSelection";
import { PaymentStep } from "./steps/PaymentStep";
import { IdentityVerification } from "./steps/IdentityVerification";
import { ProfileBuilder } from "./steps/ProfileBuilder";
import { PhotoUpload } from "./steps/PhotoUpload";
import { ReviewSubmit } from "./steps/ReviewSubmit";
import type { SubscriptionPlan } from "@/lib/types/database";

const ONBOARDING_STEPS = [
  {
    id: "plan",
    label: "Choose Plan",
    description: "Select your tier",
  },
  {
    id: "payment",
    label: "Payment",
    description: "Billing info",
  },
  {
    id: "identity",
    label: "Verification",
    description: "Verify ID",
  },
  {
    id: "profile",
    label: "Profile",
    description: "Your details",
  },
  {
    id: "photos",
    label: "Photos",
    description: "Upload images",
  },
  {
    id: "review",
    label: "Review",
    description: "Final check",
  },
];

interface OnboardingFlowProps {
  initialStep?: number;
}

export function OnboardingFlowIntegrated({ initialStep = 0 }: OnboardingFlowProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [selectedPlan] = useState<SubscriptionPlan>("standard");
  const [requiresPayment, setRequiresPayment] = useState(true);

  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlanSelected = (needsPayment: boolean) => {
    setRequiresPayment(needsPayment);
  };

  const handleComplete = () => {
    // Redirect to dashboard or waiting page
    router.push("/pending");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <PlanSelection
            onNext={handleNext}
            onPlanSelected={handlePlanSelected}
          />
        );
      case 1:
        return requiresPayment ? (
          <PaymentStep
            selectedPlan={selectedPlan}
            onNext={handleNext}
            onBack={handleBack}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400">Skipping payment for free plan...</p>
          </div>
        );
      case 2:
        return <IdentityVerification onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <ProfileBuilder onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <PhotoUpload onNext={handleNext} onBack={handleBack} />;
      case 5:
        return <ReviewSubmit onBack={handleBack} onComplete={handleComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Welcome to MasseurMatch
          </h1>
          <p className="text-slate-400">
            Let's get your profile set up and ready to connect with clients
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-12">
          <StepIndicator steps={ONBOARDING_STEPS} currentStep={currentStep} />

          {/* Progress Bar */}
          <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <p className="text-center text-sm text-slate-400 mt-2">
            Step {currentStep + 1} of {ONBOARDING_STEPS.length}
          </p>
        </div>

        {/* Step Content */}
        <div>{renderStepContent()}</div>
      </div>
    </div>
  );
}
