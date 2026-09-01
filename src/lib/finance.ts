import type { Prisma } from "@prisma/client";
import type { SessionUser } from "./session";

type LedgerRow = {
  kind: string;
  scope: string;
  memberId: string | null;
  amountCents: number;
};

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

/** Private household income / personal expenses — never church-wide card totals. */
export function isPrivateHouseholdIncomeOrExpense(entry: {
  kind: string;
  scope: string;
  memberId: string | null;
}) {
  if (entry.kind !== "INCOME" && entry.kind !== "EXPENSE") return false;
  return entry.scope === "MEMBER" || entry.memberId != null;
}

/**
 * Unnamed congregation rows only. Named household gifts, household INCOME,
 * and personal EXPENSE rows are excluded even if scope is mis-tagged.
 */
export function countsTowardChurchWideTotals(entry: {
  kind: string;
  scope: string;
  memberId: string | null;
}) {
  if (isPrivateHouseholdIncomeOrExpense(entry)) return false;
  if (entry.memberId != null) return false;
  return entry.scope === "CHURCH";
}

export function churchWideTotalsWhere(): Prisma.FinanceEntryWhereInput {
  return {
    AND: [
      { scope: "CHURCH" },
      { memberId: null },
      { NOT: { kind: "INCOME", memberId: { not: null } } },
      { NOT: { kind: "EXPENSE", memberId: { not: null } } },
    ],
  };
}

export function churchWideCardTotals(entries: LedgerRow[]) {
  let income = 0;
  let expenses = 0;
  for (const entry of entries) {
    if (!countsTowardChurchWideTotals(entry)) continue;
    if (entry.kind === "EXPENSE") expenses += entry.amountCents;
    else income += entry.amountCents;
  }
  return { income, expenses };
}

export function canAccessFinanceEntry(
  user: SessionUser,
  entry: { memberId: string | null },
) {
  return user.role === "ADMIN" || entry.memberId === user.id;
}
