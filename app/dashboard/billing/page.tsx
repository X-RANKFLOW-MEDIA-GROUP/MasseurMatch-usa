"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CreditCard, Download, CheckCircle, AlertCircle, Clock, ExternalLink, Loader2, Sparkles, BadgeCheck } from "lucide-react";
import { supabase } from "@/src/lib/supabase";

type Subscription = {
  plan: string;
  status: string;
  next_billing_date?: string;
  amount: number;
};

type Invoice = {
  id: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  date: string;
  description: string;
};

const planFeatures: Record<string, string[]> = {
  free: ["Basic profile", "Limited visibility", "Standard support"],
  pro: ["Featured listing", "Unlimited photos", "Priority support", "Analytics"],
  premium: ["Top placement", "Verified badge", "Dedicated support", "Custom branding"],
};

export default function BillingPage() {
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    async function fetchBilling() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch profile for subscription info
      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_plan, subscription_status, stripe_customer_id")
        .eq("user_id", user.id)
        .single();

      if (profile) {
        setSubscription({
          plan: profile.subscription_plan || "free",
          status: profile.subscription_status || "active",
          amount: profile.subscription_plan === "premium" ? 99 : profile.subscription_plan === "pro" ? 49 : 0,
        });
      }

      // Fetch invoices
      const { data: invoiceData } = await supabase
        .from("invoices")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(10);

      setInvoices(invoiceData || []);
      setLoading(false);
    }
    fetchBilling();
  }, []);

  const openBillingPortal = async () => {
    setPortalLoading(true);
    try {
      const response = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
      });
      const data = await response.json();

      if (data.error) {
        if (data.error === "Stripe not configured") {
          alert("Billing portal requires Stripe configuration. Please contact support.");
          return;
        }
        if (data.error === "No subscription found") {
          router.push("/pricing");
          return;
        }
        throw new Error(data.error);
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error opening billing portal:", error);
      alert("Failed to open billing portal. Please try again.");
    } finally {
      setPortalLoading(false);
    }
  };

  const statusIcons = {
    paid: <CheckCircle className="h-4 w-4 text-green-400" />,
    pending: <Clock className="h-4 w-4 text-yellow-400" />,
    failed: <AlertCircle className="h-4 w-4 text-red-400" />,
  };

  const currentPlan = subscription?.plan || "free";
  const features = planFeatures[currentPlan] || planFeatures.free;

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-2">Billing</h1>
      <p className="text-slate-400 mb-8">Manage your subscription and payment methods</p>

      {loading ? (
        <div className="space-y-6">
          <div className="h-48 rounded-2xl bg-white/5 animate-pulse" />
          <div className="h-64 rounded-2xl bg-white/5 animate-pulse" />
        </div>
      ) : (
        <>
          {/* Current Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-violet-600/20 to-indigo-600/20 p-6 mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm text-slate-400">Current Plan</p>
                  {currentPlan === "premium" && (
                    <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-xs font-medium flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Premium
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-white mb-3 capitalize">
                  {currentPlan} Plan
                </h2>

                <ul className="space-y-2 mb-4">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-slate-300 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {subscription && subscription.amount > 0 && (
                  <p className="text-slate-400 text-sm">
                    ${subscription.amount}/month
                    {subscription.status === "active" && subscription.next_billing_date && (
                      <> • Renews {new Date(subscription.next_billing_date).toLocaleDateString()}</>
                    )}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                {currentPlan === "free" ? (
                  <Link
                    href="/pricing"
                    className="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-500 transition-colors text-center"
                  >
                    Upgrade Now
                  </Link>
                ) : (
                  <button
                    onClick={openBillingPortal}
                    disabled={portalLoading}
                    className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-6 py-3 font-semibold text-white hover:bg-white/20 disabled:opacity-50 transition-colors"
                  >
                    {portalLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Opening...
                      </>
                    ) : (
                      <>
                        <ExternalLink className="h-4 w-4" />
                        Manage Subscription
                      </>
                    )}
                  </button>
                )}

                {currentPlan !== "premium" && currentPlan !== "free" && (
                  <Link
                    href="/checkout?plan=premium"
                    className="flex items-center justify-center gap-2 rounded-xl border border-violet-500/50 px-6 py-3 font-medium text-violet-400 hover:bg-violet-500/10 transition-colors"
                  >
                    <Sparkles className="h-4 w-4" />
                    Upgrade to Premium
                  </Link>
                )}
              </div>
            </div>
          </motion.div>

          {/* Verified Badge Upsell */}
          {currentPlan !== "premium" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-violet-500/30 bg-violet-500/5 p-6 mb-8"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-violet-500/20">
                  <BadgeCheck className="h-6 w-6 text-violet-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">Get Verified</h3>
                  <p className="text-slate-400 text-sm mb-3">
                    Premium members get a verified badge, increasing trust and booking rates by up to 40%.
                  </p>
                  <Link
                    href="/checkout?plan=premium"
                    className="text-violet-400 hover:text-violet-300 text-sm font-medium"
                  >
                    Learn more →
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* Payment Method */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Payment Method</h3>
            {currentPlan === "free" ? (
              <div className="text-center py-6">
                <CreditCard className="h-10 w-10 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-400 mb-4">No payment method on file</p>
                <Link
                  href="/pricing"
                  className="text-violet-400 hover:text-violet-300 font-medium"
                >
                  Add payment method by upgrading
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-white/10">
                    <CreditCard className="h-6 w-6 text-violet-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Managed by Stripe</p>
                    <p className="text-sm text-slate-400">Your payment details are securely stored</p>
                  </div>
                </div>
                <button
                  onClick={openBillingPortal}
                  disabled={portalLoading}
                  className="text-sm text-violet-400 hover:text-violet-300 transition-colors disabled:opacity-50"
                >
                  {portalLoading ? "Loading..." : "Update"}
                </button>
              </div>
            )}
          </motion.div>

          {/* Invoices */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Invoice History</h3>
            {invoices.length === 0 ? (
              <div className="text-center py-8">
                <Download className="h-10 w-10 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-400">No invoices yet</p>
                {currentPlan !== "free" && (
                  <button
                    onClick={openBillingPortal}
                    className="text-violet-400 hover:text-violet-300 font-medium mt-2"
                  >
                    View invoices in billing portal
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5"
                  >
                    <div className="flex items-center gap-4">
                      {statusIcons[invoice.status]}
                      <div>
                        <p className="font-medium text-white">{invoice.description}</p>
                        <p className="text-sm text-slate-400">{new Date(invoice.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-white">${invoice.amount}</span>
                      <button className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
}
