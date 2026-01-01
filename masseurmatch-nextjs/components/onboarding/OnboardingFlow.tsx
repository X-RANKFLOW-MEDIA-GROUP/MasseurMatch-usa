"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StepIndicator } from "./StepIndicator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ONBOARDING_STEPS = [
  {
    id: "account",
    label: "Account",
    description: "Basic setup",
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
    id: "policies",
    label: "Policies",
    description: "Confirm guidelines",
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

export function OnboardingFlow({ initialStep = 0 }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState(0);

  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
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
        <div className="relative min-h-[500px]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute inset-0"
            >
              <Card className="glass-effect border-slate-800">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    {ONBOARDING_STEPS[currentStep].label}
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    {getStepDescription(currentStep)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderStepContent(currentStep)}
                </CardContent>
                <CardFooter className="flex justify-between border-t border-slate-800">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className="gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={currentStep === ONBOARDING_STEPS.length - 1}
                    className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {currentStep === ONBOARDING_STEPS.length - 1 ? "Submit" : "Next"}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function getStepDescription(step: number): string {
  const descriptions = [
    "Create your account and basic profile settings",
    "Tell us about yourself and your services",
    "Upload photos to showcase your practice",
    "Confirm you agree to the community guidelines",
    "Review your information before submitting",
  ];
  return descriptions[step] || "";
}

function renderStepContent(step: number) {
  // Placeholder content for each step
  // These will be replaced with actual form components
  const content = [
    <div key="account" className="space-y-4">
      <p className="text-slate-300">Account setup content goes here...</p>
    </div>,
    <div key="profile" className="space-y-4">
      <p className="text-slate-300">Profile form goes here...</p>
    </div>,
    <div key="photos" className="space-y-4">
      <p className="text-slate-300">Photo upload goes here...</p>
    </div>,
    <div key="policies" className="space-y-4">
      <p className="text-slate-300">Guidelines acknowledgment goes here...</p>
    </div>,
    <div key="review" className="space-y-4">
      <p className="text-slate-300">Review summary goes here...</p>
    </div>,
  ];

  return content[step] || null;
}
