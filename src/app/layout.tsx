import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.buyherepayhere.io"),
  title: {
    default: "Find BHPH Dealers Near You | BuyHerePayHere.io",
    template: "%s",
  },
  description:
    "Find trusted Buy Here Pay Here dealers in your area. In-house financing for all credit types. Browse BHPH dealerships by state and city across the United States.",
  openGraph: {
    siteName: "BuyHerePayHere.io",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "BuyHerePayHere.io - Find Buy Here Pay Here Dealers Near You",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-default.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-800 antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
