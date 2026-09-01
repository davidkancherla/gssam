import { cookies } from "next/headers";
import { SESSION_COOKIE, signSession, type SessionUser } from "./session";

const SESSION_MAX_AGE = 60 * 60 * 24 * 14;

/** Shared Set-Cookie identity. Logout must use these same attributes or the browser keeps the cookie. */
export function sessionCookieIdentity() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  };
}

export function sessionCookieOptions() {
  return {
    ...sessionCookieIdentity(),
    maxAge: SESSION_MAX_AGE,
    expires: new Date(Date.now() + SESSION_MAX_AGE * 1000),
  };
}

/** Re-write the session cookie. Next.js 16 can drop it on Server Action redirects if we only read cookies(). */
export async function persistSession(user: SessionUser) {
  const token = await signSession(user);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, sessionCookieOptions());
}

/** Expire and delete gssam_session with the same path/sameSite/httpOnly/secure used in set(). */
export async function clearSession() {
  const jar = await cookies();
  const identity = sessionCookieIdentity();
  jar.set(SESSION_COOKIE, "", {
    ...identity,
    maxAge: 0,
    expires: new Date(0),
  });
  jar.delete({
    name: SESSION_COOKIE,
    ...identity,
  });
}
