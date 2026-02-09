// app/join/form/page.tsx

export default function JoinFormPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "2rem 1.25rem",
        background: "#000000",
        color: "#ffffff",
      }}
    >
      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "var(--glass-bg)",
          padding: "1.75rem 1.5rem",
          borderRadius: "1.25rem",
          border: "1px solid var(--glass-border)",
          boxShadow: "var(--glass-shadow)",
          backdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-sat))",
          WebkitBackdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-sat))",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            marginBottom: "0.75rem",
            letterSpacing: "0.03em",
          }}
        >
          Join MasseurMatch
        </h1>

        <p
          style={{
            maxWidth: "560px",
            fontSize: "1rem",
            opacity: 0.85,
            marginBottom: "1.5rem",
            lineHeight: 1.6,
          }}
        >
          This is a placeholder page to keep the Vercel deployment running. We
          will connect it to the full JoinForm component, Supabase, and onboarding
          flow soon.
        </p>

        <div
          style={{
            marginTop: "1.5rem",
            padding: "1.2rem",
            background: "var(--glass-bg)",
            borderRadius: "0.8rem",
            border: "1px solid var(--glass-border)",
            backdropFilter: "blur(var(--glass-blur-soft)) saturate(var(--glass-sat))",
            WebkitBackdropFilter: "blur(var(--glass-blur-soft)) saturate(var(--glass-sat))",
          }}
        >
          <p style={{ opacity: 0.8, margin: 0 }}>
            Coming soon: a professional multi-step form with photo uploads.
          </p>
        </div>
      </section>
    </main>
  );
}
