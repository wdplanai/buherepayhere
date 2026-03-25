import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import SearchBar from "@/components/SearchBar";
import { getStateBySlug, getCitiesByState, getAllStates } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;
export const dynamicParams = true;

/** Maximum cities to render in the initial server HTML to keep page size under 2 MB. */
const MAX_CITIES_RENDERED = 300;

interface StatePageProps {
  params: Promise<{ stateSlug: string }>;
}

export async function generateMetadata({ params }: StatePageProps): Promise<Metadata> {
  const { stateSlug } = await params;
  const state = await getStateBySlug(stateSlug);
  if (!state) return {};
  return buildMetadata({
    title: `BHPH Dealers in ${state.state_name} | BuyHerePayHere.io`,
    description: `Find ${state.dealer_count} buy here pay here car dealers in ${state.state_name}. Browse cities and get approved for in-house financing with bad credit or no credit.`,
    path: `/dealers/${stateSlug}/`,
  });
}

export default async function StatePage({ params }: StatePageProps) {
  const { stateSlug } = await params;
  const [state, cities, allStates] = await Promise.all([
    getStateBySlug(stateSlug),
    getCitiesByState(stateSlug),
    getAllStates(),
  ]);

  if (!state) notFound();

  const otherStates = allStates.filter((s) => s.state_slug !== stateSlug).slice(0, 12);

  const topCityNames = cities.slice(0, 5).map((c) => c.city_name).join(", ");

  /* Split cities: render the first batch in HTML, show the rest behind a
     lightweight alphabetical index so crawlers still see every link but the
     initial HTML stays well under 2 MB. */
  const visibleCities = cities.slice(0, MAX_CITIES_RENDERED);
  const remainingCities = cities.slice(MAX_CITIES_RENDERED);
  const hasMore = remainingCities.length > 0;

  /* Group remaining cities by first letter for a compact alphabetical list */
  const remainingByLetter: Record<string, typeof remainingCities> = {};
  for (const c of remainingCities) {
    const letter = c.city_name.charAt(0).toUpperCase();
    (remainingByLetter[letter] ??= []).push(c);
  }

  const seoContent = [
    `${state.state_name} has a robust network of Buy Here Pay Here dealerships serving drivers across the state who may be facing credit challenges. With ${state.dealer_count} BHPH dealers spread across ${state.city_count} cities including ${topCityNames}, residents throughout ${state.state_name} have access to in-house financing options that make vehicle ownership possible regardless of credit history. These dealerships understand that a low credit score does not define your ability to make regular payments, and they work with you to find a vehicle and payment plan that fits your budget.`,
    `Buy Here Pay Here financing in ${state.state_name} simplifies the car-buying process. Instead of applying through a third-party bank or credit union, you work directly with the dealership. This means faster approvals, more flexible terms, and a more personal experience. Many ${state.state_name} BHPH dealers also report your payments to credit bureaus, giving you an opportunity to rebuild your credit while driving a reliable vehicle.`,
    `When shopping for a BHPH dealer in ${state.state_name}, it is important to do your research. Look for dealerships with positive customer reviews, transparent pricing, and a solid selection of inspected vehicles. The best dealers in the state will walk you through every step of the process, from choosing your car to understanding your payment schedule. Use our directory to find a trusted BHPH dealer near you in ${state.state_name}.`,
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white">
        <div className="container-custom py-12 md:py-16">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: state.state_name },
            ]}
          />
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Buy Here Pay Here Dealers in {state.state_name}
          </h1>
          <p className="text-blue-100 text-lg mb-6 max-w-2xl">
            Find trusted BHPH dealerships across {state.state_name} with in-house
            financing for all credit types. Browse {state.dealer_count} dealers
            in {state.city_count} cities.
          </p>
          <div className="max-w-lg">
            <SearchBar placeholder={`Search cities in ${state.state_name}...`} />
          </div>
        </div>
      </section>

      {/* Cities Grid */}
      <section className="bg-white">
        <div className="container-custom py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Browse BHPH Dealers by City in {state.state_name}
          </h2>
          {cities.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {visibleCities.map((city) => (
                  <Link
                    key={city.city_slug}
                    href={`/dealers/${state.state_slug}/${city.city_slug}/`}
                    className="group flex items-center justify-between bg-white rounded-lg border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                  >
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {city.city_name}
                      </div>
                      <div className="text-sm text-gray-500 mt-0.5">
                        {city.dealer_count > 0
                          ? `${city.dealer_count} ${city.dealer_count === 1 ? "dealer" : "dealers"} available`
                          : "No dealers yet"}
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                ))}
              </div>

              {/* Compact alphabetical index for remaining cities */}
              {hasMore && (
                <div className="mt-10">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    More Cities in {state.state_name} ({remainingCities.length})
                  </h3>
                  <div className="space-y-4">
                    {Object.keys(remainingByLetter).sort().map((letter) => (
                      <div key={letter}>
                        <h4 className="text-sm font-bold text-blue-600 mb-1">{letter}</h4>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          {remainingByLetter[letter].map((city) => (
                            <Link
                              key={city.city_slug}
                              href={`/dealers/${state.state_slug}/${city.city_slug}/`}
                              className="text-sm text-gray-600 hover:text-blue-600 hover:underline"
                            >
                              {city.city_name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-600 font-medium mb-1">
                City listings coming soon
              </p>
              <p className="text-sm text-gray-500">
                We&apos;re currently adding detailed city-level listings for{" "}
                {state.state_name}. Check back soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* State Stats */}
      <section className="bg-gray-50">
        <div className="container-custom py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="text-2xl font-bold text-blue-600">{state.dealer_count}</div>
              <div className="text-sm text-gray-500 mt-1">Total Dealers</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="text-2xl font-bold text-blue-600">{state.city_count}</div>
              <div className="text-sm text-gray-500 mt-1">Cities Covered</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="text-2xl font-bold text-blue-600">All Credit</div>
              <div className="text-sm text-gray-500 mt-1">Types Welcome</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="text-2xl font-bold text-blue-600">In-House</div>
              <div className="text-sm text-gray-500 mt-1">Financing Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="bg-white">
        <div className="container-custom py-12">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              About Buy Here Pay Here Dealers in {state.state_name}
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              {seoContent.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Other States */}
      <section className="bg-gray-50">
        <div className="container-custom py-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Browse BHPH Dealers in Other States
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {otherStates.map((s) => (
              <Link
                key={s.state_slug}
                href={`/dealers/${s.state_slug}/`}
                className="group bg-white rounded-lg border border-gray-200 p-3 hover:border-blue-300 hover:shadow-sm transition-all duration-200 text-center"
              >
                <div className="font-medium text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                  {s.state_name}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {s.dealer_count} dealers
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link
              href="/#browse-states"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
            >
              View all 50 states &rarr;
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
