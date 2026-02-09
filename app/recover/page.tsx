// app/recover/page.tsx

export default function RecoverPage() {
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
          Account Recovery
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
          This is a temporary account recovery page. Soon you will be able to
          reset your password or regain access to your therapist profile on
          MasseurMatch.
        </p>
      </section>
    </main>
  );
}
