import React from 'react';
import {
  Shield,
  FileText,
  Cookie,
  AlertTriangle,
  Copyright,
  Ban,
  ListChecks,
  AlertCircle,
  ShieldOff,
  Users,
  Megaphone,
  Accessibility,
  Camera,
  LayoutTemplate,
  HelpCircle,
  Briefcase,
  Gavel,
} from 'lucide-react';

export type DocumentSlug = 
  | 'terms' 
  | 'subpoena' 
  | 'phishing-scam' 
  | 'dmca' 
  | 'repeat-infringer' 
  | 'cookie-policy' 
  | 'community-guidelines' 
  | 'complaints' 
  | 'anti-trafficking' 
  | 'non-discrimination' 
  | 'advertisement' 
  | 'accessibility' 
  | 'photo-rules' 
  | 'ad-rules' 
  | 'privacy-policy' 
  | 'faq' 
  | 'advertiser-policy'
  | 'professional-standards';

export interface LegalDocument {
  slug: DocumentSlug;
  title: string;
  icon: React.ReactNode;
  lastUpdated: string;
  content: React.ReactNode;
}

const PlatformNature = () => (
  <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground mb-6 border">
    <h4 className="font-semibold text-foreground mb-1">Nature of the Service</h4>
    <p>
      MasseurMatch is a discovery-only directory. We do not arrange, facilitate, negotiate, process, or manage bookings, payments, appointments, or service transactions, and we do not hold funds. We do not offer in-platform messaging, SMS, reviews, or ratings, and we do not verify identities or professional licenses. We do not host or permit sexual content, escorting, solicitation, or explicit services. All advertisers operate independently and are fully responsible for their own conduct and compliance with the law.
    </p>
  </div>
);

const ContactInfo = () => (
  <div className="mt-8 pt-6 border-t">
    <h3 className="text-lg font-semibold text-foreground mb-3">Contact Information</h3>
    <div className="grid gap-2 text-muted-foreground">
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
        <span className="font-medium text-foreground">Legal:</span>
        <a href="mailto:legal@masseurmatch.com" className="hover:text-primary hover:underline">legal@masseurmatch.com</a>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
        <span className="font-medium text-foreground">Billing:</span>
        <a href="mailto:billing@masseurmatch.com" className="hover:text-primary hover:underline">billing@masseurmatch.com</a>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
        <span className="font-medium text-foreground">Support:</span>
        <a href="mailto:support@masseurmatch.com" className="hover:text-primary hover:underline">support@masseurmatch.com</a>
      </div>
    </div>
  </div>
);

export const legalDocuments: LegalDocument[] = [
  {
    slug: 'terms',
    title: 'Terms & Conditions',
    icon: <FileText className="w-4 h-4 mr-2" />,
    lastUpdated: 'January 2025',
    content: (
      <div className="space-y-6">
        <PlatformNature />
        <div className="bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800 p-4 rounded-lg text-sm mb-6">
          <p className="font-medium text-violet-900 dark:text-violet-200">
            MasseurMatch is not affiliated, endorsed, sponsored, or associated with MasseurFinder, RentMasseur, RentMen, or any similar directory. Similarities in descriptive industry terms (such as “masseur”) are non-exclusive and do not imply any connection between the platforms.
          </p>
        </div>
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">1. Acceptance of Terms</h3>
          <p className="text-muted-foreground leading-relaxed">
            By accessing or using the Platform you agree to these Terms. If you do not agree, discontinue use immediately.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">2. Nature of the Platform</h3>
          <p className="text-muted-foreground leading-relaxed mb-2">
            MasseurMatch is a discovery-only directory. We do not arrange, facilitate, negotiate, process, or manage bookings, payments, appointments, or service transactions of any kind. We do not host or permit sexual content, escorting, solicitation, or explicit services.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            <strong>Independent Contractor / No Agency:</strong> Advertisers are independent self-employed individuals. No employment, agency, partnership, or joint venture relationship exists between MasseurMatch and any advertiser.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">3. Accounts and Security</h3>
          <p className="text-muted-foreground leading-relaxed mb-2">
            Keep credentials confidential. You are responsible for activity on your account.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">4. Advertiser Standards</h3>
          <p className="text-muted-foreground leading-relaxed mb-2">
            <strong>No Identity or License Verification:</strong> MasseurMatch does not conduct background checks, identity verification, license validation, or in-person verification of advertisers.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-2">
            <strong>Local-Law Compliance:</strong> Advertisers are solely responsible for compliance with all local, state, and federal laws relating to massage practice, licensing, zoning, advertising, and professional regulations.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            <strong>Zero-Tolerance Anti-Trafficking:</strong> MasseurMatch enforces a strict zero-tolerance policy against trafficking, exploitation, coercion, or illegal services. Listings that suggest, imply, or facilitate illegal activity will be removed immediately and may be reported to authorities.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">5. Payments and Transactions</h3>
          <p className="text-muted-foreground leading-relaxed">
            We do not process payments, bookings, or subscriptions on the Platform, and we do not hold funds. All contact and transactions happen off-platform between users and advertisers. If paid advertising plans are introduced later, we will publish updated terms and pricing before they take effect.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">6. Prohibited Content</h3>
          <p className="text-muted-foreground leading-relaxed">
            Prohibited: nudity or explicit sexual content; escorting or sexual services; illegal services; trafficking or exploitation; hate speech/harassment; misleading claims; impersonation; health claims; third‑party IP infringement; deceptive pricing; code words implying sexual services.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">7. No Duty to Monitor</h3>
          <p className="text-muted-foreground leading-relaxed">
            MasseurMatch reserves the right, but has no obligation, to monitor user content. Any monitoring is conducted at our discretion and not as a legal duty or service guarantee.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">8. Limitation of Liability</h3>
          <p className="text-muted-foreground leading-relaxed mb-2">
            <strong>Liability Shield:</strong> MasseurMatch is not responsible for the quality, safety, legality, availability, or outcome of services provided by advertisers. All interactions that occur outside the Platform are at the sole risk of the user. MasseurMatch does not supervise, monitor, or endorse any advertiser.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            <strong>No Performance Guarantees:</strong> MasseurMatch does not guarantee visibility, ranking, customer volume, leads, or earnings. Advertising performance varies and is outside our control.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">9. Complaints</h3>
          <p className="text-muted-foreground leading-relaxed">
            Complaints are reviewed within 3–7 business days. MasseurMatch may request additional evidence to resolve a complaint. Decisions may result in removal or suspension of the advertiser.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">10. Termination</h3>
          <p className="text-muted-foreground leading-relaxed">
            <strong>Right to Remove:</strong> MasseurMatch may suspend, restrict, or terminate any account or listing, with or without notice, at our sole discretion. This includes cases involving policy violations, suspicious activity, user complaints, legal risk, or reputational harm.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">11. Governing Law and Venue</h3>
          <p className="text-muted-foreground leading-relaxed">
            Delaware law governs. Venue: state or federal courts in Delaware, USA.
          </p>
        </section>
        <ContactInfo />
      </div>
    )
  },
  {
    slug: 'advertiser-policy',
    title: 'Advertiser Policy',
    icon: <Briefcase className="w-4 h-4 mr-2" />,
    lastUpdated: 'January 2025',
    content: (
      <div className="space-y-6">
        <PlatformNature />
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">1. Independent Contractor Status</h3>
          <p className="text-muted-foreground leading-relaxed">
            Advertisers are independent self-employed individuals. No employment, agency, partnership, or joint venture relationship exists between MasseurMatch and any advertiser.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">2. Responsibilities & Compliance</h3>
          <p className="text-muted-foreground leading-relaxed mb-2">
            Advertisers are solely responsible for compliance with all local, state, and federal laws relating to massage practice, licensing, zoning, advertising, and professional regulations.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            MasseurMatch does not conduct background checks, identity verification, license validation, or in-person verification of advertisers.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">3. Performance & Results</h3>
          <p className="text-muted-foreground leading-relaxed">
            MasseurMatch does not guarantee visibility, ranking, customer volume, leads, or earnings. Advertising performance varies and is outside our control.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">4. Prohibited Conduct</h3>
          <p className="text-muted-foreground leading-relaxed mb-2">
            MasseurMatch enforces a strict zero-tolerance policy against trafficking, exploitation, coercion, or illegal services. Listings that suggest, imply, or facilitate illegal activity will be removed immediately.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">5. Right to Remove</h3>
          <p className="text-muted-foreground leading-relaxed">
            MasseurMatch may suspend, restrict, or terminate any account or listing, with or without notice, at our sole discretion. This includes cases involving policy violations, suspicious activity, user complaints, legal risk, or reputational harm.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">6. Liability</h3>
          <p className="text-muted-foreground leading-relaxed">
            MasseurMatch is not responsible for the quality, safety, legality, availability, or outcome of services provided by advertisers. All interactions that occur outside the Platform are at the sole risk of the user. MasseurMatch does not supervise, monitor, or endorse any advertiser.
          </p>
        </section>
        <ContactInfo />
      </div>
    )
  },
  {
    slug: 'community-guidelines',
    title: 'Community Guidelines',
    icon: <ListChecks className="w-4 h-4 mr-2" />,
    lastUpdated: 'January 2025',
    content: (
      <div className="space-y-6">
        <PlatformNature />
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">1. Allowed Content</h3>
          <p className="text-muted-foreground leading-relaxed">
            Professional biography, fully clothed photos, skills, general rates descriptions without sexual context, city/region, contact method outside the Platform if permitted by law.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">2. Prohibited Content</h3>
          <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-1">
            <li>Nudity or sexual content</li>
            <li>Escorting or sexual services</li>
            <li>Code words implying sexual activity</li>
            <li>Suggestive or explicit poses</li>
            <li>Medical claims or health guarantees</li>
            <li>AI-generated images unless explicitly labeled and permitted</li>
            <li>Stock photos</li>
            <li>Fake, altered, or misleading images</li>
            <li>Images older than 12 months</li>
            <li>Images of other individuals</li>
          </ul>
        </section>
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">3. Wellness Disclaimer</h3>
          <p className="text-muted-foreground leading-relaxed">
            Advertisers may not imply medical expertise, therapeutic licensing, or health outcomes unless they hold a valid and verifiable professional license in their jurisdiction.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">4. Enforcement</h3>
          <p className="text-muted-foreground leading-relaxed">
            We may edit, refuse, or remove any content and suspend accounts.
          </p>
        </section>
        <ContactInfo />
      </div>
    )
  },
  {
    slug: 'professional-standards',
    title: 'Professional Standards',
    icon: <Shield className="w-4 h-4 mr-2" />,
    lastUpdated: 'January 2025',
    content: (
      <div className="space-y-6">
        <PlatformNature />
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">1. Licensing and qualifications</h3>
          <p className="text-muted-foreground leading-relaxed mb-2">
            Therapists are responsible for holding all required licenses, permits, and insurance for their jurisdiction. Misrepresentation of credentials is grounds for removal.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Provide clear descriptions of modalities offered, experience, and any scope limitations. Do not perform services you are not trained or licensed to deliver.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">2. Safety, hygiene, and environment</h3>
          <p className="text-muted-foreground leading-relaxed mb-2">
            Maintain clean linens, sanitized equipment, and safe workspaces. Communicate draping practices and respect client comfort and privacy at all times.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Mobile sessions must follow the same standards for cleanliness and professionalism as studio sessions.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">3. Ethics and boundaries</h3>
          <p className="text-muted-foreground leading-relaxed mb-2">
            Follow consent-first care, including ongoing check-ins about pressure and comfort. Sexual services, coercion, or harassment are prohibited.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Keep communication transparent, professional, and free of misleading claims. Respect cancellation policies and timing commitments.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">4. Quality assurance and feedback</h3>
          <p className="text-muted-foreground leading-relaxed mb-2">
            Respond to client feedback constructively. Repeat patterns of poor conduct, no-shows, or unsafe behavior can lead to moderation, suspension, or removal.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We may request that advertisers update or clarify profile information to keep listings accurate. We do not verify credentials or licenses.
          </p>
        </section>
        <ContactInfo />
      </div>
    )
  },
  {
    slug: 'ad-rules',
    title: 'Ad Rules',
    icon: <LayoutTemplate className="w-4 h-4 mr-2" />,
    lastUpdated: 'January 2025',
    content: (
      <div className="space-y-6">
        <PlatformNature />
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">1. Required Fields</h3>
          <p className="text-muted-foreground leading-relaxed">
            Display name, city/state, category, and a clear non‑sexual description of services.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">2. Prohibited Elements</h3>
          <p className="text-muted-foreground leading-relaxed">
            Advertisers may not upload or imply: Nudity or sexual content; Escorting or sexual services; Code words implying sexual activity; Suggestive or explicit poses; Medical claims or health guarantees.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">3. Wellness Disclaimer</h3>
          <p className="text-muted-foreground leading-relaxed">
            Advertisers may not imply medical expertise, therapeutic licensing, or health outcomes unless they hold a valid and verifiable professional license in their jurisdiction.
          </p>
        </section>
        <ContactInfo />
      </div>
    )
  },
  {
    slug: 'photo-rules',
    title: 'Photo Rules',
    icon: <Camera className="w-4 h-4 mr-2" />,
    lastUpdated: 'January 2025',
    content: (
      <div className="space-y-6">
        <PlatformNature />
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">1. Prohibited Images</h3>
          <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-1">
            <li>Nudity or sexual content</li>
            <li>Suggestive or explicit poses</li>
            <li>AI-generated images unless explicitly labeled</li>
            <li>Stock photos</li>
            <li>Fake, altered, or misleading images</li>
            <li>Images older than 12 months</li>
            <li>Images of other individuals</li>
          </ul>
        </section>
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">2. Technical Standards</h3>
          <p className="text-muted-foreground leading-relaxed">
            High‑resolution, well‑lit, no heavy filters. No watermarks or third‑party branding unless you own the rights.
          </p>
        </section>
        <ContactInfo />
      </div>
    )
  },
  {
    slug: 'anti-trafficking',
    title: 'Anti-Trafficking Statement',
    icon: <ShieldOff className="w-4 h-4 mr-2" />,
    lastUpdated: 'January 2025',
    content: (
      <div className="space-y-6">
        <PlatformNature />
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">Zero-Tolerance Policy</h3>
          <p className="text-muted-foreground leading-relaxed">
            MasseurMatch enforces a strict zero-tolerance policy against trafficking, exploitation, coercion, or illegal services. Listings that suggest, imply, or facilitate illegal activity will be removed immediately and may be reported to authorities.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">Reporting</h3>
          <p className="text-muted-foreground leading-relaxed">
            Report suspected trafficking to support@masseurmatch.com or local authorities. We cooperate with legally valid investigations.
          </p>
        </section>
        <ContactInfo />
      </div>
    )
  },
  {
    slug: 'complaints',
    title: 'Complaints & Compliance',
    icon: <AlertCircle className="w-4 h-4 mr-2" />,
    lastUpdated: 'January 2025',
    content: (
      <div className="space-y-6">
        <PlatformNature />
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">1. Complaints Handling Protocol</h3>
          <p className="text-muted-foreground leading-relaxed">
            Complaints are reviewed within 3–7 business days. MasseurMatch may request additional evidence to resolve a complaint. Decisions may result in removal or suspension of the advertiser.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">2. How to Report</h3>
          <p className="text-muted-foreground leading-relaxed">
            Email support@masseurmatch.com with the listing URL, description of the issue, and evidence if available.
          </p>
        </section>
        <ContactInfo />
      </div>
    )
  },
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    icon: <Shield className="w-4 h-4 mr-2" />,
    lastUpdated: 'January 2025',
    content: (
      <div className="space-y-6">
        <PlatformNature />
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">1. Data We Collect</h3>
          <p className="text-muted-foreground leading-relaxed">
            Account email, optional phone number, password hash, and listing content (public business information). We also collect basic analytics and security logs to keep the Platform stable and secure.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">2. What We Do Not Collect</h3>
          <p className="text-muted-foreground leading-relaxed">
            We do not collect government ID documents, payment card data, health or medical information (PHI), or professional license files. We do not offer in-platform messaging, SMS, reviews, or ratings, so we do not collect message or review content.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">3. Cookies and Analytics</h3>
          <p className="text-muted-foreground leading-relaxed">
            We use essential cookies for authentication and security and limited analytics to understand site usage. See the Cookie Policy for details.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">4. No Duty to Monitor</h3>
          <p className="text-muted-foreground leading-relaxed">
            MasseurMatch reserves the right, but has no obligation, to monitor user content. Any monitoring is conducted at our discretion and not as a legal duty or service guarantee.
          </p>
        </section>
        <ContactInfo />
      </div>
    )
  },
  {
    slug: 'subpoena',
    title: 'Subpoena Compliance Policy',
    icon: <Gavel className="w-4 h-4 mr-2" />,
    lastUpdated: 'January 2025',
    content: (
      <div className="space-y-6">
        <PlatformNature />
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-2">Legal Contact</h3>
          <p className="text-muted-foreground leading-relaxed">
            All legal requests must be sent to legal@masseurmatch.com.
          </p>
        </section>
        <ContactInfo />
      </div>
    )
  },
  {
    slug: 'phishing-scam',
    title: 'Phishing & Scam Notice',
    icon: <AlertTriangle className="w-4 h-4 mr-2" />,
    lastUpdated: 'January 2025',
    content: (
      <div className="space-y-6">
        <PlatformNature />
        <p className="text-muted-foreground leading-relaxed">
            We never ask for passwords or one‑time codes by email/SMS.
        </p>
        <ContactInfo />
      </div>
    )
  },
  {
    slug: 'dmca',
    title: 'DMCA Policy',
    icon: <Copyright className="w-4 h-4 mr-2" />,
    lastUpdated: 'January 2025',
    content: (
      <div className="space-y-6">
        <PlatformNature />
        <p className="text-muted-foreground leading-relaxed">
            Copyright complaints are handled under the DMCA Policy. Email legal@masseurmatch.com.
        </p>
        <ContactInfo />
      </div>
    )
  },
  {
    slug: 'repeat-infringer',
    title: 'Repeat Infringer Policy',
    icon: <Ban className="w-4 h-4 mr-2" />,
    lastUpdated: 'January 2025',
    content: (
      <div className="space-y-6">
        <PlatformNature />
        <p className="text-muted-foreground leading-relaxed">
            Three substantiated IP violations within a rolling 12‑month period may result in account termination.
        </p>
        <ContactInfo />
      </div>
    )
  },
  {
    slug: 'cookie-policy',
    title: 'Cookie Policy',
    icon: <Cookie className="w-4 h-4 mr-2" />,
    lastUpdated: 'January 2025',
    content: (
      <div className="space-y-6">
        <PlatformNature />
        <p className="text-muted-foreground leading-relaxed">
            We use essential cookies for authentication and security.
        </p>
        <ContactInfo />
      </div>
    )
  },
  {
    slug: 'non-discrimination',
    title: 'Non‑Discrimination Policy',
    icon: <Users className="w-4 h-4 mr-2" />,
    lastUpdated: 'January 2025',
    content: (
      <div className="space-y-6">
        <PlatformNature />
        <p className="text-muted-foreground leading-relaxed">
            We prohibit discrimination based on race, color, ethnicity, national origin, religion, sex, gender identity, sexual orientation, disability, or age.
        </p>
        <ContactInfo />
      </div>
    )
  },
  {
    slug: 'advertisement',
    title: 'Advertisement Policy',
    icon: <Megaphone className="w-4 h-4 mr-2" />,
    lastUpdated: 'January 2025',
    content: (
      <div className="space-y-6">
        <PlatformNature />
        <p className="text-muted-foreground leading-relaxed">
            This policy applies to advertiser listings on MasseurMatch. We do not run third-party ad networks. Ads must be truthful and not misleading.
        </p>
        <ContactInfo />
      </div>
    )
  },
  {
    slug: 'accessibility',
    title: 'Accessibility Statement',
    icon: <Accessibility className="w-4 h-4 mr-2" />,
    lastUpdated: 'January 2025',
    content: (
      <div className="space-y-6">
        <PlatformNature />
        <p className="text-muted-foreground leading-relaxed">
            We strive to conform to WCAG 2.1 AA where feasible.
        </p>
        <ContactInfo />
      </div>
    )
  },
  {
    slug: 'faq',
    title: 'FAQ',
    icon: <HelpCircle className="w-4 h-4 mr-2" />,
    lastUpdated: 'January 2025',
    content: (
      <div className="space-y-6">
        <PlatformNature />
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground mb-1">Q: Does MasseurMatch manage bookings?</h3>
            <p className="text-muted-foreground leading-relaxed">A: No. We only provide ad listings.</p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">Q: Do you process payments or subscriptions?</h3>
            <p className="text-muted-foreground leading-relaxed">A: No. All contact and transactions happen off platform between users and advertisers.</p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">Q: Do you offer messaging, SMS, reviews, or ratings?</h3>
            <p className="text-muted-foreground leading-relaxed">A: No. MasseurMatch is a discovery-only directory.</p>
          </div>
        </div>
        <ContactInfo />
      </div>
    )
  }
];

