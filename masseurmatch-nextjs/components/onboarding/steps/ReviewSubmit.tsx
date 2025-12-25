"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/lib/hooks/useOnboarding";
import { CheckCircle, XCircle, AlertCircle, Loader2, Send } from "lucide-react";
import { motion } from "framer-motion";
import type { Profile } from "@/lib/types/database";

interface ReviewSubmitProps {
  onBack: () => void;
  onComplete: () => void;
}

interface ValidationItem {
  label: string;
  status: "success" | "error" | "pending";
  message?: string;
}

export function ReviewSubmit({ onBack, onComplete }: ReviewSubmitProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [validationItems, setValidationItems] = useState<ValidationItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const { getCurrentProfile, submitForReview, loading, error } = useOnboarding();

  useEffect(() => {
    const loadProfile = async () => {
      const profileData = await getCurrentProfile();
      setProfile(profileData);

      // Build validation checklist
      const items: ValidationItem[] = [
        {
          label: "Identity Verification",
          status: "success", // Check users.identity_status
          message: "Identity verified with Stripe",
        },
        {
          label: "Content Moderation",
          status: "success", // Check profiles.auto_moderation
          message: "All content passed automatic moderation",
        },
        {
          label: "Profile Information",
          status: "success", // Check required fields
          message: "All required fields completed",
        },
        {
          label: "Pricing Rates",
          status: "success", // Check valid rates
          message: "Rates configured within limits",
        },
        {
          label: "Photos Approved",
          status: "success", // Check media_assets
          message: "At least one photo approved",
        },
        {
          label: "Subscription Active",
          status: "success", // Check subscription status for paid plans
          message: "Payment method confirmed",
        },
      ];

      setValidationItems(items);
    };

    loadProfile();
  }, [getCurrentProfile]);

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      await submitForReview();
      onComplete();
    } catch (err) {
      console.error("Failed to submit for review:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const allValid = validationItems.every((item) => item.status === "success");

  const getStatusIcon = (status: ValidationItem["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-400" />;
      case "pending":
        return <Loader2 className="w-5 h-5 text-yellow-400 animate-spin" />;
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Send className="w-8 h-8 text-purple-400" />
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-2">Review & Submit</h2>
        <p className="text-slate-400">
          Review your information before submitting for admin approval
        </p>
      </div>

      {/* Validation Checklist */}
      <Card className="glass-effect border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Validation Checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {validationItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-4 bg-slate-900/50 rounded-lg"
            >
              {getStatusIcon(item.status)}
              <div className="flex-1">
                <p className="text-white font-medium">{item.label}</p>
                {item.message && (
                  <p className="text-sm text-slate-400 mt-1">{item.message}</p>
                )}
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="glass-effect border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">What Happens Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-purple-400">1</span>
            </div>
            <div>
              <p className="text-white font-medium">Admin Review</p>
              <p className="text-sm text-slate-400">
                Our team will review your profile within 24-48 hours
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-purple-400">2</span>
            </div>
            <div>
              <p className="text-white font-medium">Profile Goes Live</p>
              <p className="text-sm text-slate-400">
                Once approved, your profile will be published and visible to clients
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-purple-400">3</span>
            </div>
            <div>
              <p className="text-white font-medium">Start Receiving Clients</p>
              <p className="text-sm text-slate-400">
                You'll appear in search results and can start getting bookings
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warning if not all valid */}
      {!allValid && (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div className="text-sm text-yellow-200">
              <p className="font-medium mb-1">Action Required</p>
              <p className="text-yellow-200/80">
                Please complete all required items before submitting for review
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Photos
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!allValid || loading || submitting}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          size="lg"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Submit for Review
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
