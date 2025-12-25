import styles from "./page.module.css";

const plans = [
  {
    name: "Free",
    price: "R$0/mês",
    cta: "Começar Grátis",
    microcopy: "Perfil ativo após ID + Sightengine + aprovação admin.",
    bullets: [
      "Perfil público ativo após verificação (ID + moderação automática + aprovação admin)",
      "Serviços e tarifas visíveis",
      "1 foto aprovada",
      "Listagem padrão na busca",
    ],
  },
  {
    name: "Standard",
    price: "R$29/mês",
    cta: "Assinar Standard",
    microcopy: "Ranking melhor nas buscas + SEO extra.",
    bullets: [
      "Tudo do Free, com 4 fotos aprovadas",
      "FAQ completo e Schema.org na página",
      "Melhor posição na busca",
    ],
  },
  {
    name: "Pro",
    price: "R$59/mês – Trial de 7 dias",
    cta: "Testar Pro por 7 dias",
    microcopy: "Cartão obrigatório. Cancele antes de X dias de trial.",
    bullets: [
      "Tudo do Standard, 8 fotos e Spike Insights básico",
      "Trial de 7 dias com cobrança somente após o período",
      "Destaque maior na busca",
    ],
  },
  {
    name: "Elite",
    price: "R$119/mês – Trial de 7 dias",
    cta: "Testar Elite por 7 dias",
    microcopy: "Cartão obrigatório. Cancele antes de X dias de trial.",
    bullets: [
      "Tudo do Pro, 12 fotos e Spike Predictor completo",
      "Topo do inventário com supply limitado por cidade",
      "Exposição prioritária e insights avançados",
    ],
  },
];

const timeline = [
  { title: "Planos", description: "Mostre as quatro opções com fotos, limites de mídia, SEO/ranking e CTAs específicos." },
  { title: "Signup", description: "Cadastro rápido com e-mail, telefone E.164, senha e aceite de termos; cria user/profile pendente." },
  { title: "Escolha de plano", description: "Free segue para ID; pagos exigem Stripe card + subscription." },
  { title: "Pagamento (Stripe)", description: "SetupIntent + assinatura (trial para Pro/Elite) antes do avanço." },
  { title: "ID Verification", description: "Stripe Identity obrigatório para qualquer publicação; bloqueia CTAs públicos e envio ao admin." },
  { title: "Montar perfil", description: "Campos básicos + rates + horários, com Sightengine rodando bio/textos." },
  { title: "Upload + moderação", description: "Fotos são moderadas automaticamente; mínimo por plano é obrigatório." },
  { title: "Enviar para admin", description: "Checklist de identidade, moderação e fotos/fields habilita botão." },
  { title: "Admin aprova", description: "Admin Status passa a approved, publication_status → public e o anúncio entra no ar." },
];

const stageTable = [
  {
    stage: "needs_plan",
    output: "Tela de planos com CTAs focando na escolha e diferenciação.",
  },
  {
    stage: "needs_payment",
    output: "Checkout Stripe com cartão obrigatório (Free pula).",
  },
  {
    stage: "needs_identity",
    output: "Stripe Identity com aviso “verificação obrigatória para publicar”.",
  },
  {
    stage: "build_profile",
    output: "Formulário guiado + regras de rates (33% por minuto) + horas/serviços/setups.",
  },
  {
    stage: "upload_photos",
    output: "Upload de fotos com contagem por plano e lib Sightengine.",
  },
  {
    stage: "fix_moderation",
    output: "Aviso “texto/fotos reprovados” com botão para corrigir e reenviar.",
  },
  {
    stage: "submit_admin",
    output: "Checklist final e botão “Enviar para aprovação” liberado apenas com identity_verified + auto_passed + foto aprovada + rates válidas.",
  },
  {
    stage: "waiting_admin",
    output: "Status “Em revisão” com possibilidade limitada de edição.",
  },
  {
    stage: "live",
    output: "Página pública com JSON-LD, indexação e CTAs Call/Text ativas.",
  },
  {
    stage: "blocked",
    output: "Mensagem com motivo e próximos passos (corrigir ou suporte).",
  },
];

const validationChecklist = [
  "Identity verification: users.identity_status must be verified.",
  "Sightengine auto_moderation must be auto_passed (flag/block stalls onboarding).",
  "Profile fields: display name, city/state, phone (E.164), languages ≥1, services ≥1, setups ≥1, hours filled.",
  "Rates: incall/outcall as applicable, 33% price/minute max, at least one rate per enabled context.",
  "Media: at least one media_asset with status=approved (per-plan limits enforced).",
  "Paid plans: subscription status must be trialing or active before publish.",
];

export const metadata = {
  title: "Onboarding de Terapeutas | MasseurMatch",
  description: "Fluxo guiado para criar um perfil completo: planos, pagamento, verificação, perfis, moderação e aprovação.",
};

export default function OnboardingPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.tagline}>Onboarding completo para terapeutas</p>
        <h1>Fluxo guiado: do plano à publicação</h1>
        <p>
          Cada etapa bloqueia a próxima até que identidades, pagamento, rates, fotos e moderação estejam aprovados.
          Mostre um <strong>progress bar</strong> (“Conta → Pagamento → ID → Perfil”).
        </p>
        <p className={styles.notice}>
          Microcopy pronta: “Verificação de identidade obrigatória para publicar”, “Sua foto/texto não passou na moderação”,
          “Seu anúncio está em revisão” e “Cartão obrigatório para planos pagos com trial”.
        </p>
      </header>

      <section>
        <h2>Diferenciais de cada plano</h2>
        <div className={styles.planGrid}>
          {plans.map((plan) => (
            <article key={plan.name} className={styles.planCard}>
              <header>
                <h3>{plan.name}</h3>
                <p className={styles.planPrice}>{plan.price}</p>
                <p className={styles.planMicro}>{plan.microcopy}</p>
              </header>
              <ul className={styles.planList}>
                {plan.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <button className={styles.planButton}>{plan.cta}</button>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.timelineSection}>
        <h2>Linhas do tempo e bloqueios</h2>
        <p>O fluxo completo (planos → signup → pagamentos → ID → perfil → upload → admin → live).</p>
        <div className={styles.timelineGrid}>
          {timeline.map((step) => (
            <div key={step.title} className={styles.timelineCard}>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Estágios de onboarding</h2>
        <p>Use `profiles.onboarding_stage` para habilitar telas e validar ações.</p>
        <div className={styles.stageGrid}>
          {stageTable.map((stage) => (
            <div key={stage.stage} className={styles.stageCard}>
              <strong>{stage.stage}</strong>
              <p>{stage.output}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.checklistSection}>
        <h2>Checklist de validação antes de enviar para admin</h2>
        <ol>
          {validationChecklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
        <p className={styles.footerNote}>
          Se qualquer item falhar, o endpoint `submit_for_admin_review` deve retornar 400 com a lista de campos faltantes.
        </p>
      </section>
    </div>
  );
}
