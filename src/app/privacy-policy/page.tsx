import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

function LegalPage({
  title,
  lastUpdated,
  intro,
  children,
}: {
  title: string;
  lastUpdated: string;
  intro: string;
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
          <p className="text-blue-100 max-w-3xl text-lg leading-relaxed">{intro}</p>
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
  title: "Privacy Policy | BuyHerePayHere.io",
  description: "Read the Privacy Policy for BuyHerePayHere.io, including how information is collected, used, stored, and shared.",
  path: "/privacy-policy/",
});

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated="March 20, 2026"
      intro="This Privacy Policy explains how BuyHerePayHere.io collects, uses, stores, and discloses information when you visit the site, browse dealer pages, or submit dealership-related inquiries or claim requests."
    >
      <Section title="1. Scope of This Policy">
        <p>
          This Privacy Policy applies to information collected through BuyHerePayHere.io and related pages operated as part of the website. The site functions as an informational directory of Buy Here Pay Here dealerships in the United States and its territories.
        </p>
      </Section>

      <Section title="2. Information We Collect">
        <p>
          We may collect information that you provide directly, such as your name, email address, phone number, dealership name, business role, and the contents of any message, form submission, correction request, or listing claim you send through the site.
        </p>
        <p>
          We may also collect certain technical and usage information automatically, including IP address, browser type, device information, referral source, pages viewed, approximate location derived from IP, and interactions with the site. This information may be collected through server logs, analytics tools, cookies, or similar technologies.
        </p>
      </Section>

      <Section title="3. How We Use Information">
        <p>
          We use collected information to operate and improve the directory, respond to inquiries, review dealership claim requests, maintain site security, analyze performance, troubleshoot technical issues, monitor usage patterns, and protect the rights of the site and its users.
        </p>
        <p>
          We may also use information to communicate about submissions, corrections, ownership verification, policy updates, or administrative matters related to the website.
        </p>
      </Section>

      <Section title="4. Cookies and Similar Technologies">
        <p>
          BuyHerePayHere.io may use cookies, local storage, pixels, and similar technologies to remember preferences, support site functionality, measure traffic, understand visitor behavior, and improve the user experience. Some cookies may be set by third-party analytics or infrastructure providers.
        </p>
        <p>
          You can control cookies through your browser settings. Disabling certain cookies may affect how parts of the site function.
        </p>
      </Section>

      <Section title="5. Sharing of Information">
        <p>
          We do not sell personal information in the ordinary course of operating the site. We may share information with service providers, hosting providers, analytics vendors, security providers, form-processing tools, and similar partners who help us operate the website.
        </p>
        <p>
          We may also disclose information if required by law, to enforce site policies, to protect rights or safety, to investigate fraud or abuse, or in connection with a business transfer such as a merger, acquisition, or asset sale.
        </p>
      </Section>

      <Section title="6. Third-Party Websites and Dealer Contacts">
        <p>
          The site may link to dealer websites, map tools, and third-party services. Once you leave BuyHerePayHere.io or communicate directly with a dealership, their privacy practices apply. We are not responsible for third-party privacy statements, content, or data practices.
        </p>
      </Section>

      <Section title="7. Data Retention">
        <p>
          We retain information for as long as reasonably necessary to operate the site, fulfill the purposes described in this policy, resolve disputes, comply with legal obligations, and enforce agreements. Retention periods may vary depending on the type of information and the context in which it was collected.
        </p>
      </Section>

      <Section title="8. Data Security">
        <p>
          We use reasonable administrative, technical, and organizational measures to protect information against unauthorized access, loss, misuse, or alteration. However, no website, server, or transmission method can be guaranteed to be completely secure.
        </p>
      </Section>

      <Section title="9. Your Choices and Rights">
        <p>
          Depending on your jurisdiction, you may have rights relating to access, correction, deletion, portability, or restriction of certain personal information. If you have submitted information through the site and would like it reviewed, corrected, or deleted where applicable, you may contact us through the site’s available communication channels.
        </p>
      </Section>

      <Section title="10. Children’s Privacy">
        <p>
          BuyHerePayHere.io is intended for a general audience and is not directed to children under 13. We do not knowingly collect personal information from children under 13 through the site.
        </p>
      </Section>

      <Section title="11. Changes to This Policy">
        <p>
          We may update this Privacy Policy periodically to reflect operational, legal, or technical changes. When we do, we will revise the “Last updated” date on this page. Continued use of the site after an update constitutes acceptance of the revised policy.
        </p>
      </Section>

      <Section title="12. Contact">
        <p>
          If you have questions about this Privacy Policy or about information submitted through the site, please use the available contact or listing claim channels on BuyHerePayHere.io.
        </p>
      </Section>
    </LegalPage>
  );
}
