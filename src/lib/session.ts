import { jwtVerify, SignJWT } from "jose";

export const SESSION_COOKIE = "gssam_session";

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

type CookieJar = {
  set: (
    name: string,
    value: string,
    options?: {
      httpOnly?: boolean;
      sameSite?: "lax" | "strict" | "none";
      path?: string;
      secure?: boolean;
      maxAge?: number;
      expires?: Date;
    },
  ) => unknown;
  delete: (name: string) => unknown;
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

export function expireSessionCookie(jar: CookieJar) {
  const expired = {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  };
  jar.set(SESSION_COOKIE, "", { ...expired, secure: sessionCookieBase.secure });
  jar.set(SESSION_COOKIE, "", { ...expired, secure: !sessionCookieBase.secure });
  jar.delete(SESSION_COOKIE);
}
