import { generateCitySitemap } from "@/lib/sitemap-utils";
export const dynamic = "force-dynamic";
export async function GET() { return generateCitySitemap(1); }
