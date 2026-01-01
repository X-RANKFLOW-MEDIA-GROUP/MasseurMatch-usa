"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard, Download, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { supabase } from "@/src/lib/supabase";

type Invoice = {
  id: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  date: string;
  description: string;
};

type Subscription = {
  plan: string;
  status: "active" | "canceled" | "past_due";
  next_billing_date: string;
  amount: number;
};

export default function BillingPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBilling() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch subscription
      const { data: subData } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (subData) {
        setSubscription(subData);
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

  const statusIcons = {
    paid: <CheckCircle className="h-4 w-4 text-green-400" />,
    pending: <Clock className="h-4 w-4 text-yellow-400" />,
    failed: <AlertCircle className="h-4 w-4 text-red-400" />,
  };

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
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Current Plan</p>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {subscription?.plan || "Free Plan"}
                </h2>
                {subscription ? (
                  <p className="text-slate-300">
                    ${subscription.amount}/month • Next billing: {new Date(subscription.next_billing_date).toLocaleDateString()}
                  </p>
                ) : (
                  <p className="text-slate-300">Upgrade to get more visibility</p>
                )}
              </div>
              <button className="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-500 transition-colors">
                {subscription ? "Manage Plan" : "Upgrade"}
              </button>
            </div>
          </motion.div>

          {/* Payment Method */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Payment Method</h3>
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-white/10">
                  <CreditCard className="h-6 w-6 text-violet-400" />
                </div>
                <div>
                  <p className="font-medium text-white">•••• •••• •••• 4242</p>
                  <p className="text-sm text-slate-400">Expires 12/25</p>
                </div>
              </div>
              <button className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
                Update
              </button>
            </div>
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
              <p className="text-slate-400 text-center py-8">No invoices yet</p>
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
