import { Metadata } from "next";
import Link from "next/link";
import { Ban, Mail, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Account Blocked | MasseurMatch",
  description: "Your account has been blocked.",
};

export default function BlockedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#0a0a0f]">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
            <Ban className="h-10 w-10 text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Account Blocked</h1>
          <p className="text-slate-400">
            Your account has been blocked due to a violation of our community guidelines or terms of service.
          </p>
        </div>

        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6 mb-8">
          <div className="flex items-start gap-3 text-left">
            <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-white mb-2">Why was my account blocked?</h3>
              <p className="text-sm text-slate-400">
                Accounts may be blocked for violations such as harassment, fraud, misrepresentation,
                or other breaches of our terms. If you believe this was a mistake, please contact support.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-8">
          <h2 className="font-semibold text-white mb-4 flex items-center justify-center gap-2">
            <Mail className="h-5 w-5 text-violet-400" />
            Appeal Process
          </h2>
          <p className="text-sm text-slate-400 mb-4">
            If you believe your account was blocked in error, you can submit an appeal to our trust & safety team.
          </p>
          <a
            href="mailto:appeals@masseurmatch.com"
            className="text-violet-400 hover:text-violet-300 transition-colors"
          >
            appeals@masseurmatch.com
          </a>
        </div>

        <Link
          href="/"
          className="block w-full rounded-xl border border-white/10 py-3 font-medium text-white hover:bg-white/5 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
