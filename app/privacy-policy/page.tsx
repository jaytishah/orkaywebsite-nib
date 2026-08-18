import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/LegalPage";
import { CONTACT } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy — Orkay Tiles",
  description:
    "How Orkay Tiles collects, uses and protects your personal information.",
};

/** Orkay's own policy, from orkaytiles.com/privacy-policy. */
const SECTIONS: LegalSection[] = [
  {
    title: "Information We Collect",
    body: [
      "Information you provide:",
      [
        "Contact & inquiry data — name, company name, email address, phone number, country and message content from contact or inquiry forms.",
        "Business information — tile requirements, order quantities, target market and related details shared during business inquiries.",
        "RCS messaging — mobile number and message content from RCS Business Messaging interactions.",
      ],
      "Information collected automatically:",
      [
        "Usage data — pages visited, time on site, referral source, browser type, device type and IP address, through Google Analytics 4.",
        "Marketing data — ad interactions tracked via Facebook Pixel and LinkedIn Insight Tag.",
        "Cookies — session and preference cookies set by the site and its analytics and marketing tools.",
      ],
    ],
  },
  {
    title: "How We Use Your Information",
    body: [
      [
        "Responding to inquiries and providing quotations for business communication.",
        "Processing confirmed orders, coordinating shipments and providing after-sale support.",
        "Sending product updates, new launches and promotional content, with consent.",
        "Analyzing traffic patterns to improve website performance and content.",
        "Displaying relevant advertisements on Google and Meta platforms.",
        "Complying with applicable laws, regulations and export documentation requirements.",
      ],
      "We will never sell your personal information to any third party, use your data for purposes other than those listed above, or send unsolicited marketing without your consent.",
    ],
  },
  {
    title: "Legal Basis for Processing",
    body: [
      [
        "Legitimate interest — managing business inquiries, customer relationships and website improvements.",
        "Consent — for marketing communications, cookies and RCS messaging, with withdrawal options.",
        "Contractual necessity — processing confirmed orders and fulfilling buyer obligations.",
        "Legal obligation — export documentation, tax records and compliance with the Digital Personal Data Protection Act, 2023 (DPDP Act).",
      ],
    ],
  },
  {
    title: "Cookies & Tracking Technologies",
    body: [
      [
        "Essential cookies — required for website functionality, session management and security.",
        "Analytics cookies — Google Analytics 4 tracks page views, user behaviour and traffic sources.",
        "Marketing cookies — Facebook Pixel and LinkedIn Insight Tag for ad performance and retargeting.",
        "Preference cookies — remember language and region preferences.",
      ],
      "You can control cookies through your browser settings. EU/EEA visitors receive a cookie consent banner per GDPR.",
    ],
  },
  {
    title: "Sharing Your Information",
    body: [
      "We do not sell, trade or rent your personal information. Information is shared only in limited circumstances:",
      [
        "Service providers — trusted tools such as email platforms, CRM and web hosting, under confidentiality agreements.",
        "Advertising platforms — Google Ads and Meta Ads receive anonymized or aggregated data without personally identifiable information.",
        "Export and logistics partners — shipping and contact details shared with freight partners for confirmed orders.",
        "RCS platform providers — authorized RCS messaging aggregators compliant with TRAI regulations.",
        "Legal requirements — when required by Indian law, court order or government authority.",
        "Business transfer — notification provided in advance of mergers or acquisitions.",
      ],
    ],
  },
  {
    title: "Data Retention",
    body: [
      [
        "Inquiry data — retained for up to 3 years for potential business follow-up.",
        "Order and transaction data — retained 7 years for accounting and legal compliance.",
        "RCS message logs — retained 12 months from the last interaction date.",
        "Newsletter subscribers — retained until unsubscription.",
        "Website analytics data — typically 14 months, per the Google Analytics default.",
      ],
      "After these periods, data is securely deleted or anonymized.",
    ],
  },
  {
    title: "Your Rights",
    body: [
      [
        "Right to access — request a copy of the personal data we hold.",
        "Right to rectification — request correction of inaccurate or incomplete data.",
        "Right to erasure — request deletion of your personal data.",
        "Right to object — object to processing for marketing purposes.",
        "Right to withdraw consent — unsubscribe or contact us at any time.",
        "Right to data portability — request your data in a machine-readable format (EU residents under GDPR).",
      ],
      "Contact us at the email below to exercise these rights. We respond within 30 days.",
    ],
  },
  {
    title: "Security of Your Data",
    body: [
      [
        "SSL/HTTPS encryption for all website traffic.",
        "Access controls limiting business inquiry data to authorized staff.",
        "Regular website security scans and updates.",
        "Secure email communication for business inquiries.",
      ],
      "No internet transmission method is 100% secure. Data breach notifications are provided as required by law.",
    ],
  },
  {
    title: "Third-Party Links",
    body: [
      "Our website may contain links to third-party sites including marketplaces, social media platforms and logistics partners. These have separate privacy policies beyond our control — we encourage you to review them.",
    ],
  },
  {
    title: "Children's Privacy",
    body: [
      "Our website and services are intended for business use and directed at adults (18 years and above). We do not knowingly collect information from minors. Contact us if a minor has submitted information.",
    ],
  },
  {
    title: "International Data Transfers",
    body: [
      "Orkay Tiles operates globally from India. International inquiries may result in data transfer to India under the Digital Personal Data Protection Act, 2023 (DPDP Act). EU/EEA visitors have GDPR-compliant safeguards.",
    ],
  },
  {
    title: "RCS Business Messaging",
    body: [
      "RCS interactions collect mobile numbers, message content and interaction data for responding to inquiries and business communication. You may opt out at any time by replying STOP or UNSUBSCRIBE, compliant with TRAI TCCCPR 2018 regulations.",
      "By sharing your information, you authorize Orkay Tiles to contact you via SMS, RCS, WhatsApp, email and other communication channels. This consent overrides NDNC/DND registration per TRAI regulations.",
    ],
  },
  {
    title: "Changes to This Policy",
    body: [
      "We may update this policy, changing the “Last Updated” date accordingly. Continued use of the website after changes constitutes acceptance of the updated policy.",
    ],
  },
  {
    title: "Contact Us",
    body: [
      `For privacy-related questions, concerns or data requests: ${CONTACT.email} · ${CONTACT.indiaSales} · ${CONTACT.address}`,
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy"
      em="Policy."
      meta="Effective 1st March 2026 · Last updated 23rd June 2026 · Applies to orkaytiles.com & RCS messaging"
      sections={SECTIONS}
    />
  );
}
