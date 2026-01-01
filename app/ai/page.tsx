import type { Metadata } from "next";
import "./ai.css";
import AiClient from "./AiClient";

export const metadata: Metadata = {
  title: "AI Automation Partner | MasseurMatch",
  description:
    "A new AI landing experience showcasing automation strategy, secure copilots, and scalable workflows built for modern teams.",
};

export default function AIPage() {
  return <AiClient />;
}
