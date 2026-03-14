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

/** All 50 states with aggregated dealer and city counts */
export async function getAllStates(): Promise<StateInfo[]> {
  const { rows } = await pool.query<StateInfo>(`
    SELECT
      d.state_name,
      d.state_slug,
      d.state_abbreviation,
      COUNT(*)::int AS dealer_count,
      COUNT(DISTINCT d.city_slug)::int AS city_count
    FROM dealers d
    GROUP BY d.state_name, d.state_slug, d.state_abbreviation
    ORDER BY d.state_name
  `);
  return rows;
}

/** Single state info */
export async function getStateBySlug(
  stateSlug: string
): Promise<StateInfo | null> {
  const { rows } = await pool.query<StateInfo>(
    `SELECT
       d.state_name,
       d.state_slug,
       d.state_abbreviation,
       COUNT(*)::int AS dealer_count,
       COUNT(DISTINCT d.city_slug)::int AS city_count
     FROM dealers d
     WHERE d.state_slug = $1
     GROUP BY d.state_name, d.state_slug, d.state_abbreviation`,
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
}

/** All cities within a state */
export async function getCitiesByState(
  stateSlug: string
): Promise<CityInfo[]> {
  const { rows } = await pool.query<CityInfo>(
    `SELECT
       d.city_name,
       d.city_slug,
       d.state_name,
       d.state_slug,
       d.state_abbreviation,
       COUNT(*)::int AS dealer_count
     FROM dealers d
     WHERE d.state_slug = $1
     GROUP BY d.city_name, d.city_slug, d.state_name, d.state_slug, d.state_abbreviation
     ORDER BY d.city_name`,
    [stateSlug]
  );
  return rows;
}

/** Single city info */
export async function getCityBySlug(
  stateSlug: string,
  citySlug: string
): Promise<CityInfo | null> {
  const { rows } = await pool.query<CityInfo>(
    `SELECT
       d.city_name,
       d.city_slug,
       d.state_name,
       d.state_slug,
       d.state_abbreviation,
       COUNT(*)::int AS dealer_count
     FROM dealers d
     WHERE d.state_slug = $1 AND d.city_slug = $2
     GROUP BY d.city_name, d.city_slug, d.state_name, d.state_slug, d.state_abbreviation`,
    [stateSlug, citySlug]
  );
  return rows[0] ?? null;
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
  // Find dealer
  const { rows: dealers } = await pool.query(
    "SELECT id, name FROM dealers WHERE slug = $1 AND state_slug = $2 AND city_slug = $3",
    [input.dealerSlug, input.stateSlug, input.citySlug]
  );
  if (dealers.length === 0) return { success: false, error: "Dealer not found" };

  const dealer = dealers[0];

  // Check existing pending claim
  const { rows: existing } = await pool.query(
    "SELECT id FROM claimed_listings WHERE dealer_id = $1 AND status = 'pending'",
    [dealer.id]
  );
  if (existing.length > 0)
    return { success: false, error: "A claim is already pending for this listing" };

  // Insert
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
