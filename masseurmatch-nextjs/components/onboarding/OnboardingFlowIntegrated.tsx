"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { StepIndicator } from "./StepIndicator";
import { ProfileBuilder } from "./steps/ProfileBuilder";
import { PhotoUpload } from "./steps/PhotoUpload";
import { ReviewSubmit } from "./steps/ReviewSubmit";

const ONBOARDING_STEPS = [
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
    description: "Publish profile",
  },
];

interface OnboardingFlowProps {
  initialStep?: number;
}

export function OnboardingFlowIntegrated({ initialStep = 0 }: OnboardingFlowProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(initialStep);

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

  const handleComplete = () => {
    // Redirect to dashboard or waiting page
    router.push("/pending");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <ProfileBuilder onNext={handleNext} onBack={handleBack} />;
      case 1:
        return <PhotoUpload onNext={handleNext} onBack={handleBack} />;
      case 2:
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
