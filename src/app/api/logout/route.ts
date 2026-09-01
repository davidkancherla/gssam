import { NextRequest } from "next/server";
import { expiredSessionCookieHeader } from "@/lib/session";

export const dynamic = "force-dynamic";

function logoutRedirect(request: NextRequest) {
  // Use a raw Response so Next's cookie jar cannot rewrite a bare delete
  // (Path=/ only) over the matching SameSite=Lax; HttpOnly expire header.
  return new Response(null, {
    status: 303,
    headers: {
      Location: new URL("/", request.url).toString(),
      "Cache-Control": "private, no-store, max-age=0, must-revalidate",
      "Set-Cookie": expiredSessionCookieHeader(),
    },
  });
}

export async function GET(request: NextRequest) {
  return logoutRedirect(request);
}

export async function POST(request: NextRequest) {
  return logoutRedirect(request);
}
