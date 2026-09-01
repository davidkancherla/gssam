import { NextRequest, NextResponse } from "next/server";
import { expireSessionCookie } from "@/lib/session";

export const dynamic = "force-dynamic";

function logoutRedirect(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/", request.url), 303);
  expireSessionCookie(response.cookies);
  response.headers.set("Cache-Control", "private, no-store, max-age=0, must-revalidate");
  return response;
}

export async function GET(request: NextRequest) {
  return logoutRedirect(request);
}

export async function POST(request: NextRequest) {
  return logoutRedirect(request);
}
