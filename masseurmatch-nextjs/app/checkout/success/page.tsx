export default function SuccessPage() {
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>🎉 Pagamento confirmado!</h1>
      <p>Obrigado! Seu perfil foi ativado com sucesso.</p>

      <a
        href="/profile"
        style={{
          marginTop: 20,
          display: "inline-block",
          padding: "12px 20px",
          background: "#4f46e5",
          color: "white",
          borderRadius: 8,
        }}
      >
        Ir para meu perfil
      </a>
    </div>
  );
}
