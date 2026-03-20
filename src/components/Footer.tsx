import Link from "next/link";
import { states } from "@/data/states";

export default function Footer() {
  const popularStates = states.filter((s) =>
    ["texas", "florida", "california", "georgia", "ohio", "north-carolina", "tennessee", "alabama"].includes(s.slug)
  );

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <span className="text-lg font-bold text-white">
                BuyHerePayHere<span className="text-blue-400">.io</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              The most comprehensive directory of Buy Here Pay Here dealerships
              in the United States. Find trusted BHPH dealers near you with
              in-house financing for all credit situations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#browse-states" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Browse by State
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#what-is-bhph" className="text-sm text-gray-400 hover:text-white transition-colors">
                  What is BHPH?
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular States */}
          <div>
            <h3 className="text-white font-semibold mb-4">Popular States</h3>
            <ul className="space-y-2">
              {popularStates.map((state) => (
                <li key={state.slug}>
                  <Link
                    href={`/dealers/${state.slug}/`}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {state.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Information</h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-400">
                <span className="block font-medium text-gray-300">Need Help?</span>
                This is a directory service. Contact dealers directly for financing inquiries.
              </li>
              <li className="text-sm text-gray-400 pt-2">
                <span className="block font-medium text-gray-300">Disclaimer</span>
                Dealer information is provided for reference. Verify details directly with dealerships.
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} BuyHerePayHere.io. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            A directory of Buy Here Pay Here dealerships across the United States.
          </p>
        </div>
      </div>
    </footer>
  );
}
