import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MasseurMatch - Find Professional Male Massage Therapists",
    template: "%s | MasseurMatch",
  },
  description:
    "Connect with licensed male massage therapists in your area. Professional, inclusive, and therapeutic massage services.",
  keywords: [
    "massage therapist",
    "male massage",
    "therapeutic massage",
    "LGBTQ friendly",
    "professional massage",
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
