import { Metadata } from "next";
import Link from "next/link";
import { Clock, CheckCircle, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Pending Approval | MasseurMatch",
  description: "Your account is pending approval.",
};

export default function PendingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#0a0a0f]">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-6">
            <Clock className="h-10 w-10 text-yellow-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Pending Approval</h1>
          <p className="text-slate-400">
            Thank you for signing up! Your account is currently being reviewed by our team.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-8">
          <h2 className="font-semibold text-white mb-4">What happens next?</h2>
          <div className="space-y-4 text-left">
            {[
              { icon: CheckCircle, text: "We verify your identity" },
              { icon: CheckCircle, text: "Our team reviews your profile content" },
              { icon: Mail, text: "You'll receive an email once approved" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-300">
                <item.icon className="h-5 w-5 text-white" />
                {item.text}
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-slate-500 mb-6">
          This usually takes 1-2 business days. We&apos;ll notify you by email once your account is approved.
        </p>

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full rounded-xl border border-white/10 py-3 font-medium text-white hover:bg-white/5 transition-colors"
          >
            Return Home
          </Link>
          <Link
            href="/dashboard/support"
            className="block w-full rounded-xl bg-white py-3 font-semibold text-white hover:bg-neutral-200 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
