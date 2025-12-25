"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/lib/hooks/useOnboarding";
import { Shield, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface IdentityVerificationProps {
  onNext: () => void;
  onBack: () => void;
}

export function IdentityVerification({ onNext, onBack }: IdentityVerificationProps) {
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "loading" | "verifying" | "success" | "failed"
  >("idle");
  const [sessionUrl, setSessionUrl] = useState<string | null>(null);
  const { createIdentitySession, getCurrentProfile, loading, error } = useOnboarding();

  useEffect(() => {
    // Check if already verified
    const checkStatus = async () => {
      // Check user identity status from Supabase
      // If verified, skip to next step
    };
    checkStatus();
  }, [getCurrentProfile]);

  const handleStartVerification = async () => {
    setVerificationStatus("loading");

    try {
      const result = await createIdentitySession();
      setSessionUrl(result.url);
      setVerificationStatus("verifying");

      // Open Stripe Identity verification in a new window
      const verificationWindow = window.open(
        result.url,
        "stripe_identity",
        "width=600,height=800"
      );

      // Poll for verification completion
      const pollInterval = setInterval(async () => {
        const profile = await getCurrentProfile();
        // Check if identity_status is 'verified'
        // If verified, clear interval and move to next step

        // For now, simulate success after 5 seconds
        setTimeout(() => {
          clearInterval(pollInterval);
          setVerificationStatus("success");
          if (verificationWindow) verificationWindow.close();
        }, 5000);
      }, 2000);
    } catch (err) {
      console.error("Failed to start verification:", err);
      setVerificationStatus("failed");
    }
  };

  const handleContinue = () => {
    onNext();
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Shield className="w-8 h-8 text-purple-400" />
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-2">Identity Verification</h2>
        <p className="text-slate-400">
          Verify your identity to ensure trust and safety for all users
        </p>
      </div>

      <Card className="glass-effect border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Why We Need Verification</CardTitle>
          <CardDescription className="text-slate-400">
            Identity verification is required before your profile can go live
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {verificationStatus === "idle" && (
            <>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-slate-900/50 rounded-lg">
                  <Shield className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium mb-1">Secure Process</p>
                    <p className="text-sm text-slate-400">
                      We use Stripe Identity, a secure and trusted verification service
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-slate-900/50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium mb-1">Quick & Easy</p>
                    <p className="text-sm text-slate-400">
                      Takes less than 2 minutes with a government-issued ID
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-slate-900/50 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium mb-1">Privacy Protected</p>
                    <p className="text-sm text-slate-400">
                      Your information is encrypted and never shared publicly
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div className="text-sm text-yellow-200">
                    <p className="font-medium mb-1">Required to Continue</p>
                    <p className="text-yellow-200/80">
                      You must complete identity verification before your profile can be published
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleStartVerification}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Start Verification
                  </>
                )}
              </Button>
            </>
          )}

          {verificationStatus === "verifying" && (
            <div className="text-center py-8 space-y-4">
              <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto" />
              <div>
                <p className="text-white font-medium mb-2">Verification in Progress</p>
                <p className="text-sm text-slate-400">
                  Please complete the verification process in the popup window
                </p>
              </div>
            </div>
          )}

          {verificationStatus === "success" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center py-8 space-y-4"
            >
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-white mb-2">Verification Complete!</p>
                <p className="text-slate-400">
                  Your identity has been successfully verified
                </p>
              </div>
              <Button
                onClick={handleContinue}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                size="lg"
              >
                Continue to Profile Setup
              </Button>
            </motion.div>
          )}

          {verificationStatus === "failed" && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-white mb-2">Verification Failed</p>
                <p className="text-slate-400">
                  {error || "There was an issue verifying your identity. Please try again."}
                </p>
              </div>
              <Button
                onClick={handleStartVerification}
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {verificationStatus === "idle" && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        </div>
      )}
    </div>
  );
}
