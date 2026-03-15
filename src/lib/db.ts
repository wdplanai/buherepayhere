import { Pool } from "pg";

function extractAddressFromDescription(description: string | null | undefined): string {
  if (!description) return "";
  const cleaned = description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
  const match = cleaned.match(/business address of .*? is ([^.]+(?:USA|,\s*[A-Z]{2}\s*\d{5}))/i);
  return match ? match[1].trim().replace(/\s+/g, " ") : "";
}

function extractPhoneFromDescription(description: string | null | undefined): string {
  if (!description) return "";
  const cleaned = description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
  const match = cleaned.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  return match ? match[0].trim() : "";
}

function fallbackCoordsForState(stateAbbr: string | null | undefined): { latitude: number; longitude: number } | null {
  const centers: Record<string, [number, number]> = {
    AL: [32.806671, -86.79113], AK: [61.370716, -152.404419], AZ: [33.729759, -111.431221], AR: [34.969704, -92.373123],
    CA: [36.116203, -119.681564], CO: [39.059811, -105.311104], CT: [41.597782, -72.755371], DE: [39.318523, -75.507141],
    FL: [27.766279, -81.686783], GA: [33.040619, -83.643074], HI: [21.094318, -157.498337], ID: [44.240459, -114.478828],
    IL: [40.349457, -88.986137], IN: [39.849426, -86.258278], IA: [42.011539, -93.210526], KS: [38.5266, -96.726486],
    KY: [37.66814, -84.670067], LA: [31.169546, -91.867805], ME: [44.693947, -69.381927], MD: [39.063946, -76.802101],
    MA: [42.230171, -71.530106], MI: [43.326618, -84.536095], MN: [45.694454, -93.900192], MS: [32.741646, -89.678696],
    MO: [38.456085, -92.288368], MT: [46.921925, -110.454353], NE: [41.12537, -98.268082], NV: [38.313515, -117.055374],
    NH: [43.452492, -71.563896], NJ: [40.298904, -74.521011], NM: [34.840515, -106.248482], NY: [42.165726, -74.948051],
    NC: [35.630066, -79.806419], ND: [47.528912, -99.784012], OH: [40.388783, -82.764915], OK: [35.565342, -96.928917],
    OR: [44.572021, -122.070938], PA: [40.590752, -77.209755], RI: [41.680893, -71.51178], SC: [33.856892, -80.945007],
    SD: [44.299782, -99.438828], TN: [35.747845, -86.692345], TX: [31.054487, -97.563461], UT: [40.150032, -111.862434],
    VT: [44.045876, -72.710686], VA: [37.769337, -78.169968], WA: [47.400902, -121.490494], WV: [38.491226, -80.954453],
    WI: [44.268543, -89.616508], WY: [42.755966, -107.30249], DC: [38.907192, -77.036871],
  };
  const key = (stateAbbr || "").toUpperCase();
  const coords = centers[key];
  return coords ? { latitude: coords[0], longitude: coords[1] } : null;
}

function withDealerFallbacks<T extends DealerRow>(dealer: T): T {
  const address = dealer.address || extractAddressFromDescription(dealer.description);
  const phone = dealer.phone || extractPhoneFromDescription(dealer.description);
  const coords = dealer.latitude && dealer.longitude ? { latitude: dealer.latitude, longitude: dealer.longitude } : fallbackCoordsForState(dealer.state_abbreviation);
  return {
    ...dealer,
    address,
    phone,
    latitude: coords?.latitude ?? dealer.latitude,
    longitude: coords?.longitude ?? dealer.longitude,
  };
}

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://neondb_owner:npg_D4bExU3VNpXm@ep-crimson-art-am2kftpx-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require",
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export default pool;

// ─── State-level queries ───────────────────────────────────────────

export interface StateInfo {
  state_name: string;
  state_slug: string;
  state_abbreviation: string;
  dealer_count: number;
  city_count: number;
}

/** All states with aggregated dealer and city counts (from locations table) */
export async function getAllStates(): Promise<StateInfo[]> {
  const { rows } = await pool.query<StateInfo>(`
    SELECT
      l.state_name,
      l.state_slug,
      l.state_abbreviation,
      COALESCE(SUM(l.dealer_count), 0)::int AS dealer_count,
      COUNT(*)::int AS city_count
    FROM locations l
    GROUP BY l.state_name, l.state_slug, l.state_abbreviation
    ORDER BY l.state_name
  `);
  return rows;
}

/** Single state info (from locations table) */
export async function getStateBySlug(
  stateSlug: string
): Promise<StateInfo | null> {
  const { rows } = await pool.query<StateInfo>(
    `SELECT
       l.state_name,
       l.state_slug,
       l.state_abbreviation,
       COALESCE(SUM(l.dealer_count), 0)::int AS dealer_count,
       COUNT(*)::int AS city_count
     FROM locations l
     WHERE l.state_slug = $1
     GROUP BY l.state_name, l.state_slug, l.state_abbreviation`,
    [stateSlug]
  );
  return rows[0] ?? null;
}

// ─── City-level queries ────────────────────────────────────────────

export interface CityInfo {
  city_name: string;
  city_slug: string;
  state_name: string;
  state_slug: string;
  state_abbreviation: string;
  dealer_count: number;
  latitude?: number | null;
  longitude?: number | null;
}

export interface NearbyCityInfo {
  city_name: string;
  city_slug: string;
  state_name: string;
  state_slug: string;
  state_abbreviation: string;
  dealer_count: number;
  distance_miles: number;
}

/** All cities within a state (from locations table - includes 0-dealer cities) */
export async function getCitiesByState(
  stateSlug: string
): Promise<CityInfo[]> {
  const { rows } = await pool.query<CityInfo>(
    `SELECT
       l.city_name,
       l.city_slug,
       l.state_name,
       l.state_slug,
       l.state_abbreviation,
       l.dealer_count
     FROM locations l
     WHERE l.state_slug = $1
     ORDER BY l.dealer_count DESC, l.city_name ASC`,
    [stateSlug]
  );
  return rows;
}

/** Single city info (from locations table - works for 0-dealer cities too) */
export async function getCityBySlug(
  stateSlug: string,
  citySlug: string
): Promise<CityInfo | null> {
  const { rows } = await pool.query<CityInfo>(
    `SELECT
       l.city_name,
       l.city_slug,
       l.state_name,
       l.state_slug,
       l.state_abbreviation,
       l.dealer_count,
       CAST(NULL AS double precision) AS latitude,
       CAST(NULL AS double precision) AS longitude
     FROM locations l
     WHERE l.state_slug = $1 AND l.city_slug = $2
     LIMIT 1`,
    [stateSlug, citySlug]
  );
  return rows[0] ?? null;
}

/** Five geographically nearest cities based on imported location coordinates. */
export async function getNearbyCities(
  stateSlug: string,
  citySlug: string,
  limit = 5
): Promise<NearbyCityInfo[]> {
  const safeLimit = Math.max(1, Math.min(limit, 5));

  const target = await pool.query<{
    state_name: string;
    state_slug: string;
    state_abbreviation: string;
    city_name: string;
    city_slug: string;
    latitude: number | null;
    longitude: number | null;
  }>(
    `SELECT
       l.state_name,
       l.state_slug,
       l.state_abbreviation,
       l.city_name,
       l.city_slug,
       coords.latitude,
       coords.longitude
     FROM locations l
     LEFT JOIN LATERAL (
       SELECT src.lat::double precision AS latitude, src.lng::double precision AS longitude
       FROM (
         SELECT DISTINCT ON (city_slug, state_abbreviation)
           city_slug,
           state_abbreviation,
           NULLIF(lat, '') AS lat,
           NULLIF(lng, '') AS lng
         FROM cities_source_data
         WHERE city_slug = l.city_slug
           AND state_abbreviation = l.state_abbreviation
           AND NULLIF(lat, '') IS NOT NULL
           AND NULLIF(lng, '') IS NOT NULL
       ) src
     ) coords ON true
     WHERE l.state_slug = $1 AND l.city_slug = $2
     LIMIT 1`,
    [stateSlug, citySlug]
  ).catch(async () => {
    const fallback = await pool.query<{
      state_name: string;
      state_slug: string;
      state_abbreviation: string;
      city_name: string;
      city_slug: string;
    }>(
      `SELECT state_name, state_slug, state_abbreviation, city_name, city_slug
       FROM locations
       WHERE state_slug = $1 AND city_slug = $2
       LIMIT 1`,
      [stateSlug, citySlug]
    );
    return { rows: fallback.rows.map((row) => ({ ...row, latitude: null, longitude: null })) };
  });

  const currentCity = target.rows[0];
  if (!currentCity) return [];

  let currentLatitude = currentCity.latitude;
  let currentLongitude = currentCity.longitude;

  if (currentLatitude == null || currentLongitude == null) {
    const coordsFromCsv = await pool.query<{ latitude: number; longitude: number }>(
      `SELECT src.lat::double precision AS latitude, src.lng::double precision AS longitude
       FROM cities_source_data src
       WHERE src.state_abbreviation = $1 AND src.city_slug = $2
         AND NULLIF(src.lat, '') IS NOT NULL
         AND NULLIF(src.lng, '') IS NOT NULL
       ORDER BY src.population DESC NULLS LAST, src.city_name ASC
       LIMIT 1`,
      [currentCity.state_abbreviation, currentCity.city_slug]
    ).catch(() => ({ rows: [] as { latitude: number; longitude: number }[] }));

    if (coordsFromCsv.rows[0]) {
      currentLatitude = coordsFromCsv.rows[0].latitude;
      currentLongitude = coordsFromCsv.rows[0].longitude;
    }
  }

  if (currentLatitude == null || currentLongitude == null) {
    return [];
  }

  const { rows } = await pool.query<NearbyCityInfo>(
    `WITH city_coords AS (
       SELECT DISTINCT ON (l.state_slug, l.city_slug)
         l.city_name,
         l.city_slug,
         l.state_name,
         l.state_slug,
         l.state_abbreviation,
         l.dealer_count,
         src.lat::double precision AS latitude,
         src.lng::double precision AS longitude
       FROM locations l
       JOIN cities_source_data src
         ON src.city_slug = l.city_slug
        AND src.state_abbreviation = l.state_abbreviation
       WHERE NULLIF(src.lat, '') IS NOT NULL
         AND NULLIF(src.lng, '') IS NOT NULL
         AND (
           l.state_slug = $1 OR
           src.lat::double precision BETWEEN $2 - 3.5 AND $2 + 3.5
           AND src.lng::double precision BETWEEN $3 - 3.5 AND $3 + 3.5
         )
       ORDER BY l.state_slug, l.city_slug, src.population DESC NULLS LAST, l.city_name ASC
     )
     SELECT
       city_name,
       city_slug,
       state_name,
       state_slug,
       state_abbreviation,
       dealer_count,
       ROUND((
         3959 * acos(
           LEAST(1, GREATEST(-1,
             cos(radians($2)) * cos(radians(latitude)) * cos(radians(longitude) - radians($3)) +
             sin(radians($2)) * sin(radians(latitude))
           ))
         )
       )::numeric, 1)::double precision AS distance_miles
     FROM city_coords
     WHERE NOT (state_slug = $1 AND city_slug = $4)
     ORDER BY
       CASE WHEN state_slug = $1 THEN 0 ELSE 1 END,
       distance_miles ASC,
       dealer_count DESC,
       city_name ASC
     LIMIT $5`,
    [stateSlug, currentLatitude, currentLongitude, citySlug, safeLimit]
  );

  return rows;
}

// ─── Dealer-level queries ──────────────────────────────────────────

export interface DealerRow {
  id: number;
  name: string;
  slug: string;
  city_slug: string;
  state_slug: string;
  state_name: string;
  state_abbreviation: string;
  city_name: string;
  address: string;
  phone: string;
  website: string;
  email: string;
  description: string;
  latitude: number | null;
  longitude: number | null;
  business_hours: string;
  tagline: string;
  is_claimed: boolean;
}

/** All dealers in a city */
export async function getDealersByCity(
  stateSlug: string,
  citySlug: string
): Promise<DealerRow[]> {
  const { rows } = await pool.query<DealerRow>(
    `SELECT * FROM dealers
     WHERE state_slug = $1 AND city_slug = $2
     ORDER BY name`,
    [stateSlug, citySlug]
  );
  return rows.map(withDealerFallbacks);
}

/** Single dealer by slug */
export async function getDealerBySlug(
  stateSlug: string,
  citySlug: string,
  dealerSlug: string
): Promise<DealerRow | null> {
  const { rows } = await pool.query<DealerRow>(
    `SELECT * FROM dealers
     WHERE state_slug = $1 AND city_slug = $2 AND slug = $3
     LIMIT 1`,
    [stateSlug, citySlug, dealerSlug]
  );
  return rows[0] ? withDealerFallbacks(rows[0]) : null;
}

// ─── Claim queries ─────────────────────────────────────────────────

export interface ClaimInput {
  dealerSlug: string;
  stateSlug: string;
  citySlug: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
}

export async function submitClaim(input: ClaimInput) {
  const { rows: dealers } = await pool.query(
    "SELECT id, name FROM dealers WHERE slug = $1 AND state_slug = $2 AND city_slug = $3",
    [input.dealerSlug, input.stateSlug, input.citySlug]
  );
  if (dealers.length === 0) return { success: false, error: "Dealer not found" };

  const dealer = dealers[0];

  const { rows: existing } = await pool.query(
    "SELECT id FROM claimed_listings WHERE dealer_id = $1 AND status = 'pending'",
    [dealer.id]
  );
  if (existing.length > 0)
    return { success: false, error: "A claim is already pending for this listing" };

  const { rows: inserted } = await pool.query(
    `INSERT INTO claimed_listings
     (dealer_id, dealer_slug, state_slug, city_slug, claimant_name, claimant_email, claimant_phone, claimant_message, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'pending')
     RETURNING id`,
    [
      dealer.id,
      input.dealerSlug,
      input.stateSlug,
      input.citySlug,
      input.name,
      input.email,
      input.phone || "",
      input.message || "",
    ]
  );

  return {
    success: true,
    message: `Your claim for "${dealer.name}" has been submitted successfully. We will review it and contact you at ${input.email}.`,
    claimId: inserted[0].id,
  };
}

// ─── Stats ─────────────────────────────────────────────────────────

export async function getDealerStats() {
  const [d, l, c, top] = await Promise.all([
    pool.query("SELECT COUNT(*)::int AS count FROM dealers"),
    pool.query("SELECT COUNT(*)::int AS count FROM locations"),
    pool.query("SELECT COUNT(*)::int AS count FROM claimed_listings"),
    pool.query(
      "SELECT state_name, COUNT(*)::int AS count FROM dealers GROUP BY state_name ORDER BY count DESC LIMIT 10"
    ),
  ]);
  return {
    totalDealers: d.rows[0].count,
    totalLocations: l.rows[0].count,
    totalClaims: c.rows[0].count,
    topStates: top.rows,
  };
}
