// app/checkout/page.tsx

export default function CheckoutPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "2rem 1.5rem",
        background:
          "radial-gradient(circle at top, #020617 0, #020014 45%, #000 100%)",
        color: "#f9fafb",
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif',
      }}
    >
      <h1
        style={{
          fontSize: "1.8rem",
          fontWeight: 700,
          marginBottom: "0.75rem",
        }}
      >
        Checkout
      </h1>

      <p style={{ maxWidth: 520, lineHeight: 1.6, fontSize: "0.95rem" }}>
        Página de checkout do MasseurMatch. <br />
        Em breve, aqui ficará a integração completa com o Stripe/backend.
      </p>
    </main>
  );
}
