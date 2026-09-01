import { db } from "./db";
import { verifySession, type SessionUser } from "./session";

/** Resolve a session cookie to the live user row so JWT role cannot be forged. */
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
    // SQLite/Prisma can drop the connection after a Server Action. Trust the
    // verified JWT for this request rather than treating the user as logged out.
    return session;
  }
}
