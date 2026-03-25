import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";

  // Redirect non-www to www with 301 (permanent)
  if (host === "buyherepayhere.io") {
    const url = request.nextUrl.clone();
    url.host = "www.buyherepayhere.io";
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except static files and Next.js internals
  matcher: ["/((?!_next/static|_next/image|favicon.ico|og-default.png).*)"],
};
