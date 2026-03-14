import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import { getCityBySlug, getDealersByCity } from "@/lib/db";

export const revalidate = 3600;

interface CityPageProps {
  params: Promise<{ stateSlug: string; citySlug: string }>;
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { stateSlug, citySlug } = await params;
  const city = await getCityBySlug(stateSlug, citySlug);
  if (!city) return {};
  return {
    title: `Buy Here Pay Here Dealers in ${city.city_name}, ${city.state_abbreviation} | BuyHerePayHere.io`,
    description: `Find ${city.dealer_count} buy here pay here dealerships in ${city.city_name}, ${city.state_name}. Get in-house financing and drive away today regardless of your credit score.`,
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const { stateSlug, citySlug } = await params;
  const [city, dealers] = await Promise.all([
    getCityBySlug(stateSlug, citySlug),
    getDealersByCity(stateSlug, citySlug),
  ]);

  if (!city) notFound();

  const seoContent = [
    `${city.city_name}, ${city.state_name} is home to ${city.dealer_count} Buy Here Pay Here dealerships that specialize in helping drivers with all types of credit situations. Whether you are dealing with bad credit, no credit history, a past bankruptcy, or a previous repossession, the BHPH dealers in ${city.city_name} offer in-house financing that makes vehicle ownership accessible. These dealerships evaluate your current income and ability to make payments rather than relying solely on your credit score.`,
    `When visiting a Buy Here Pay Here dealer in ${city.city_name}, you can expect a straightforward process. Most dealers require a valid driver's license, proof of income, proof of residence, and a down payment. Many ${city.city_name} BHPH dealers offer same-day approval and allow you to drive home in your new vehicle the same day you apply. Additionally, several dealerships in the area report your payment history to credit bureaus, which means making on-time payments can help you rebuild your credit over time.`,
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white">
        <div className="container-custom py-12 md:py-16">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: city.state_name, href: `/dealers/${city.state_slug}/` },
              { label: city.city_name },
            ]}
          />
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Buy Here Pay Here Dealers in {city.city_name}, {city.state_abbreviation}
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            Browse {dealers.length} trusted BHPH dealerships in {city.city_name},{" "}
            {city.state_name}. All dealers offer in-house financing for buyers
            with all credit types.
          </p>
        </div>
      </section>

      {/* Dealer Cards */}
      <section className="bg-gray-50">
        <div className="container-custom py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            BHPH Dealers in {city.city_name}
          </h2>
          {dealers.length > 0 ? (
            <div className="space-y-4">
              {dealers.map((dealer) => (
                <div
                  key={dealer.slug}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {dealer.name}
                      </h3>
                      <div className="space-y-2 mb-4">
                        {dealer.address && (
                          <div className="flex items-start gap-2 text-sm text-gray-600">
                            <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{dealer.address}</span>
                          </div>
                        )}
                        {dealer.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>{dealer.phone}</span>
                          </div>
                        )}
                      </div>
                      {dealer.description && (
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">
                          {dealer.description.length > 200
                            ? dealer.description.substring(0, 200) + "..."
                            : dealer.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {["In-House Financing", "All Credit Types", "Quick Approval", "Quality Vehicles"].map((feature) => (
                          <span
                            key={feature}
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 md:items-end flex-shrink-0">
                      <Link
                        href={`/dealer/${dealer.slug}/${stateSlug}/${citySlug}/`}
                        className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        View Details
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                      {dealer.phone && (
                        <a
                          href={`tel:${dealer.phone.replace(/[^0-9]/g, "")}`}
                          className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 font-semibold px-6 py-2.5 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          Call Now
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-gray-600 font-medium mb-1">
                Dealer listings coming soon
              </p>
              <p className="text-sm text-gray-500">
                We&apos;re currently adding detailed dealer listings for {city.city_name},{" "}
                {city.state_abbreviation}. Check back soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* SEO Content */}
      <section className="bg-white">
        <div className="container-custom py-12">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              About BHPH Dealers in {city.city_name}, {city.state_abbreviation}
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              {seoContent.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What to Bring */}
      <section className="bg-gray-50">
        <div className="container-custom py-12">
          <div className="max-w-3xl">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              What to Bring When Visiting a BHPH Dealer in {city.city_name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { item: "Valid Driver's License", desc: "A current, non-expired state-issued ID" },
                { item: "Proof of Income", desc: "Recent pay stubs or bank statements" },
                { item: "Proof of Residence", desc: "Utility bill, lease, or bank statement" },
                { item: "Down Payment", desc: "Cash, debit card, or certified check" },
                { item: "References", desc: "Names and phone numbers of personal references" },
                { item: "Insurance Info", desc: "Current insurance card or policy number" },
              ].map((doc) => (
                <div
                  key={doc.item}
                  className="flex items-start gap-3 bg-white rounded-lg border border-gray-200 p-4"
                >
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{doc.item}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{doc.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Back to State */}
      <section className="bg-white">
        <div className="container-custom py-8">
          <Link
            href={`/dealers/${city.state_slug}/`}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            View all cities in {city.state_name}
          </Link>
        </div>
      </section>
    </>
  );
}
