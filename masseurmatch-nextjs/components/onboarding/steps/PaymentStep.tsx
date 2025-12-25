"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/lib/hooks/useOnboarding";
import { Loader2, CreditCard, Lock } from "lucide-react";
import type { SubscriptionPlan } from "@/lib/types/database";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  clientSecret: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

function PaymentForm({ clientSecret, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const { error, setupIntent } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/onboarding?step=identity`,
        },
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message || "Payment setup failed");
        onError(error.message || "Payment setup failed");
      } else if (setupIntent && setupIntent.status === "succeeded") {
        onSuccess();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setErrorMessage(message);
      onError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-6 bg-slate-900/50 rounded-lg border border-slate-800">
        <PaymentElement />
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{errorMessage}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Lock className="w-4 h-4 mr-2" />
            Confirm Payment Method
          </>
        )}
      </Button>

      <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
        <Lock className="w-3 h-3" />
        <span>Secured by Stripe • Your card will not be charged until after trial</span>
      </div>
    </form>
  );
}

interface PaymentStepProps {
  selectedPlan: SubscriptionPlan;
  onNext: () => void;
  onBack: () => void;
}

export function PaymentStep({ selectedPlan, onNext, onBack }: PaymentStepProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const { createPaymentSetup, confirmPayment, loading, error } = useOnboarding();

  useEffect(() => {
    const initializePayment = async () => {
      try {
        const result = await createPaymentSetup(selectedPlan);
        setClientSecret(result.clientSecret);
        setSubscriptionId(result.subscriptionId);
      } catch (err) {
        console.error("Failed to initialize payment:", err);
      }
    };

    initializePayment();
  }, [selectedPlan, createPaymentSetup]);

  const handleSuccess = async () => {
    if (!subscriptionId) return;

    try {
      await confirmPayment("", subscriptionId); // setupIntentId will be from Stripe
      onNext();
    } catch (err) {
      console.error("Failed to confirm payment:", err);
    }
  };

  const handleError = (errorMsg: string) => {
    console.error("Payment error:", errorMsg);
  };

  if (loading || !clientSecret) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
          <p className="text-slate-400">Setting up payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-purple-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Payment Information</h2>
        <p className="text-slate-400">
          Add your payment method to start your trial
        </p>
      </div>

      <Card className="glass-effect border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Secure Payment Setup</CardTitle>
          <CardDescription className="text-slate-400">
            You won't be charged until after your trial period ends. Cancel anytime.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "night",
                variables: {
                  colorPrimary: "#8b5cf6",
                  colorBackground: "#0f172a",
                  colorText: "#f1f5f9",
                  colorDanger: "#ef4444",
                  fontFamily: "var(--font-geist-sans), sans-serif",
                  borderRadius: "0.5rem",
                },
              },
            }}
          >
            <PaymentForm
              clientSecret={clientSecret}
              onSuccess={handleSuccess}
              onError={handleError}
            />
          </Elements>
        </CardContent>
      </Card>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="flex justify-center">
        <Button variant="outline" onClick={onBack}>
          Back to Plans
        </Button>
      </div>
    </div>
  );
}
