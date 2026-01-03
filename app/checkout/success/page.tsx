import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Payment Successful | MasseurMatch",
  robots: { index: false },
};

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#0a0a0f]">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>
          <p className="text-slate-400">
            Thank you for your purchase. Your subscription is now active.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-8 text-left">
          <h2 className="font-semibold text-white mb-4">What&apos;s next?</h2>
          <ul className="space-y-3">
            {[
              "Your profile is now featured in search results",
              "Access premium analytics in your dashboard",
              "You'll receive a confirmation email shortly",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-300">
                <CheckCircle className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-violet-600 py-3 font-semibold text-white hover:bg-violet-500 transition-colors"
          >
            Go to Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/dashboard/billing"
            className="block w-full rounded-xl border border-white/10 py-3 font-medium text-white hover:bg-white/5 transition-colors"
          >
            View Invoice
          </Link>
        </div>
      </div>
    </div>
  );
}
