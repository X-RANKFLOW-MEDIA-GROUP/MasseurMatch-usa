"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { motion } from "framer-motion";

interface IdentityVerificationProps {
  onNext: () => void;
  onBack: () => void;
}

export function IdentityVerification({ onNext, onBack }: IdentityVerificationProps) {
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
        <h2 className="text-3xl font-bold text-white mb-2">No Identity Verification</h2>
        <p className="text-slate-400">
          MasseurMatch does not verify identities or professional licenses.
        </p>
      </div>

      <Card className="glass-effect border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">What This Means</CardTitle>
          <CardDescription className="text-slate-400">
            Profiles are self-declared and managed by independent providers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-slate-300">
            Clients should confirm credentials directly with providers before
            scheduling services.
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
