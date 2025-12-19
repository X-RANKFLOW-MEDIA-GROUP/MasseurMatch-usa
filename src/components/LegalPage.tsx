"use client";

import { useState, useEffect } from "react";
import {
  Scale,
  Menu,
  X,
  Search,
  Mail,
  Download,
  AlertCircle,
  Shield,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./ui/card";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "./ui/dialog";
import { cn } from "../lib/utils";
import { legalDocuments, DocumentSlug } from "../lib/legal-data";
import { ContactForm } from "./legal/ContactForm";
import { CookieConsent } from "./legal/CookieConsent";
import { KnottyBot } from "./support/KnottyBot";

// 👉 importa o CSS normal
import "./LegalPage.css";

// Mock Analytics
const trackEvent = (action: string, label: string) => {
  // In production, replace with real analytics client
  console.log(`[Analytics] ${action}: ${label}`);
};

// Special routes mapping
const SPECIAL_ROUTES: Record<
  string,
  { slug: DocumentSlug; subject?: string; openContact?: boolean }
> = {
  report: {
    slug: "complaints",
    openContact: true,
    subject: "Content Complaint / Violation Report",
  },
  "dmca/submit": {
    slug: "dmca",
    openContact: true,
    subject: "DMCA Takedown Notice",
  },
  "law-enforcement": {
    slug: "subpoena",
    openContact: false,
  },
};

export function LegalPage() {
  // Initialize state from URL or default to 'terms'
  const [activeSlug, setActiveSlug] = useState<DocumentSlug>("terms");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [contactOpen, setContactOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState<string>("");

  // Handle "routing" and metadata based on URL
  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/legal\/([a-z0-9-/]+)/);

    if (match && match[1]) {
      const routeKey = match[1];

      // Check special routes first
      if (SPECIAL_ROUTES[routeKey]) {
        const config = SPECIAL_ROUTES[routeKey];
        setActiveSlug(config.slug);

        if (config.openContact) {
          setContactSubject(config.subject || "");
          setContactOpen(true);
        }
      } else {
        // Check regular documents
        const doc = legalDocuments.find(
          (d) => d.slug === (routeKey as DocumentSlug),
        );

        if (doc) {
          setActiveSlug(doc.slug);
        } else {
          // 404 fallback logic
          console.warn("Document not found, defaulting to Terms");
        }
      }
    }
  }, []);

  // Update page title and canonical when activeSlug changes
  useEffect(() => {
    const doc = legalDocuments.find((d) => d.slug === activeSlug);
    if (!doc) return;

    document.title = `${doc.title} | Legal Center - MasseurMatch`;

    // Canonical link
    let link = document.querySelector<HTMLLinkElement>("link[rel='canonical']");
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", `https://masseurmatch.com/legal/${activeSlug}`);

    trackEvent("view_document", activeSlug);
  }, [activeSlug]);

  const handleNavigation = (slug: DocumentSlug) => {
    setActiveSlug(slug);
    setMobileMenuOpen(false);
    setSearchQuery("");

    // Update URL without reload
    window.history.pushState({}, "", `/legal/${slug}`);
    window.scrollTo(0, 0);
  };

  const handleDownload = () => {
    const doc = legalDocuments.find((d) => d.slug === activeSlug);
    if (!doc) return;

    const element = document.getElementById("legal-content-area");
    const text = element
      ? element.innerText
      : `Legal Document: ${doc.title}`;

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `masseurmatch-${activeSlug}.txt`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    trackEvent("download_document", activeSlug);
  };

  const filteredDocuments = legalDocuments.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const activeDocument = legalDocuments.find((d) => d.slug === activeSlug);

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://masseurmatch.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Legal",
        item: "https://masseurmatch.com/legal",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: activeDocument?.title || "Document",
        item: `https://masseurmatch.com/legal/${activeSlug}`,
      },
    ],
  };

  return (
    <div className="legal-page-root">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Background Glow */}
      <div className="legal-bg-glow" />

      {/* Header */}
      <header className="legal-header">
        <div className="legal-container legal-header-inner">
          <div
            className="legal-brand"
            onClick={() => handleNavigation("terms")}
          >
            <div className="legal-brand-icon-wrapper">
              <Scale className="legal-brand-icon" />
            </div>
            <div className="legal-brand-text">
              <h1>Legal Center</h1>
              <span>MasseurMatch</span>
            </div>
          </div>

          <div className="legal-header-actions">
            <Dialog open={contactOpen} onOpenChange={setContactOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="legal-contact-button-desktop"
                >
                  <Mail className="legal-contact-icon" />
                  Contact Support
                </Button>
              </DialogTrigger>
              <DialogContent className="legal-contact-dialog">
                <DialogHeader className="sr-only">
                  <DialogTitle>Contact Support</DialogTitle>
                  <DialogDescription>
                    Use the form below to send a message to our support team.
                  </DialogDescription>
                </DialogHeader>
                <ContactForm defaultSubject={contactSubject} />
              </DialogContent>
            </Dialog>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="legal-mobile-menu-button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              {mobileMenuOpen ? (
                <X className="legal-icon-md" />
              ) : (
                <Menu className="legal-icon-md" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="legal-main-layout legal-container">
        {/* Sidebar Navigation */}
        <aside
          className={cn(
            "legal-sidebar",
            mobileMenuOpen && "legal-sidebar--mobile-open",
          )}
        >
          {mobileMenuOpen && (
            <div className="legal-sidebar-mobile-header">
              <div className="legal-sidebar-mobile-title">
                <Scale className="legal-icon-md primary" />
                <h2>Legal Menu</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="legal-icon-md" />
              </Button>
            </div>
          )}

          <div className="legal-sidebar-inner">
            {/* Search Bar */}
            <div className="legal-search-wrapper">
              <Search className="legal-search-icon" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="legal-search-input"
              />
            </div>

            <ScrollArea className="legal-sidebar-scroll">
              <div className="legal-sidebar-docs">
                <div className="legal-sidebar-docs-header">
                  <h2>Documents</h2>
                  <Badge variant="outline" className="legal-version-badge">
                    v1.1
                  </Badge>
                </div>

                <div className="legal-doc-list">
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((doc) => (
                      <Button
                        key={doc.slug}
                        variant={
                          activeSlug === doc.slug ? "secondary" : "ghost"
                        }
                        className={cn(
                          "legal-doc-button",
                          activeSlug === doc.slug && "legal-doc-button--active",
                        )}
                        onClick={() => handleNavigation(doc.slug)}
                      >
                        <div className="legal-doc-button-inner">
                          <span
                            className={cn(
                              "legal-doc-icon",
                              activeSlug === doc.slug &&
                                "legal-doc-icon--active",
                            )}
                          >
                            {doc.icon}
                          </span>
                          <span className="legal-doc-title">{doc.title}</span>
                          {activeSlug === doc.slug && (
                            <ChevronRight className="legal-doc-chevron" />
                          )}
                        </div>
                      </Button>
                    ))
                  ) : (
                    <div className="legal-no-docs">
                      <Search className="legal-no-docs-icon" />
                      <p className="legal-no-docs-title">
                        No documents found
                      </p>
                      <p className="legal-no-docs-text">
                        Try adjusting your search terms.
                      </p>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => setSearchQuery("")}
                        className="legal-no-docs-clear"
                      >
                        Clear search
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>

            <div className="legal-sidebar-mobile-contact">
              <Button
                className="legal-sidebar-mobile-contact-button"
                onClick={() => {
                  setContactOpen(true);
                  setMobileMenuOpen(false);
                }}
              >
                <Mail className="legal-icon-sm" />
                Contact Support
              </Button>
            </div>

            {/* Changelog / Version Info */}
            <div className="legal-changelog">
              <p className="legal-changelog-row">
                <AlertCircle className="legal-icon-xs primary" />
                <span>Latest Update: Jan 2025</span>
              </p>
              <p className="legal-changelog-sub">
                v1.1: Added SMS STOP/HELP clause
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="legal-main-content">
          {activeDocument ? (
            <Card className="legal-card">
              <div className="legal-card-glow" />

              <CardHeader className="legal-card-header">
                <div className="legal-card-header-inner">
                  <div className="legal-card-header-text">
                    <CardTitle className="legal-card-title">
                      {activeDocument.title}
                    </CardTitle>
                    <CardDescription className="legal-card-description">
                      <span>Last updated: {activeDocument.lastUpdated}</span>
                      <span className="separator-dot">•</span>
                      <span className="legal-official-policy">
                        Official Policy
                      </span>
                    </CardDescription>
                  </div>
                  <div className="legal-card-header-actions">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                      className="legal-download-button"
                    >
                      <Download className="legal-icon-xs" />
                      Download TXT
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent
                className="legal-card-content"
                id="legal-content-area"
              >
                <div className="legal-content">
                  {activeDocument.content}
                </div>
              </CardContent>

              <CardFooter className="legal-card-footer">
                <p className="legal-reference-id">
                  Reference ID: {activeDocument.slug.toUpperCase()}-2025-V1
                </p>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="legal-back-to-top"
                >
                  Back to top
                </a>
              </CardFooter>
            </Card>
          ) : (
            <div className="legal-not-found">
              <Shield className="legal-not-found-icon" />
              <h3 className="legal-not-found-title">Document Not Found</h3>
              <p className="legal-not-found-text">
                The legal document you requested could not be found. It may have
                been moved or renamed.
              </p>
              <Button onClick={() => handleNavigation("terms")} variant="secondary">
                Return to Terms &amp; Conditions
              </Button>
            </div>
          )}

          {/* Contact Section */}
          <div className="legal-contact-section">
            <div className="legal-contact-card">
              <div className="legal-contact-card-overlay" />
              <div className="legal-contact-card-inner">
                <h3 className="legal-contact-title">Have specific questions?</h3>
                <p className="legal-contact-text">
                  Our support team is available to assist with compliance
                  inquiries, DMCA reports, and account issues.
                </p>
                <div className="legal-contact-actions">
                  <Button
                    size="lg"
                    onClick={() => setContactOpen(true)}
                    className="legal-contact-primary"
                  >
                    Open Support Ticket
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="legal-contact-secondary"
                  >
                    <a href="mailto:legal@masseurmatch.com">Email Legal Team</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Cookie Consent */}
      <CookieConsent />

      {/* Knotty AI Assistant */}
      <KnottyBot />

    </div>
  );
}
