import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

function LegalPage({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="bg-gray-50 min-h-screen">
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="container-custom py-16 md:py-20">
          <nav className="text-sm text-blue-100/80 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span>{title}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{title}</h1>
          <p className="text-blue-100 max-w-3xl text-lg leading-relaxed">
            These terms explain how BuyHerePayHere.io operates as an informational directory of Buy Here Pay Here dealerships and how visitors may use the site.
          </p>
          <p className="text-sm text-blue-200 mt-4">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="container-custom py-12 md:py-16">
        <div className="max-w-4xl bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-10 space-y-8">
          {children}
        </div>
      </section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
      <div className="space-y-4 text-gray-700 leading-7">{children}</div>
    </section>
  );
}

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service | BuyHerePayHere.io",
  description: "Read the Terms of Service for BuyHerePayHere.io, a directory of Buy Here Pay Here car dealers across the United States.",
  path: "/terms-of-service/",
});

export default function TermsOfServicePage() {
  return (
    <LegalPage title="Terms of Service" lastUpdated="March 20, 2026">
      <Section title="1. Acceptance of These Terms">
        <p>
          By accessing or using BuyHerePayHere.io, you agree to be bound by these Terms of Service. If you do not agree with these terms, you should not use the website. These terms apply to all visitors, dealerships, and other users who access or interact with the site.
        </p>
      </Section>

      <Section title="2. Nature of the Service">
        <p>
          BuyHerePayHere.io is an informational online directory that helps users discover Buy Here Pay Here car dealers and related location pages in the United States and its territories. The site is not a lender, broker, dealership, financial institution, credit repair company, or legal advisor. We do not make lending decisions, arrange financing, guarantee vehicle availability, or negotiate transactions on behalf of users.
        </p>
        <p>
          Listings, location pages, and related content are provided for general informational purposes only. Users should independently verify dealer identity, vehicle inventory, financing terms, licensing status, pricing, warranties, and any other material information before entering into any agreement.
        </p>
      </Section>

      <Section title="3. Dealer Listings and Accuracy of Information">
        <p>
          We strive to keep directory information reasonably current, but we do not guarantee that any listing, address, phone number, website, operating hours, financing details, or descriptive content is complete, accurate, or up to date. Dealers may change, relocate, close, or modify their offerings at any time.
        </p>
        <p>
          Inclusion in the directory does not constitute endorsement, certification, partnership, or recommendation. Any relationship between a user and a dealer is solely between those parties.
        </p>
      </Section>

      <Section title="4. Permitted Use">
        <p>
          You may use the site only for lawful, personal, and business information purposes connected with locating dealerships or learning about Buy Here Pay Here financing. You agree not to use the site in a way that could damage, disable, overburden, scrape, copy at scale, reverse engineer, or interfere with the site, its content, or other users.
        </p>
        <p>
          You also agree not to submit false claims of ownership, impersonate a dealership, transmit malicious code, or use automated systems to extract data in violation of applicable law or these terms.
        </p>
      </Section>

      <Section title="5. User Submissions and Claim Requests">
        <p>
          If you submit a dealership claim, contact request, correction, or other information through the site, you represent that the information you provide is truthful and that you have the right to submit it. You grant us the right to review, store, and use that information for the purpose of operating, maintaining, and improving the directory.
        </p>
        <p>
          We reserve the right to reject, edit, remove, or decline to publish any submission at our discretion, including where ownership cannot be verified or where submitted information appears inaccurate, misleading, unlawful, or incomplete.
        </p>
      </Section>

      <Section title="6. No Financial, Legal, or Credit Advice">
        <p>
          Content on BuyHerePayHere.io does not constitute financial, legal, tax, credit, or consumer advice. Users should consult qualified professionals before making financing or vehicle purchase decisions. We are not responsible for lending outcomes, credit decisions, vehicle quality, contract terms, down payments, repossession policies, or any dispute arising from a transaction with a listed dealer.
        </p>
      </Section>

      <Section title="7. Intellectual Property">
        <p>
          The website design, branding, text, arrangement of listings, software, graphics, and other site content are owned by or licensed to BuyHerePayHere.io, except for third-party trademarks, logos, and business names that remain the property of their respective owners. You may not reproduce, republish, distribute, or create derivative works from site content except as permitted by law or with prior written permission.
        </p>
      </Section>

      <Section title="8. Third-Party Links and Services">
        <p>
          The site may contain links to third-party dealer websites, maps, forms, and external services. We do not control and are not responsible for the availability, content, privacy practices, terms, or conduct of third-party websites or businesses. Your interactions with any third party are at your own risk.
        </p>
      </Section>

      <Section title="9. Disclaimer of Warranties">
        <p>
          The website and all content are provided on an “as is” and “as available” basis without warranties of any kind, whether express or implied. To the fullest extent permitted by law, BuyHerePayHere.io disclaims all warranties, including implied warranties of merchantability, fitness for a particular purpose, non-infringement, accuracy, and availability.
        </p>
      </Section>

      <Section title="10. Limitation of Liability">
        <p>
          To the fullest extent permitted by law, BuyHerePayHere.io and its operators will not be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages, or for any loss of profits, data, goodwill, business opportunity, or other losses arising out of or relating to the use of or inability to use the site or any interaction with listed dealers.
        </p>
      </Section>

      <Section title="11. Indemnification">
        <p>
          You agree to defend, indemnify, and hold harmless BuyHerePayHere.io and its operators from and against claims, liabilities, damages, judgments, losses, costs, and expenses arising from your misuse of the site, your violation of these terms, or your infringement of any third-party rights.
        </p>
      </Section>

      <Section title="12. Changes to the Site or Terms">
        <p>
          We may modify, suspend, or discontinue any part of the site at any time without notice. We may also update these Terms of Service from time to time. Continued use of the site after updated terms are posted constitutes acceptance of the revised terms.
        </p>
      </Section>

      <Section title="13. Governing Law">
        <p>
          These terms will be governed by and construed in accordance with the laws applicable in the jurisdiction of the site operator, without regard to conflict of law principles. Any dispute relating to the site or these terms should be brought in a court of competent jurisdiction.
        </p>
      </Section>

      <Section title="14. Contact">
        <p>
          If you have questions about these Terms of Service or need to report an issue with a listing, please contact us through the website’s available contact or claim channels.
        </p>
      </Section>
    </LegalPage>
  );
}
