export default function SuccessPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "2rem 1.5rem",
        background: "#000000",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: "520px",
          width: "100%",
          textAlign: "center",
          padding: "2rem 1.75rem",
          borderRadius: "1.25rem",
          background: "var(--glass-bg)",
          border: "1px solid var(--glass-border)",
          boxShadow: "var(--glass-shadow)",
          backdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-sat))",
          WebkitBackdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-sat))",
        }}
      >
        <h1 style={{ marginBottom: "0.6rem" }}>Payment confirmed</h1>
        <p style={{ color: "#a3a3a3", lineHeight: 1.6 }}>
          Thank you. Your profile is now active.
        </p>

        <a
          href="/profile"
          style={{
            marginTop: 20,
            display: "inline-block",
            padding: "12px 20px",
            background: "rgba(255, 255, 255, 0.85)",
            color: "#000000",
            borderRadius: 999,
            fontWeight: 700,
            textDecoration: "none",
            border: "1px solid rgba(255, 255, 255, 0.55)",
            backdropFilter: "blur(var(--glass-blur-soft)) saturate(var(--glass-sat))",
            WebkitBackdropFilter: "blur(var(--glass-blur-soft)) saturate(var(--glass-sat))",
          }}
        >
          Go to my profile
        </a>
      </div>
    </main>
  );
}
