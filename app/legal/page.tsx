import { Metadata } from "next";
import Link from "next/link";
import { FileText, Shield, Cookie, Users, Award, Heart, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Legal | MasseurMatch",
  description: "Access all legal documents and policies for MasseurMatch.",
};

const legalPages = [
  {
    href: "/terms",
    icon: FileText,
    title: "Terms of Service",
    desc: "Rules and guidelines for using our platform",
  },
  {
    href: "/privacy-policy",
    icon: Shield,
    title: "Privacy Policy",
    desc: "How we collect and protect your data",
  },
  {
    href: "/cookie-policy",
    icon: Cookie,
    title: "Cookie Policy",
    desc: "Our use of cookies and tracking technologies",
  },
  {
    href: "/community-guidelines",
    icon: Users,
    title: "Community Guidelines",
    desc: "Standards for behavior on our platform",
  },
  {
    href: "/professional-standards",
    icon: Award,
    title: "Professional Standards",
    desc: "Requirements for massage therapists",
  },
  {
    href: "/trust",
    icon: Heart,
    title: "Trust & Safety",
    desc: "How we keep our community safe",
  },
  {
    href: "/anti-trafficking",
    icon: AlertTriangle,
    title: "Anti-Trafficking Policy",
    desc: "Our commitment to preventing exploitation",
  },
];

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/5">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            MasseurMatch
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-bold text-white mb-4">Legal</h1>
        <p className="text-slate-400 mb-8">Access all our legal documents and policies</p>

        <div className="space-y-4">
          {legalPages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors"
            >
              <div className="p-3 rounded-xl bg-violet-600/20">
                <page.icon className="h-6 w-6 text-violet-400" />
              </div>
              <div>
                <h2 className="font-semibold text-white">{page.title}</h2>
                <p className="text-sm text-slate-400">{page.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center text-slate-400">
          <p>Questions? Contact legal@masseurmatch.com</p>
        </div>
      </main>
    </div>
  );
}
