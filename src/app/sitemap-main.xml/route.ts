import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const dynamic = "force-dynamic";

const BASE_URL = "https://buyherepayhere.io";

function urlEntry(loc: string, priority: string, changefreq: string, lastmod: string) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export async function GET() {
  const now = new Date().toISOString();

  const [statesResult, dealersResult] = await Promise.all([
    pool.query<{ state_slug: string }>(
      "SELECT DISTINCT state_slug FROM locations ORDER BY state_slug"
    ),
    pool.query<{ slug: string; state_slug: string; city_slug: string }>(
      "SELECT slug, state_slug, city_slug FROM dealers ORDER BY state_slug, city_slug, slug"
    ),
  ]);

  const urls: string[] = [];

  // Homepage
  urls.push(urlEntry(`${BASE_URL}/`, "1.0", "daily", now));

  // State pages
  for (const state of statesResult.rows) {
    urls.push(urlEntry(`${BASE_URL}/dealers/${state.state_slug}/`, "0.9", "weekly", now));
  }

  // Dealer pages
  for (const dealer of dealersResult.rows) {
    urls.push(
      urlEntry(
        `${BASE_URL}/dealer/${dealer.slug}/${dealer.state_slug}/${dealer.city_slug}/`,
        "0.7",
        "monthly",
        now
      )
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
