// app/pending/page.tsx

export default function PendingPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "2rem 1.25rem",
        background:
          "radial-gradient(circle at top, #020617 0, #020014 45%, #000 100%)",
        color: "#f9fafb",
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif',
      }}
    >
      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background:
            "radial-gradient(circle at top left, #1e1b4b, #020617 80%)",
          padding: "1.75rem 1.5rem",
          borderRadius: "1rem",
          border: "1px solid rgba(244, 114, 182, 0.45)",
          boxShadow: "0 22px 45px rgba(0,0,0,0.6)",
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
          Seu pagamento está em análise ou pendente de confirmação. Assim que o
          status for atualizado, você poderá acessar todos os recursos premium
          do MasseurMatch.
        </p>
      </section>
    </main>
  );
}
