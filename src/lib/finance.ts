import type { Prisma } from "@prisma/client";
import type { SessionUser } from "./session";

/**
 * Member portal queries: always the signed-in household, including when an
 * administrator is browsing /member as themselves. Church-wide ledgers belong
 * on /admin/finance.
 */
export function financeWhereFor(
  user: SessionUser,
  extra: Prisma.FinanceEntryWhereInput = {},
): Prisma.FinanceEntryWhereInput {
  return { AND: [{ memberId: user.id }, extra] };
}

/** Unnamed congregation rows only — never household income or expenses. */
export function churchScopeWhere(
  extra: Prisma.FinanceEntryWhereInput = {},
): Prisma.FinanceEntryWhereInput {
  return { AND: [{ scope: "CHURCH" }, extra] };
}

export function isChurchScoped(entry: { scope: string }) {
  return entry.scope === "CHURCH";
}

export function canAccessFinanceEntry(
  user: SessionUser,
  entry: { memberId: string | null },
) {
  return user.role === "ADMIN" || entry.memberId === user.id;
}
