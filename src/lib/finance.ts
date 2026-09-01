import type { Prisma } from "@prisma/client";
import type { SessionUser } from "./session";

/** Members may only query their own household rows. Admins may query all. */
export function financeWhereFor(
  user: SessionUser,
  extra: Prisma.FinanceEntryWhereInput = {},
): Prisma.FinanceEntryWhereInput {
  if (user.role === "ADMIN") return extra;
  return { ...extra, memberId: user.id };
}

export function canAccessFinanceEntry(
  user: SessionUser,
  entry: { memberId: string | null },
) {
  return user.role === "ADMIN" || entry.memberId === user.id;
}
