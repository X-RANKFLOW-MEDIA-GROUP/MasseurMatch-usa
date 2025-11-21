export default function CheckoutErrorPage() {
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>❌ Pagamento cancelado</h1>
      <p>Parece que você cancelou o pagamento ou ocorreu um erro.</p>

      <a
        href="/join"
        style={{
          marginTop: 20,
          display: "inline-block",
          padding: "12px 20px",
          background: "#dc2626",
          color: "white",
          borderRadius: 8,
        }}
      >
        Voltar para seleção de plano
      </a>
    </div>
  );
}
