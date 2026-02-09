// app/dashboard/page.tsx

export default function DashboardPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "2rem 1.5rem 4rem",
        background: "#000000",
        color: "#ffffff",
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
          MasseurMatch Dashboard
        </h1>

        <p
          style={{
            maxWidth: 560,
            lineHeight: 1.6,
            fontSize: "0.98rem",
            opacity: 0.9,
          }}
        >
          This dashboard will show booking stats, revenue, and performance
          insights for therapists. It is a placeholder to support deployment
          while we finish Supabase integration, filters, and real analytics.
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
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
              boxShadow: "var(--glass-shadow-soft)",
              backdropFilter: "blur(var(--glass-blur-soft)) saturate(var(--glass-sat))",
              WebkitBackdropFilter: "blur(var(--glass-blur-soft)) saturate(var(--glass-sat))",
            }}
          >
            <h2
              style={{
                fontSize: "0.9rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#a3a3a3",
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
                color: "#a3a3a3",
                marginTop: "0.2rem",
              }}
            >
              Demo bookings recorded
            </p>
          </div>

          <div
            style={{
              borderRadius: "1rem",
              padding: "1rem 1.1rem",
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
              boxShadow: "var(--glass-shadow-soft)",
              backdropFilter: "blur(var(--glass-blur-soft)) saturate(var(--glass-sat))",
              WebkitBackdropFilter: "blur(var(--glass-blur-soft)) saturate(var(--glass-sat))",
            }}
          >
            <h2
              style={{
                fontSize: "0.9rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#a3a3a3",
                marginBottom: "0.4rem",
              }}
            >
              Next Steps
            </h2>
            <ul
              style={{
                fontSize: "0.9rem",
                paddingLeft: "1.1rem",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              <li>Connect Supabase data (bookings, therapists, users).</li>
              <li>Add revenue and conversion cards.</li>
              <li>Create filters by city and plan.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
