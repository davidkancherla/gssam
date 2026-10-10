import { expiredSessionCookieHeader } from "@/lib/session";

export const dynamic = "force-dynamic";

function logoutRedirect() {
  // Use a raw Response so Next's cookie jar cannot rewrite a bare delete
  // (Path=/ only) over the matching SameSite=Lax; HttpOnly expire header.
  return new Response(null, {
    status: 303,
    headers: {
      // Relative so the browser stays on the origin it signed out from.
      Location: "/",
      "Cache-Control": "private, no-store, max-age=0, must-revalidate",
      "Set-Cookie": expiredSessionCookieHeader(),
    },
  });
}

export async function GET() {
  return logoutRedirect();
}

export async function POST() {
  return logoutRedirect();
}
