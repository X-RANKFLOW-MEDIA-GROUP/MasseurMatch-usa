import type { Metadata } from "next";
import AiLanding from "@/src/components/AiLanding";

export const metadata: Metadata = {
  title: "Lando AI | Automate Smarter. Grow Faster.",
  description: "AI automation partner for modern businesses. Build, launch, and scale AI-powered workflows with Lando.",
};

export default function AIPage() {
  return <AiLanding />;
}
