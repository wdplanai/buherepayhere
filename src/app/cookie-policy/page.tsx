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
  title: "Cookie Policy | BuyHerePayHere.io",
  description: "Read the Cookie Policy for BuyHerePayHere.io, including how cookies and similar technologies are used on the website.",
  path: "/cookie-policy/",
});

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      lastUpdated="March 20, 2026"
      intro="This Cookie Policy explains how BuyHerePayHere.io uses cookies and similar technologies to operate the site, understand traffic, and improve the experience for visitors searching for Buy Here Pay Here dealerships."
    >
      <Section title="1. What Are Cookies">
        <p>
          Cookies are small text files placed on your device when you visit a website. They help websites remember preferences, recognize returning visitors, support technical functions, and understand how users interact with pages over time.
        </p>
      </Section>

      <Section title="2. How We Use Cookies">
        <p>
          BuyHerePayHere.io may use cookies and similar technologies to keep the website functioning properly, improve performance, measure visitor engagement, understand how users navigate location and dealer pages, and support security or fraud-prevention measures.
        </p>
        <p>
          Cookies may also be used to remember certain settings, improve page load behavior, and help us evaluate which content is most useful to visitors.
        </p>
      </Section>

      <Section title="3. Types of Cookies We May Use">
        <p>
          Essential cookies help core site functions work correctly. Performance and analytics cookies help us understand traffic and usage trends. Functional cookies may remember preferences or settings. In some cases, third-party cookies may be set by services used for analytics, hosting, embedded content, or infrastructure support.
        </p>
      </Section>

      <Section title="4. Analytics and Third-Party Technologies">
        <p>
          We may use third-party services to help measure site traffic, diagnose technical issues, and understand how users find and use the directory. These providers may use cookies, pixels, or similar technologies according to their own policies.
        </p>
        <p>
          We do not control all third-party technologies that may be used through external services, dealer links, maps, or tools integrated into the site.
        </p>
      </Section>

      <Section title="5. Managing Cookies">
        <p>
          Most web browsers allow you to block, delete, or limit cookies through browser settings. You can typically review these controls in your browser’s privacy or security preferences. If you disable cookies, some parts of the website may not function as intended.
        </p>
      </Section>

      <Section title="6. Similar Technologies">
        <p>
          In addition to cookies, the site may use local storage, pixels, log files, or similar technologies for related operational, performance, and analytical purposes. These technologies may work in a similar manner to cookies or support related website functions.
        </p>
      </Section>

      <Section title="7. Updates to This Policy">
        <p>
          We may update this Cookie Policy from time to time to reflect changes in technology, legal requirements, or website operations. When changes are made, the “Last updated” date on this page will be revised.
        </p>
      </Section>

      <Section title="8. Contact">
        <p>
          If you have questions about how cookies or similar technologies are used on BuyHerePayHere.io, please contact us through the site’s available communication channels.
        </p>
      </Section>
    </LegalPage>
  );
}
