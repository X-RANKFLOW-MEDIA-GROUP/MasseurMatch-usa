import { Metadata } from "next";
import Link from "next/link";
import { XCircle, RefreshCw, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Payment Failed | MasseurMatch",
  robots: { index: false },
};

export default function CheckoutErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#0a0a0f]">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
            <XCircle className="h-10 w-10 text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Payment Failed</h1>
          <p className="text-slate-400">
            We couldn&apos;t process your payment. Please try again or use a different payment method.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-8 text-left">
          <h2 className="font-semibold text-white mb-4">Common Issues</h2>
          <ul className="space-y-3 text-sm text-slate-400">
            <li>• Insufficient funds in your account</li>
            <li>• Card expired or invalid details</li>
            <li>• Transaction blocked by your bank</li>
            <li>• Temporary network issues</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link
            href="/checkout"
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-white py-3 font-semibold text-white hover:bg-neutral-200 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Link>
          <Link
            href="/dashboard/support"
            className="flex items-center justify-center gap-2 w-full rounded-xl border border-white/10 py-3 font-medium text-white hover:bg-white/5 transition-colors"
          >
            <HelpCircle className="h-4 w-4" />
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
