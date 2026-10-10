import { db } from "./db";
import { verifySession, type SessionUser } from "./session";

/**
 * Resolve a session cookie to the live user row so a JWT's role (or a user
 * that was deleted or demoted) cannot be used to open admin or member pages.
 */
export async function userFromToken(
  token: string | undefined,
): Promise<SessionUser | null> {
  if (!token) return null;
  const session = await verifySession(token);
  if (!session) return null;

  try {
    const user = await db.user.findUnique({
      where: { id: session.id },
      select: { id: true, name: true, email: true, role: true },
    });
    if (!user) return null;
    const role = user.role;
    if (role !== "ADMIN" && role !== "MEMBER") return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role,
    };
  } catch {
    // SQLite/Prisma can drop the connection right after a Server Action.
    // Fall back to the verified JWT for this request, but never let it grant
    // admin: a transient DB error must not turn a forged role into access.
    return session.role === "ADMIN" ? { ...session, role: "MEMBER" } : session;
  }
}
