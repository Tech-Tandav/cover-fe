import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET!;

// Routes that require any authenticated user.
// NOTE: /dashboard is intentionally NOT gated yet — backend auth isn't wired,
// so we leave it open during development. Re‑enable below once login works.
const PROTECTED_PREFIXES: string[] = []; // ["/orders", "/account", "/dashboard"]
const OWNER_PREFIXES: string[] = []; // ["/dashboard"]

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret });
  const { pathname, search } = req.nextUrl;

  const needsAuth =
    PROTECTED_PREFIXES.some((p) => pathname.startsWith(p)) ||
    OWNER_PREFIXES.some((p) => pathname.startsWith(p));

  if (needsAuth && !token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  if (
    OWNER_PREFIXES.some((p) => pathname.startsWith(p)) &&
    token?.role !== "owner"
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Match nothing for now. When you turn on the prefixes above,
  // also expand the matcher accordingly:
  // matcher: ["/dashboard/:path*", "/orders/:path*", "/account/:path*"],
  matcher: ["/__noop_disabled__/:path*"],
};
