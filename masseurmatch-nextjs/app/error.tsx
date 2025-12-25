"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-6 text-center">
          <span className="inline-block px-4 py-2 rounded-full bg-red-500/10 text-red-400 text-sm font-semibold">
            500 · Server error
          </span>
          <h1 className="text-3xl font-bold text-white">Something went wrong</h1>
          <p className="text-slate-400">
            We hit an unexpected error. Try again or head back to the homepage.
          </p>

          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={reset}
              className="px-6 py-3 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition"
            >
              Try again
            </button>
            <Link
              href="/"
              className="px-6 py-3 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/10 transition"
            >
              Go home
            </Link>
          </div>

          {error?.digest && (
            <p className="text-xs text-slate-500">Error code: {error.digest}</p>
          )}
        </div>
      </body>
    </html>
  );
}
