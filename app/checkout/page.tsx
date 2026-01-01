"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CreditCard, Lock, ArrowLeft, Check } from "lucide-react";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams?.get("plan") || "pro";

  const [loading, setLoading] = useState(false);

  const plans = {
    basic: { name: "Basic", price: 29, features: ["Profile listing", "5 photos", "Basic analytics"] },
    pro: { name: "Pro", price: 79, features: ["Featured listing", "Unlimited photos", "Priority support", "Advanced analytics", "Boost visibility"] },
    premium: { name: "Premium", price: 149, features: ["Top placement", "Unlimited everything", "Dedicated support", "Custom branding", "API access"] },
  };

  const selectedPlan = plans[plan as keyof typeof plans] || plans.pro;

  const handleCheckout = async () => {
    setLoading(true);
    // In production, this would integrate with Stripe
    await new Promise(resolve => setTimeout(resolve, 2000));
    router.push("/checkout/success");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/dashboard/billing"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to billing
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>

          <div className="rounded-xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 p-4 mb-6">
            <h3 className="font-semibold text-white mb-1">{selectedPlan.name} Plan</h3>
            <p className="text-3xl font-bold text-white">${selectedPlan.price}<span className="text-sm font-normal text-slate-400">/month</span></p>
          </div>

          <ul className="space-y-3 mb-6">
            {selectedPlan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-slate-300">
                <Check className="h-4 w-4 text-green-400" />
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
              <span>$0.00</span>
            </div>
            <div className="flex justify-between text-white font-semibold text-lg">
              <span>Total</span>
              <span>${selectedPlan.price}.00</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-violet-400" />
            Payment Details
          </h2>

          <form onSubmit={(e) => { e.preventDefault(); handleCheckout(); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Card Number
              </label>
              <input
                type="text"
                placeholder="4242 4242 4242 4242"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  CVC
                </label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Name on Card
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-violet-600 py-4 font-semibold text-white hover:bg-violet-500 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                "Processing..."
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Pay ${selectedPlan.price}.00
                </>
              )}
            </button>

            <p className="text-xs text-slate-500 text-center flex items-center justify-center gap-1">
              <Lock className="h-3 w-3" />
              Secured by Stripe. Your payment info is encrypted.
            </p>
          </form>
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
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500" />
          </div>
        }
      >
        <CheckoutContent />
      </Suspense>
    </div>
  );
}
