import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { userFromToken } from "./current-user";
import { SESSION_COOKIE, type Role, type SessionUser } from "./session";

export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  return userFromToken(jar.get(SESSION_COOKIE)?.value);
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

export async function requireMemberArea() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role !== "MEMBER" && user.role !== "ADMIN") redirect("/login");
  return user;
}
