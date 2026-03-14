import type { MetadataRoute } from "next";
import pool from "@/lib/db";

const BASE_URL = "https://buyherepayhere.io";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [statesResult, citiesResult, dealersResult] = await Promise.all([
    pool.query<{
      state_slug: string;
      updated_at?: string | Date | null;
    }>(`
      SELECT state_slug, MAX(updated_at) AS updated_at
      FROM dealers
      GROUP BY state_slug
      ORDER BY state_slug
    `),
    pool.query<{
      state_slug: string;
      city_slug: string;
      updated_at?: string | Date | null;
    }>(`
      SELECT state_slug, city_slug, MAX(updated_at) AS updated_at
      FROM dealers
      GROUP BY state_slug, city_slug
      ORDER BY state_slug, city_slug
    `),
    pool.query<{
      slug: string;
      state_slug: string;
      city_slug: string;
      updated_at?: string | Date | null;
    }>(`
      SELECT slug, state_slug, city_slug, updated_at
      FROM dealers
      ORDER BY state_slug, city_slug, slug
    `),
  ]);

  const homepage: MetadataRoute.Sitemap[number] = {
    url: `${BASE_URL}/`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 1,
  };

  const stateUrls: MetadataRoute.Sitemap = statesResult.rows.map((state) => ({
    url: `${BASE_URL}/dealers/${state.state_slug}/`,
    lastModified: state.updated_at ? new Date(state.updated_at) : now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const cityUrls: MetadataRoute.Sitemap = citiesResult.rows.map((city) => ({
    url: `${BASE_URL}/dealers/${city.state_slug}/${city.city_slug}/`,
    lastModified: city.updated_at ? new Date(city.updated_at) : now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const dealerUrls: MetadataRoute.Sitemap = dealersResult.rows.map((dealer) => ({
    url: `${BASE_URL}/dealer/${dealer.slug}/${dealer.state_slug}/${dealer.city_slug}/`,
    lastModified: dealer.updated_at ? new Date(dealer.updated_at) : now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [homepage, ...stateUrls, ...cityUrls, ...dealerUrls];
}
