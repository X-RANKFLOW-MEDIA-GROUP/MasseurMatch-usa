import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MasseurMatch - Gay Therapist Directory with Ktonny AI",
    template: "%s | MasseurMatch",
  },
  description:
    "Discover LGBTQ+ affirming massage and bodywork professionals with Ktonny AI. Browse verified gay therapists, compare specialties, and book with confidence.",
  keywords: [
    "gay therapist directory",
    "LGBTQ affirming massage",
    "male massage therapist",
    "LGBTQ+ wellness",
    "gay massage therapist",
    "Ktonny AI",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-black text-white font-sans">
        {children}
      </body>
    </html>
  );
}
