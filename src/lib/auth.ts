import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "./db";
import { userFromToken } from "./current-user";
import { SESSION_COOKIE, type Role, type SessionUser } from "./session";
import { persistSession } from "./session-cookie";

/** The signed-in user as stored in the database (role is never taken from the JWT alone). */
export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  return userFromToken(jar.get(SESSION_COOKIE)?.value);
}

export async function getAdminUser(): Promise<SessionUser | null> {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") return null;
  return user;
}

export async function requireUser(role?: Role): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (role === "ADMIN" && user.role !== "ADMIN") {
    redirect("/member");
  }
  return user;
}

export async function requireAdmin() {
  return requireUser("ADMIN");
}

/** Admin Server Actions: verify against the DB and keep the session cookie on the redirect response. */
export async function requireAdminAction() {
  const user = await requireAdmin();
  await persistSession(user);
  return user;
}

export async function requireMemberArea() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role !== "MEMBER" && user.role !== "ADMIN") redirect("/login");
  return user;
}

/** Member Server Actions: verify against the DB and keep the session cookie on the action response. */
export async function requireMemberAction() {
  const user = await requireMemberArea();
  await persistSession(user);
  return user;
}

export async function findUserByEmail(email: string) {
  return db.user.findUnique({ where: { email: email.toLowerCase() } });
}
