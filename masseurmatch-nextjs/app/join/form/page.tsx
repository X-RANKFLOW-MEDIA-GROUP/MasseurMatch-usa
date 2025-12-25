// app/join/form/page.tsx

export default function JoinFormPage() {
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
          Esta é uma página placeholder apenas para permitir o deploy na Vercel.
          Depois conectaremos ela ao componente completo de cadastro (JoinForm),
          Supabase e fluxo de onboarding.
        </p>

        <div
          style={{
            marginTop: "1.5rem",
            padding: "1.2rem",
            background: "rgba(15,23,42,0.9)",
            borderRadius: "0.8rem",
            border: "1px solid rgba(148,163,184,0.4)",
          }}
        >
          <p style={{ opacity: 0.8, margin: 0 }}>
            🚀 Em breve: Formulário profissional com múltiplas seções e upload
            de fotos.
          </p>
        </div>
      </section>
    </main>
  );
}
