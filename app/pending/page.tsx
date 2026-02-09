// app/pending/page.tsx

export default function PendingPage() {
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
          textAlign: "center",
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
          Payment Pending
        </h1>

        <p
          style={{
            maxWidth: "560px",
            fontSize: "1rem",
            opacity: 0.85,
            margin: "0 auto 1.5rem",
            lineHeight: 1.6,
          }}
        >
          Your payment is under review or awaiting confirmation. As soon as the
          status updates, you will have access to all premium MasseurMatch
          features.
        </p>
      </section>
    </main>
  );
}
