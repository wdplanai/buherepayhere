import Link from "next/link";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import ClaimListingForm from "@/components/ClaimListingForm";
import { getDealerBySlug } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";

const DealerMap = dynamic(() => import("@/components/DealerMap"), {
  ssr: false,
  loading: () => (
    <div className="h-56 w-full rounded-lg border border-gray-200 bg-gray-100 animate-pulse" />
  ),
});

export const revalidate = 3600;

interface DealerPageProps {
  params: Promise<{ stateSlug: string; citySlug: string; dealerSlug: string }>;
}

export async function generateMetadata({ params }: DealerPageProps): Promise<Metadata> {
  const { stateSlug, citySlug, dealerSlug } = await params;
  const dealer = await getDealerBySlug(stateSlug, citySlug, dealerSlug);
  if (!dealer) return {};
  const phoneSnippet = dealer.phone ? ` ${dealer.phone}.` : "";
  return buildMetadata({
    title: `${dealer.name} - BHPH in ${dealer.city_name}, ${dealer.state_abbreviation}`,
    description: `${dealer.name} is a buy here pay here dealership in ${dealer.city_name}, ${dealer.state_name}. Get in-house financing with bad credit.${phoneSnippet}`,
    path: `/dealer/${dealerSlug}/${stateSlug}/${citySlug}/`,
  });
}

export default async function DealerPage({ params }: DealerPageProps) {
  const { stateSlug, citySlug, dealerSlug } = await params;
  const dealer = await getDealerBySlug(stateSlug, citySlug, dealerSlug);
  if (!dealer) notFound();

  const displayAddress = dealer.address || `${dealer.city_name}, ${dealer.state_abbreviation}`;
  const displayPhone = dealer.phone || "Call for current phone number";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayAddress)}`;

  const features = [
    "In-House Financing",
    "All Credit Types Welcome",
    "No Credit Check Required",
    "Quick Same-Day Approval",
    "Flexible Payment Plans",
    "Quality Inspected Vehicles",
    "Trade-Ins Accepted",
    "Warranty Options Available",
  ];

  const whatToExpect = [
    `When you arrive at ${dealer.name}, you will be greeted by a friendly team ready to help you find the right vehicle. No appointment is necessary — walk-ins are always welcome.`,
    "Bring your valid driver's license, proof of income (recent pay stubs or bank statements), proof of residence (a utility bill or lease agreement), and your down payment. Having these documents ready will speed up the approval process.",
    "Browse the available inventory and take your time test-driving vehicles that interest you. The sales team can help you find options that fit both your needs and your budget.",
    "Once you have chosen a vehicle, the in-house financing team will work with you to create a payment plan that fits your financial situation. Approval is typically fast, and many customers drive home the same day.",
  ];

  const fullDescription = dealer.description
    ? dealer.description
    : `${dealer.name} is a trusted Buy Here Pay Here dealership located in ${dealer.city_name}, ${dealer.state_name}. Specializing in in-house financing, ${dealer.name} helps drivers with all types of credit situations get behind the wheel of a reliable vehicle. Whether you have bad credit, no credit, or have experienced a bankruptcy or repossession, the team at ${dealer.name} is committed to finding a financing solution that works for you.`;

  // Parse hours or use defaults
  let hours = { weekdays: "9:00 AM - 6:00 PM", saturday: "9:00 AM - 5:00 PM", sunday: "Closed" };
  if (dealer.business_hours) {
    try {
      const parsed = JSON.parse(dealer.business_hours);
      if (parsed.weekdays) hours = parsed;
    } catch {
      // use defaults
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white">
        <div className="container-custom py-10 md:py-14">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: dealer.state_name, href: `/dealers/${dealer.state_slug}/` },
              {
                label: dealer.city_name,
                href: `/dealers/${dealer.state_slug}/${dealer.city_slug}/`,
              },
              { label: dealer.name },
            ]}
          />
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{dealer.name}</h1>
          <p className="text-blue-100 text-lg">
            Buy Here Pay Here Dealer in {dealer.city_name},{" "}
            {dealer.state_abbreviation}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-gray-50">
        <div className="container-custom py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  About {dealer.name}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {fullDescription}
                </p>
              </div>

              {/* Features */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Features &amp; Services
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2.5">
                      <svg
                        className="w-5 h-5 text-green-500 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What to Expect */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  What to Expect
                </h2>
                <div className="space-y-4">
                  {whatToExpect.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">
                          {index + 1}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed pt-1">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-20">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Contact Information
                </h3>

                <div className="space-y-4 mb-6">
                  {/* Address */}
                  <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">Address</div>
                        <div className="text-sm text-gray-700">{displayAddress}</div>
                      </div>
                    </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div>
                        <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">Phone</div>
                        {dealer.phone ? (
                          <a href={`tel:${dealer.phone.replace(/[^0-9]/g, "")}`} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                            {displayPhone}
                          </a>
                        ) : (
                          <span className="text-sm text-gray-600">{displayPhone}</span>
                        )}
                      </div>
                    </div>

                  {/* Website */}
                  {dealer.website && (
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      <div>
                        <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">Website</div>
                        <a href={dealer.website.startsWith("http") ? dealer.website : `https://${dealer.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800 font-medium break-all">
                          {dealer.website.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Hours */}
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Hours</div>
                      <div className="text-sm text-gray-700 space-y-0.5">
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-500">Mon - Fri:</span>
                          <span className="font-medium">{hours.weekdays}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-500">Saturday:</span>
                          <span className="font-medium">{hours.saturday}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-500">Sunday:</span>
                          <span className="font-medium">{hours.sunday}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  {dealer.phone ? (
                    <a
                      href={`tel:${dealer.phone.replace(/[^0-9]/g, "")}`}
                      className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Call {dealer.phone}
                    </a>
                  ) : (
                    <div className="w-full rounded-lg bg-blue-50 text-blue-800 text-sm font-medium py-3 px-4 text-center border border-blue-100">
                      Contact details available on request
                    </div>
                  )}
                  <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-white text-blue-600 font-semibold py-3 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Get Directions
                    </a>
                </div>

                {/* Map */}
                {dealer.latitude && dealer.longitude && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Location Map
                    </h4>
                    <DealerMap
                      name={dealer.name}
                      address={dealer.address || ""}
                      latitude={dealer.latitude}
                      longitude={dealer.longitude}
                    />
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium mt-3 hover:underline"
                    >
                      View on Google Maps
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}

                {/* Trust Badge */}
                <div className="mt-6 pt-5 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Listed on BuyHerePayHere.io
                  </div>
                </div>

                {/* Claim Listing */}
                <ClaimListingForm
                  dealerName={dealer.name}
                  dealerSlug={dealer.slug}
                  stateSlug={dealer.state_slug}
                  citySlug={dealer.city_slug}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back Link */}
      <section className="bg-white">
        <div className="container-custom py-8">
          <Link
            href={`/dealers/${dealer.state_slug}/${dealer.city_slug}/`}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to all dealers in {dealer.city_name}, {dealer.state_abbreviation}
          </Link>
        </div>
      </section>
    </>
  );
}
