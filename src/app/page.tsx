import Link from "next/link";
import type { Metadata } from "next";
import SearchBar from "@/components/SearchBar";
import { getAllStates } from "@/lib/db";

export const revalidate = 3600; // ISR: revalidate every hour

export const metadata: Metadata = {
  title: "Find Buy Here Pay Here Dealers Near You | BuyHerePayHere.io",
  description:
    "Browse 2,699 trusted buy here pay here dealerships across all 50 states. Get approved for in-house financing regardless of your credit history.",
};

export default async function HomePage() {
  const states = await getAllStates();
  const totalDealers = states.reduce((sum, s) => sum + s.dealer_count, 0);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white">
        <div className="container-custom py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              Find Buy Here Pay Here Dealers Near You
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
              Browse trusted BHPH dealerships across the United States. Get
              approved for in-house financing regardless of your credit history.
            </p>
            <SearchBar
              large
              placeholder="Search by city or state (e.g., Birmingham, Alabama)"
            />
            <p className="text-sm text-blue-200 mt-4">
              Over {totalDealers.toLocaleString()} Buy Here Pay Here dealerships listed across all 50 states
            </p>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="container-custom py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-blue-600">{totalDealers.toLocaleString()}+</div>
              <div className="text-sm text-gray-500 mt-1">Dealers Listed</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-blue-600">{states.length}</div>
              <div className="text-sm text-gray-500 mt-1">States Covered</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-blue-600">100%</div>
              <div className="text-sm text-gray-500 mt-1">Free to Use</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-blue-600">All Credit</div>
              <div className="text-sm text-gray-500 mt-1">Types Welcome</div>
            </div>
          </div>
        </div>
      </section>

      {/* What is BHPH Section */}
      <section id="what-is-bhph" className="bg-white">
        <div className="container-custom py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
              What is Buy Here Pay Here?
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                <strong className="text-gray-800">Buy Here Pay Here (BHPH)</strong> is a type of car
                dealership that provides in-house financing directly to the
                buyer. Unlike traditional dealerships that rely on third-party
                banks or credit unions to approve your loan, BHPH dealers act as
                both the seller and the lender. This means the dealership itself
                finances your vehicle purchase, and you make your payments
                directly to them.
              </p>
              <p>
                BHPH dealerships are especially helpful for people who have been
                turned down for traditional auto loans due to{" "}
                <strong className="text-gray-800">bad credit, no credit, bankruptcy, or repossession</strong>.
                Because the dealer handles the financing in-house, they can be
                more flexible with approval requirements. Many BHPH dealers focus
                primarily on your current ability to make payments — such as your
                income and employment stability — rather than your credit score
                alone.
              </p>
              <p>
                While BHPH financing typically comes with higher interest rates
                than traditional auto loans, it provides a valuable path to
                vehicle ownership for people who might otherwise have no options.
                Many BHPH dealers also report your payments to credit bureaus,
                which means making consistent, on-time payments can help you{" "}
                <strong className="text-gray-800">rebuild your credit over time</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by State Section */}
      <section id="browse-states" className="bg-gray-50">
        <div className="container-custom py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Browse BHPH Dealers by State
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Select your state to find Buy Here Pay Here dealerships near you.
              Every state has dealers ready to help you get on the road.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {states.map((state) => (
              <Link
                key={state.state_slug}
                href={`/dealers/${state.state_slug}/`}
                className="group bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200"
              >
                <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                  {state.state_name}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {state.dealer_count} dealers
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-white">
        <div className="container-custom py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Getting a vehicle through a Buy Here Pay Here dealer is simpler
              than you might think. Here&apos;s what to expect.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Find a Dealer",
                description:
                  "Browse our directory to find Buy Here Pay Here dealers in your area. Compare options and read about each dealership.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                ),
              },
              {
                step: "2",
                title: "Visit the Lot",
                description:
                  "Bring your ID, proof of income, and proof of residence. Browse the inventory and test drive vehicles that interest you.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                ),
              },
              {
                step: "3",
                title: "Get Approved",
                description:
                  "BHPH dealers offer in-house financing, so approval is based on your income and ability to pay — not just your credit score.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                ),
              },
              {
                step: "4",
                title: "Drive Home",
                description:
                  "Once approved, you can often drive home the same day. Make your payments directly to the dealer on a schedule that works for you.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                ),
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {item.icon}
                  </svg>
                </div>
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
                  Step {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ / Tips Section */}
      <section className="bg-gray-50">
        <div className="container-custom py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              Tips for Buying from a BHPH Dealer
            </h2>
            <div className="space-y-4">
              {[
                {
                  question: "What documents do I need?",
                  answer:
                    "Most BHPH dealers require a valid driver's license, proof of income (recent pay stubs or bank statements), proof of residence (utility bill or lease agreement), and personal references. Some dealers may also ask for proof of insurance.",
                },
                {
                  question: "How much is the typical down payment?",
                  answer:
                    "Down payments at BHPH dealers vary but typically range from $500 to $2,000, depending on the vehicle and your financial situation. Some dealers offer lower down payments or may accept tax refunds as down payment.",
                },
                {
                  question: "Will my payments help rebuild my credit?",
                  answer:
                    "Many BHPH dealers report your payment history to one or more credit bureaus. Making consistent, on-time payments can help improve your credit score over time. Ask your dealer if they report to credit bureaus before purchasing.",
                },
                {
                  question: "What should I look for in a BHPH dealer?",
                  answer:
                    "Look for dealers with positive customer reviews, transparent pricing (no hidden fees), a solid selection of inspected vehicles, and clear payment terms. A good BHPH dealer will be upfront about everything and won't pressure you into a purchase.",
                },
                {
                  question: "Can I trade in my current vehicle?",
                  answer:
                    "Many BHPH dealers accept trade-ins, which can reduce your down payment or the overall cost of your new vehicle. Even if your current car isn't running, some dealers may still offer trade-in value.",
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 p-6"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom SEO Section */}
      <section className="bg-white">
        <div className="container-custom py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Your Guide to Buy Here Pay Here Dealerships
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                BuyHerePayHere.io is the most comprehensive online directory of
                Buy Here Pay Here dealerships in the United States. We help
                consumers find trusted BHPH dealers in their area by providing
                detailed listings organized by state and city. Our directory
                includes dealership information such as location, contact details,
                hours of operation, and the types of financing available.
              </p>
              <p>
                We understand that searching for a car when you have credit
                challenges can feel overwhelming. That&apos;s why we&apos;ve created a
                simple, easy-to-use resource that connects you with dealerships
                that specialize in helping people in exactly your situation. Buy
                Here Pay Here dealers exist specifically to serve customers who may
                not qualify for traditional financing, and they have years of
                experience helping people just like you get into reliable vehicles.
              </p>
              <p>
                Whether you&apos;re dealing with bad credit, no credit, a recent
                bankruptcy, or a previous repossession, the BHPH dealers in our
                directory can help. Many offer same-day approval, flexible payment
                schedules, and the opportunity to rebuild your credit through
                on-time payments. Use our search tool or browse by state to find a
                Buy Here Pay Here dealer near you today.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600">
        <div className="container-custom py-12">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Find a Dealer?
            </h2>
            <p className="text-blue-100 mb-6 max-w-xl mx-auto">
              Browse our directory of trusted Buy Here Pay Here dealerships and
              take the first step toward reliable transportation.
            </p>
            <Link
              href="#browse-states"
              className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Browse by State
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
