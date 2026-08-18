import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/LegalPage";
import { CONTACT } from "@/lib/content";

export const metadata: Metadata = {
  title: "Terms & Conditions — Orkay Tiles",
  description: "Terms governing the use of orkaytiles.com and business with Orkay Tiles.",
};

/** Orkay's own terms, from orkaytiles.com/terms-and-conditions. */
const SECTIONS: LegalSection[] = [
  {
    title: "Acceptance of Terms",
    body: [
      "By accessing this website or submitting inquiries, you agree to be bound by these terms. Please read these Terms & Conditions and our Privacy Policy before proceeding.",
    ],
  },
  {
    title: "About Orkay Tiles",
    body: [
      "Orkay Tiles has manufactured ceramic and porcelain tiles since 1996, headquartered in Morbi, Gujarat, operating seven plants and exporting to over 40 countries globally.",
    ],
  },
  {
    title: "Use of Website",
    body: [
      "You must refrain from unlawful use of the website, unauthorized access attempts, spam transmission, content reproduction, or automated data extraction without written permission.",
    ],
  },
  {
    title: "Product Information & Accuracy",
    body: [
      "Product images serve illustrative purposes only; colors and textures vary due to screen calibration and manufacturing tolerances. Pricing remains indicative and subject to change — formal quotations provide confirmed rates. SKU availability depends on production schedules.",
    ],
  },
  {
    title: "Inquiries, Quotations & Orders",
    body: [
      "Inquiries do not constitute binding contracts. Quotations remain valid for the period specified, typically 15–30 days. Binding orders require signed purchase orders and advance payment or confirmed Letters of Credit. Cancellations after production starts may incur charges.",
    ],
  },
  {
    title: "Export Terms & Trade Conditions",
    body: [
      [
        "Default terms are FOB Mundra/JNPT Port, India.",
        "Payment typically requires 30–50% advance with the balance before shipment.",
        "Minimum order quantities vary by product.",
        "Lead times range 15–45 days.",
        "Buyers assume full responsibility for import compliance and licensing.",
      ],
    ],
  },
  {
    title: "Intellectual Property",
    body: [
      "All website content — logos, images, designs and PDFs — remains Orkay Tiles' exclusive intellectual property under copyright and trademark protections.",
    ],
  },
  {
    title: "Limitation of Liability",
    body: [
      "Orkay Tiles excludes liability for indirect damages, lost profits, buyer noncompliance with regulations, or shipping delays beyond the company's control. Total liability cannot exceed the value of the specific transaction.",
    ],
  },
  {
    title: "Disclaimer of Warranties",
    body: [
      "The website operates “as is” without warranties regarding merchantability or fitness. Orkay Tiles does not guarantee uninterrupted, error-free access and reserves the right to modify the site.",
    ],
  },
  {
    title: "Third-Party Links & Services",
    body: [
      "Third-party website links appear for convenience only. Orkay Tiles does not endorse these platforms' content, practices or availability, and you access them at your own risk.",
    ],
  },
  {
    title: "Governing Law & Disputes",
    body: [
      "Indian law governs these terms, with exclusive jurisdiction in the courts of Morbi, Gujarat. International disputes undergo 30-day good-faith negotiation before potential arbitration under India's Arbitration and Conciliation Act, 1996.",
    ],
  },
  {
    title: "Amendments",
    body: [
      "Orkay Tiles may modify these terms at any time. Updated versions are posted with revised effective dates. Continued use of the website constitutes acceptance of changes.",
    ],
  },
  {
    title: "Contact Us",
    body: [
      `For inquiries: ${CONTACT.email} · ${CONTACT.indiaSales}. Responses typically arrive within 5–7 business days.`,
    ],
  },
];

export default function TermsAndConditions() {
  return (
    <LegalPage
      title="Terms &"
      em="Conditions."
      meta="Effective 1st March 2026 · Governing law: India (Gujarat jurisdiction)"
      sections={SECTIONS}
    />
  );
}
