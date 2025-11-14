// app/dashboard/page.tsx

export default function DashboardPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "2rem 1.5rem 4rem",
        background:
          "radial-gradient(circle at top, #020617 0, #020014 45%, #000 100%)",
        color: "#f9fafb",
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif',
      }}
    >
      <section
        style={{
          maxWidth: "960px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            marginBottom: "0.75rem",
          }}
        >
          Dashboard do MasseurMatch
        </h1>

        <p
          style={{
            maxWidth: 560,
            lineHeight: 1.6,
            fontSize: "0.98rem",
            opacity: 0.9,
          }}
        >
          Aqui você poderá acompanhar estatísticas, reservas e performance dos
          profissionais. Esta é apenas uma versão placeholder para permitir o
          deploy na Vercel. Depois conectamos tudo com Supabase, filtros e
          gráficos reais.
        </p>

        <div
          style={{
            marginTop: "1.75rem",
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          <div
            style={{
              borderRadius: "1rem",
              padding: "1rem 1.1rem",
              background:
                "radial-gradient(circle at top left, #4c1d95, #020617)",
              border: "1px solid rgba(244,114,182,0.5)",
              boxShadow: "0 14px 32px rgba(15,23,42,1)",
            }}
          >
            <h2
              style={{
                fontSize: "0.9rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#f472b6",
                marginBottom: "0.4rem",
              }}
            >
              Quick Stat
            </h2>
            <p
              style={{
                fontSize: "1.6rem",
                fontWeight: 700,
                margin: 0,
              }}
            >
              0
            </p>
            <p
              style={{
                fontSize: "0.85rem",
                color: "#e5e7eb",
                marginTop: "0.2rem",
              }}
            >
              Bookings registrados (demo)
            </p>
          </div>

          <div
            style={{
              borderRadius: "1rem",
              padding: "1rem 1.1rem",
              background:
                "radial-gradient(circle at top left, #0369a1, #020617)",
              border: "1px solid rgba(59,130,246,0.6)",
              boxShadow: "0 14px 32px rgba(15,23,42,1)",
            }}
          >
            <h2
              style={{
                fontSize: "0.9rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#7dd3fc",
                marginBottom: "0.4rem",
              }}
            >
              Próximos passos
            </h2>
            <ul
              style={{
                fontSize: "0.9rem",
                paddingLeft: "1.1rem",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              <li>Conectar com Supabase (reservas, therapists, usuários).</li>
              <li>Adicionar cards com faturamento e conversões.</li>
              <li>Criar filtros por cidade e plano.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
