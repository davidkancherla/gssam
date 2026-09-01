import { jwtVerify, SignJWT } from "jose";

export const SESSION_COOKIE = "gssam_session";

/** Attributes used for every set and clear of gssam_session. Must stay in sync. */
export const sessionCookieBase = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: process.env.NODE_ENV === "production",
};

export type Role = "ADMIN" | "MEMBER";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

type CookieWriter = {
  set: (name: string, value: string, options?: object) => unknown;
};

const EXAMPLE_AUTH_SECRET =
  "change-this-to-a-long-random-string-before-production";

function secretKey() {
  const secret = process.env.AUTH_SECRET || EXAMPLE_AUTH_SECRET;
  return new TextEncoder().encode(secret);
}

export async function signSession(user: SessionUser) {
  return new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("14d")
    .sign(secretKey());
}

export async function verifySession(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (
      typeof payload.id !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string" ||
      (payload.role !== "ADMIN" && payload.role !== "MEMBER")
    ) {
      return null;
    }
    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export function applySessionCookie(jar: CookieWriter, token: string) {
  jar.set(SESSION_COOKIE, token, {
    ...sessionCookieBase,
    maxAge: 60 * 60 * 24 * 14,
  });
}

export function expiredSessionCookieHeader() {
  const sameSite =
    sessionCookieBase.sameSite.charAt(0).toUpperCase() +
    sessionCookieBase.sameSite.slice(1);
  const parts = [
    `${SESSION_COOKIE}=`,
    `Path=${sessionCookieBase.path}`,
    "Max-Age=0",
    "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    `SameSite=${sameSite}`,
  ];
  if (sessionCookieBase.httpOnly) parts.push("HttpOnly");
  if (sessionCookieBase.secure) parts.push("Secure");
  return parts.join("; ");
}

export function expireSessionCookie(jar: CookieWriter) {
  jar.set(SESSION_COOKIE, "", {
    ...sessionCookieBase,
    maxAge: 0,
    expires: new Date(0),
  });
}
