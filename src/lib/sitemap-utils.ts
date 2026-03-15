import { NextResponse } from "next/server";
import pool from "@/lib/db";

const BASE_URL = "https://buyherepayhere.io";
const CITIES_PER_SITEMAP = 5000;

export async function generateCitySitemap(pageNum: number) {
  const offset = (pageNum - 1) * CITIES_PER_SITEMAP;
  const now = new Date().toISOString();

  const { rows } = await pool.query<{ state_slug: string; city_slug: string }>(
    "SELECT state_slug, city_slug FROM locations ORDER BY id LIMIT $1 OFFSET $2",
    [CITIES_PER_SITEMAP, offset]
  );

  const urls = rows.map(
    (city) => `  <url>
    <loc>${BASE_URL}/dealers/${city.state_slug}/${city.city_slug}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  );

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
