'use client';

import { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from './ui/card';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from './ui/dialog';
import { cn } from '../lib/utils';
import { legalDocuments, DocumentSlug } from '../lib/legal-data';
import { ContactForm } from './legal/ContactForm';
import { CookieConsent } from './legal/CookieConsent';
import { KnottyBot } from './support/KnottyBot';

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
    slug: 'complaints',
    openContact: true,
    subject: 'Content Complaint / Violation Report',
  },
  'dmca/submit': {
    slug: 'dmca',
    openContact: true,
    subject: 'DMCA Takedown Notice',
  },
  'law-enforcement': {
    slug: 'subpoena',
    openContact: false,
  },
};

export function LegalPage() {
  // Initialize state from URL or default to 'terms'
  const [activeSlug, setActiveSlug] = useState<DocumentSlug>('terms');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [contactOpen, setContactOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState<string>('');

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
          setContactSubject(config.subject || '');
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
          console.warn('Document not found, defaulting to Terms');
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
    let link = document.querySelector<HTMLLinkElement>(
      "link[rel='canonical']",
    );
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', `https://masseurmatch.com/legal/${activeSlug}`);

    trackEvent('view_document', activeSlug);
  }, [activeSlug]);

  const handleNavigation = (slug: DocumentSlug) => {
    setActiveSlug(slug);
    setMobileMenuOpen(false);
    setSearchQuery('');

    // Update URL without reload
    window.history.pushState({}, '', `/legal/${slug}`);
    window.scrollTo(0, 0);
  };

  const handleDownload = () => {
    const doc = legalDocuments.find((d) => d.slug === activeSlug);
    if (!doc) return;

    const element = document.getElementById('legal-content-area');
    const text = element
      ? element.innerText
      : `Legal Document: ${doc.title}`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = `masseurmatch-${activeSlug}.txt`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    trackEvent('download_document', activeSlug);
  };

  const filteredDocuments = legalDocuments.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const activeDocument = legalDocuments.find((d) => d.slug === activeSlug);

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://masseurmatch.com/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Legal',
        item: 'https://masseurmatch.com/legal',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: activeDocument?.title || 'Document',
        item: `https://masseurmatch.com/legal/${activeSlug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased selection:bg-primary/20 selection:text-primary">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Background Glow */}
      <div className="fixed top-0 left-0 right-0 h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background -z-10 pointer-events-none" />

      {/* Header */}
      <header className="border-b border-border/40 sticky top-0 z-30 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => handleNavigation('terms')}
          >
            <div className="bg-primary/10 p-1.5 rounded-md group-hover:bg-primary/20 transition-colors ring-1 ring-white/10">
              <Scale className="w-5 h-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <h1 className="font-bold text-lg tracking-tight leading-none">
                Legal Center
              </h1>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                MasseurMatch
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Dialog open={contactOpen} onOpenChange={setContactOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex h-9 bg-background/50 border-primary/20 hover:bg-primary/10 hover:border-primary/50 transition-all"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] border-primary/20 bg-background/95 backdrop-blur-xl">
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
              className="md:hidden"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col md:flex-row gap-8 relative">
        {/* Sidebar Navigation */}
        <aside
          className={cn(
            'md:w-72 lg:w-80 flex-shrink-0',
            mobileMenuOpen
              ? 'fixed inset-0 z-50 bg-background/95 backdrop-blur-sm p-4 animate-in slide-in-from-left-10 md:relative md:p-0 md:bg-transparent md:z-auto md:animate-none'
              : 'hidden md:block',
          )}
        >
          {mobileMenuOpen && (
            <div className="flex justify-between items-center mb-6 md:hidden">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-lg">Legal Menu</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          )}

          <div className="sticky top-24 h-[calc(100vh-8rem)] flex flex-col">
            {/* Search Bar */}
            <div className="mb-4 relative group">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-muted/30 border-transparent focus:border-primary/30 focus:bg-background transition-all shadow-inner"
              />
            </div>

            <ScrollArea className="flex-1 pr-4 -mr-4">
              <div className="pb-4">
                <div className="flex items-center justify-between px-2 mb-3">
                  <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Documents
                  </h2>
                  <Badge
                    variant="outline"
                    className="text-[10px] h-4 px-1.5 border-primary/20 bg-primary/5 text-primary"
                  >
                    v1.1
                  </Badge>
                </div>

                <div className="space-y-1">
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((doc) => (
                      <Button
                        key={doc.slug}
                        variant={
                          activeSlug === doc.slug ? 'secondary' : 'ghost'
                        }
                        className={cn(
                          'w-full justify-start font-medium h-auto py-2.5 px-3 text-sm whitespace-normal text-left group transition-all border border-transparent',
                          activeSlug === doc.slug
                            ? 'bg-primary/10 text-primary border-primary/20 shadow-[0_0_15px_rgba(139,92,246,0.1)] translate-x-1'
                            : 'text-muted-foreground hover:text-foreground hover:bg-white/5 hover:translate-x-1',
                        )}
                        onClick={() => handleNavigation(doc.slug)}
                      >
                        <div className="flex items-start w-full">
                          <span
                            className={cn(
                              'flex-shrink-0 mr-3 mt-0.5 transition-colors',
                              activeSlug === doc.slug
                                ? 'text-primary drop-shadow-[0_0_3px_rgba(139,92,246,0.5)]'
                                : 'text-muted-foreground group-hover:text-foreground',
                            )}
                          >
                            {doc.icon}
                          </span>
                          <span>{doc.title}</span>
                          {activeSlug === doc.slug && (
                            <ChevronRight className="ml-auto w-3 h-3 opacity-50 text-primary" />
                          )}
                        </div>
                      </Button>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center px-4 border rounded-lg bg-muted/20 border-dashed border-muted-foreground/20">
                      <Search className="w-8 h-8 text-muted-foreground/50 mb-2" />
                      <p className="text-sm font-medium">No documents found</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Try adjusting your search terms.
                      </p>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => setSearchQuery('')}
                        className="mt-2 h-auto p-0 text-primary"
                      >
                        Clear search
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>

            <div className="mt-4 pt-4 border-t border-border/40 md:hidden">
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                onClick={() => {
                  setContactOpen(true);
                  setMobileMenuOpen(false);
                }}
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </div>

            {/* Changelog / Version Info */}
            <div className="hidden md:block mt-4 pt-4 border-t border-border/40 text-xs text-muted-foreground">
              <p className="flex items-center gap-1.5">
                <AlertCircle className="w-3 h-3 text-primary/70" />
                <span>Latest Update: Jan 2025</span>
              </p>
              <p className="mt-1 ml-4 opacity-80">
                v1.1: Added SMS STOP/HELP clause
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {activeDocument ? (
            <Card className="border border-border/40 shadow-2xl shadow-black/20 bg-card/50 backdrop-blur-sm mb-8 overflow-hidden relative group">
              {/* Card Glow Effect */}
              <div className="absolute -inset-px bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <CardHeader className="px-0 md:px-8 pt-0 md:pt-8 pb-6 border-b border-border/40 bg-muted/10 relative z-10">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex flex-col space-y-2">
                    <CardTitle className="text-2xl md:text-3xl font-bold leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-purple-200">
                      {activeDocument.title}
                    </CardTitle>
                    <CardDescription className="text-sm flex items-center gap-2 text-muted-foreground">
                      <span>Last updated: {activeDocument.lastUpdated}</span>
                      <span className="hidden md:inline">•</span>
                      <span className="hidden md:inline text-primary">
                        Official Policy
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                      className="h-8 text-xs bg-background/50 border-border/50 hover:bg-background hover:border-primary/30"
                    >
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                      Download TXT
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent
                className="px-0 md:px-8 py-8 relative z-10"
                id="legal-content-area"
              >
                <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-a:text-primary hover:prose-a:underline prose-headings:text-foreground/90 prose-p:text-muted-foreground prose-strong:text-foreground">
                  {activeDocument.content}
                </div>
              </CardContent>

              <CardFooter className="px-0 md:px-8 py-6 border-t border-border/40 bg-muted/5 text-xs text-muted-foreground flex flex-col md:flex-row justify-between gap-4 relative z-10">
                <p>Reference ID: {activeDocument.slug.toUpperCase()}-2025-V1</p>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-primary transition-colors"
                >
                  Back to top
                </a>
              </CardFooter>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-border/40 rounded-lg bg-card/30 backdrop-blur-sm border-dashed">
              <Shield className="w-16 h-16 text-muted-foreground/20 mb-4" />
              <h3 className="text-lg font-semibold">Document Not Found</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                The legal document you requested could not be found. It may have
                been moved or renamed.
              </p>
              <Button onClick={() => handleNavigation('terms')} variant="secondary">
                Return to Terms &amp; Conditions
              </Button>
            </div>
          )}

          {/* Contact Section */}
          <div className="mt-12 md:px-0">
            <div className="bg-gradient-to-br from-muted/30 to-background border border-border/40 rounded-xl p-6 md:p-10 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-grid-slate-900/[0.02] bg-[size:20px_20px]" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10">
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  Have specific questions?
                </h3>
                <p className="text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
                  Our support team is available to assist with compliance
                  inquiries, DMCA reports, and account issues.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button
                    size="lg"
                    onClick={() => setContactOpen(true)}
                    className="w-full sm:w-auto shadow-lg shadow-primary/20 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                  >
                    Open Support Ticket
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="w-full sm:w-auto bg-background/50 border-border/50 hover:bg-background hover:border-primary/30"
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

      {/* Footer with Fixed Disclaimer */}
      <footer className="border-t border-border/40 py-12 mt-auto bg-muted/10 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-muted-foreground" />
                <span className="font-semibold tracking-tight text-foreground">
                  MasseurMatch Legal Center
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                Dedicated to maintaining a safe, compliant, and professional
                advertising platform. We operate in full compliance with
                applicable US laws including FOSTA-SESTA.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-4 text-foreground">
                Quick Access
              </h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li>
                  <button
                    type="button"
                    onClick={() => handleNavigation('terms')}
                    className="hover:text-primary hover:underline transition-colors"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleNavigation('privacy')}
                    className="hover:text-primary hover:underline transition-colors"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleNavigation('content-guidelines')}
                    className="hover:text-primary hover:underline transition-colors"
                  >
                    Content Guidelines
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleNavigation('dmca')}
                    className="hover:text-primary hover:underline transition-colors"
                  >
                    DMCA Policy
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-4 text-foreground">
                Contact
              </h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li>
                  <a
                    href="mailto:support@masseurmatch.com"
                    className="hover:text-primary hover:underline transition-colors"
                  >
                    Support Team
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:legal@masseurmatch.com"
                    className="hover:text-primary hover:underline transition-colors"
                  >
                    Legal Inquiries
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:billing@masseurmatch.com"
                    className="hover:text-primary hover:underline transition-colors"
                  >
                    Billing Help
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="mb-8 opacity-30" />

          <div className="space-y-6">
            {/* Fixed Disclaimer Block */}
            <div className="bg-card/30 border border-border/40 rounded-lg p-4 md:p-6 text-sm text-muted-foreground shadow-sm backdrop-blur-sm">
              <p className="font-medium text-foreground mb-2">
                Platform Disclaimer
              </p>
              <p className="leading-relaxed">
                MasseurMatch is an advertising-only directory. We do not
                arrange, facilitate, negotiate, process, or manage bookings,
                payments, appointments, or service transactions of any kind. We
                do not host or permit sexual content, escorting, solicitation,
                or explicit services. All advertisers operate independently and
                are fully responsible for their own conduct and compliance with
                the law.
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
              <div className="space-y-1">
                <p>&copy; {new Date().getFullYear()} MasseurMatch.</p>
                <p>
                  Advertising directory only. No bookings. No escorting. No
                  sexual content.
                </p>
                <p>Not affiliated with MasseurFinder, RentMasseur, or RentMen.</p>
              </div>
              <div className="flex items-center gap-6">
                <span>v1.1.0 (Jan 2025)</span>
                <a href="#" className="hover:text-primary transition-colors">
                  Sitemap
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
