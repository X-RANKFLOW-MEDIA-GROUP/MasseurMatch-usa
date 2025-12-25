import { OnboardingFlowIntegrated } from "@/components/onboarding/OnboardingFlowIntegrated";

export const metadata = {
  title: "Onboarding de Terapeutas | MasseurMatch",
  description: "Fluxo guiado para criar um perfil completo: planos, pagamento, verificação, perfis, moderação e aprovação.",
};

export default function OnboardingPage() {
  return <OnboardingFlowIntegrated />;
}
