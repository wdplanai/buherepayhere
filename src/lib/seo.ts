import type { Metadata } from "next";

const BASE_URL = "https://www.buyherepayhere.io";
const SITE_NAME = "BuyHerePayHere.io";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-default.png`;

/**
 * Truncate a title to fit within the recommended SEO limit.
 * Cuts at the last full word before the limit and appends an ellipsis if needed.
 */
export function truncateTitle(title: string, maxLength = 60): string {
  if (title.length <= maxLength) return title;
  const truncated = title.substring(0, maxLength - 1);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 20 ? truncated.substring(0, lastSpace) : truncated) + "…";
}

/**
 * Build a complete Metadata object with OG and Twitter card tags.
 */
export function buildMetadata({
  title,
  description,
  path,
  ogImage,
}: {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
}): Metadata {
  const seoTitle = truncateTitle(title);
  const url = `${BASE_URL}${path}`;
  const image = ogImage || DEFAULT_OG_IMAGE;

  return {
    title: seoTitle,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: seoTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: seoTitle,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description,
      images: [image],
    },
  };
}
