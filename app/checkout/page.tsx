"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CreditCard, Lock, ArrowLeft, Check, Loader2 } from "lucide-react";

const plans = {
  pro: {
    name: "Pro",
    price: 49,
    features: [
      "Featured listing placement",
      "Unlimited photos",
      "Priority support",
      "Advanced analytics",
      "Boost visibility",
    ],
  },
  premium: {
    name: "Premium",
    price: 99,
    features: [
      "Top placement in search",
      "Unlimited everything",
      "Dedicated support",
      "Verified badge",
      "Custom branding",
      "API access",
    ],
  },
};

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams?.get("plan") || "pro";
  const selectedPlan = plans[plan as keyof typeof plans] || plans.pro;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (data.error) {
        if (data.error === "Unauthorized") {
          router.push(`/login?redirect=/checkout?plan=${plan}`);
          return;
        }
        if (data.error === "Stripe not configured") {
          // Demo mode - redirect to success
          router.push("/checkout/success");
          return;
        }
        throw new Error(data.error);
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err instanceof Error ? err.message : "Checkout failed");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/pricing"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to pricing
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>

          <div className="rounded-xl bg-gradient-to-br from-white/20 to-neutral-100/20 p-4 mb-6">
            <h3 className="font-semibold text-white mb-1">{selectedPlan.name} Plan</h3>
            <p className="text-3xl font-bold text-white">
              ${selectedPlan.price}
              <span className="text-sm font-normal text-slate-400">/month</span>
            </p>
          </div>

          <ul className="space-y-3 mb-6">
            {selectedPlan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-slate-300">
                <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>

          <div className="border-t border-white/10 pt-4">
            <div className="flex justify-between text-slate-400 mb-2">
              <span>Subtotal</span>
              <span>${selectedPlan.price}.00</span>
            </div>
            <div className="flex justify-between text-slate-400 mb-2">
              <span>Tax</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="flex justify-between text-white font-semibold text-lg">
              <span>Total</span>
              <span>${selectedPlan.price}.00/mo</span>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-white" />
            Secure Checkout
          </h2>

          <div className="space-y-6">
            <div className="rounded-xl bg-white/10 border border-neutral-300/20 p-4">
              <h3 className="font-medium text-white mb-2">What happens next?</h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-white">1.</span>
                  You&apos;ll be redirected to our secure payment page
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white">2.</span>
                  Enter your payment details safely with Stripe
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white">3.</span>
                  Your subscription activates immediately
                </li>
              </ul>
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full rounded-xl bg-white py-4 font-semibold text-white hover:bg-neutral-200 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Redirecting to payment...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Continue to Payment
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Lock className="h-3 w-3" />
                256-bit SSL
              </div>
              <span>|</span>
              <span>Powered by Stripe</span>
              <span>|</span>
              <span>Cancel anytime</span>
            </div>

            <p className="text-xs text-slate-500 text-center">
              By subscribing, you agree to our{" "}
              <Link href="/terms" className="text-white hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="text-white hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] px-6 py-16">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="h-12 w-12 animate-spin text-neutral-200" />
          </div>
        }
      >
        <CheckoutContent />
      </Suspense>
    </div>
  );
}
