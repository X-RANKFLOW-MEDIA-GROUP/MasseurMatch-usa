import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Access Restricted | MasseurMatch",
  description: "MasseurMatch is not available in your region.",
  robots: {
    index: false,
    follow: false
  }
};

export default function BlockedPage() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      <div className="max-w-md">
        {/* Icon */}
        <div
          className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full"
          style={{
            background: "linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1))"
          }}
        >
          <svg
            className="h-12 w-12"
            style={{ color: "var(--danger)" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Title */}
        <h1
          className="mb-4 text-3xl font-bold md:text-4xl"
          style={{ color: "var(--text)" }}
        >
          Access Restricted
        </h1>

        {/* Message */}
        <p className="mb-6 text-lg" style={{ color: "var(--muted)" }}>
          MasseurMatch is not available in your region due to local regulations
          or service limitations.
        </p>

        {/* Additional info */}
        <div
          className="rounded-xl p-6"
          style={{
            background: "var(--panel)",
            border: "1px solid var(--stroke)"
          }}
        >
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            If you believe this is an error or you are using a VPN, please try
            accessing from a different connection or contact our support team.
          </p>
        </div>

        {/* Contact */}
        <div className="mt-8">
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Questions?{" "}
            <a
              href="mailto:support@masseurmatch.com"
              style={{ color: "var(--violet)" }}
              className="underline"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
