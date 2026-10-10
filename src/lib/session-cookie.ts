import { cookies } from "next/headers";
import { applySessionCookie, signSession, type SessionUser } from "./session";

/**
 * Re-write the session cookie on a Server Action response. Next.js 16 can drop
 * gssam_session on Server Action redirects when the action only reads cookies().
 * Uses the same attributes as login (sessionCookieBase in session.ts).
 */
export async function persistSession(user: SessionUser) {
  applySessionCookie(await cookies(), await signSession(user));
}
