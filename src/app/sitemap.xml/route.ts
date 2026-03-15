import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BASE_URL = "https://buyherepayhere.io";

export async function GET() {
  const sitemaps = [
    `${BASE_URL}/sitemap-main.xml`,
    `${BASE_URL}/sitemap-cities-1.xml`,
    `${BASE_URL}/sitemap-cities-2.xml`,
    `${BASE_URL}/sitemap-cities-3.xml`,
    `${BASE_URL}/sitemap-cities-4.xml`,
    `${BASE_URL}/sitemap-cities-5.xml`,
    `${BASE_URL}/sitemap-cities-6.xml`,
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map((url) => `  <sitemap>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`).join("\n")}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
