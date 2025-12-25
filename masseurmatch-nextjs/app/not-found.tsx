import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6 text-center">
        <span className="inline-block px-4 py-2 rounded-full bg-amber-500/10 text-amber-400 text-sm font-semibold">
          Error 404
        </span>
        <h1 className="text-3xl font-bold text-white">Page not found</h1>
        <p className="text-slate-400">
          The page you&apos;re looking for doesn&apos;t exist or was moved.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition"
          >
            Go to home
          </Link>
          <Link
            href="/city/los-angeles"
            className="px-6 py-3 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/10 transition"
          >
            Explore cities
          </Link>
        </div>
      </div>
    </div>
  );
}
