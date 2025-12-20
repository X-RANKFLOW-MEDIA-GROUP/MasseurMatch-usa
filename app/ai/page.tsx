import type { Metadata } from "next";
import AiPageClient from "./AiPageClient";

export const metadata: Metadata = {
  title: "AÍ | Automate Smarter with AI",
  description:
    "Automate smarter with AÍ. Book a free call to see how tailored AI workflows accelerate growth.",
};

export default function AiPage() {
  return <AiPageClient />;
}
