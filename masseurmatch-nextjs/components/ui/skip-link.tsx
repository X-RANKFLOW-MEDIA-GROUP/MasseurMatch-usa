"use client";

import Link from "next/link";
import { skipLinkAttrs } from "@/lib/accessibility";

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

export function SkipLink({ href, children }: SkipLinkProps) {
  return (
    <Link
      href={href}
      {...skipLinkAttrs}
    >
      {children}
    </Link>
  );
}

/**
 * Skip to main content component
 * Should be placed at the top of every page for accessibility
 */
export function SkipToMain() {
  return <SkipLink href="#main-content">Skip to main content</SkipLink>;
}
