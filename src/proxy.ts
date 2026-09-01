import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { userFromToken } from "@/lib/current-user";
import { SESSION_COOKIE } from "@/lib/session";

export async function proxy(request: NextRequest) {
  // Server Actions POST to the page URL. Do not run proxy (or Prisma) on those
  // requests — cloning the body here surfaces "An unexpected response was
  // received from the server". Layouts and the actions still enforce auth.
  if (request.headers.get("next-action")) {
    return NextResponse.next();
  }
  const { pathname } = request.nextUrl;
  const user = await userFromToken(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname.startsWith("/admin")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    if (user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/member", request.url));
    }
  }

  if (pathname.startsWith("/member")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  if (pathname === "/login" && user) {
    return NextResponse.redirect(
      new URL(user.role === "ADMIN" ? "/admin" : "/member", request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/member/:path*", "/login"],
};
