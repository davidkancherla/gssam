import { cookies } from "next/headers";
import { SESSION_COOKIE, signSession, type SessionUser } from "./session";

const SESSION_MAX_AGE = 60 * 60 * 24 * 14;

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE,
    expires: new Date(Date.now() + SESSION_MAX_AGE * 1000),
    secure: process.env.NODE_ENV === "production",
  };
}

/** Re-write the session cookie. Next.js 16 can drop it on Server Action redirects if we only read cookies(). */
export async function persistSession(user: SessionUser) {
  const token = await signSession(user);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, sessionCookieOptions());
}
