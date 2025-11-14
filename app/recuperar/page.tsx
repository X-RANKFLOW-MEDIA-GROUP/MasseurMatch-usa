// app/recuperar/page.tsx

export default function RecuperarPage() {
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
          border: "1px solid rgba(56,189,248,0.6)",
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
          Recuperar Acesso
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
          Esta é uma página temporária para recuperação de conta. Em breve,
          aqui você poderá redefinir sua senha ou recuperar o acesso ao seu
          perfil de terapeuta no MasseurMatch.
        </p>
      </section>
    </main>
  );
}
