"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/src/lib/supabase";
import { Loader2, Copy, Check, LogIn } from "lucide-react";

// Test credentials - update these after running seed script
const TEST_CREDENTIALS = {
  email: "test@masseurmatch.com",
  password: "TestUser123!",
};

export default function TestLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleTestLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: TEST_CREDENTIALS.email,
        password: TEST_CREDENTIALS.password,
      });

      if (signInError) {
        setError(signInError.message);
      } else if (data.user) {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Login failed. Make sure test user is seeded.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Test Login</h1>
          <p className="text-slate-400">Development/Testing Credentials</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-6">
          <h2 className="font-semibold text-white mb-4">Test Credentials</h2>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm text-slate-400 mb-1">Email</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={TEST_CREDENTIALS.email}
                readOnly
                className="flex-1 rounded-lg border border-white/10 bg-white/5 py-2 px-3 text-white font-mono text-sm"
              />
              <button
                onClick={() => copyToClipboard(TEST_CREDENTIALS.email, "email")}
                className="p-2 rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                {copied === "email" ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-slate-400 mb-1">Password</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={TEST_CREDENTIALS.password}
                readOnly
                className="flex-1 rounded-lg border border-white/10 bg-white/5 py-2 px-3 text-white font-mono text-sm"
              />
              <button
                onClick={() => copyToClipboard(TEST_CREDENTIALS.password, "password")}
                className="p-2 rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                {copied === "password" ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleTestLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 font-semibold text-white hover:bg-violet-500 disabled:opacity-50 transition-colors mb-4"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Logging in...
            </>
          ) : (
            <>
              <LogIn className="h-5 w-5" />
              Login with Test Account
            </>
          )}
        </button>

        <div className="text-center space-y-2">
          <Link href="/login" className="text-violet-400 hover:text-violet-300 text-sm">
            Go to regular login
          </Link>
          <p className="text-slate-500 text-xs">
            Make sure to run: <code className="bg-white/10 px-2 py-0.5 rounded">node scripts/seed-test-user.js</code>
          </p>
        </div>

        {/* Setup Instructions */}
        <div className="mt-8 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4">
          <h3 className="font-medium text-yellow-200 mb-2">Setup Instructions</h3>
          <ol className="text-sm text-yellow-200/80 space-y-1 list-decimal list-inside">
            <li>Copy <code className="bg-black/20 px-1 rounded">.env.local.example</code> to <code className="bg-black/20 px-1 rounded">.env.local</code></li>
            <li>Add your Supabase credentials</li>
            <li>Run <code className="bg-black/20 px-1 rounded">node scripts/seed-test-user.js</code></li>
            <li>Click "Login with Test Account" above</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
