import { requireMemberArea } from "@/lib/auth";
import { DemoBanner, SavedNotice } from "@/components/ui";
import { db } from "@/lib/db";
import { financeWhereFor } from "@/lib/finance";
import { formatMoney, formatShortDate } from "@/lib/site";
import { IncomeForm } from "./income-form";

export const metadata = { title: "Income" };

export default async function MemberIncome({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const params = await searchParams;
  const user = await requireMemberArea();
  const entries = await db.financeEntry.findMany({
    where: financeWhereFor(user, { kind: "INCOME" }),
    orderBy: { occurredOn: "desc" },
  });
  const total = entries.reduce((sum, entry) => sum + entry.amountCents, 0);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="font-display text-4xl text-shepherd">Income tracking</h1>
      <p className="text-ink/80">
        Record household income so you can see giving in context. These figures
        are private to your login.
      </p>
      <DemoBanner />
      <SavedNotice searchParams={params} />
      <div className="card p-5">
        <p className="text-sm text-muted">Year-to-date sample income</p>
        <p className="mt-2 font-display text-4xl text-shepherd">{formatMoney(total)}</p>
      </div>
      <IncomeForm />
      <ul className="card divide-y divide-line">
        {entries.map((entry) => (
          <li key={entry.id} className="flex justify-between px-5 py-3 text-sm">
            <span>
              {formatShortDate(entry.occurredOn)} · {entry.category}
            </span>
            <span>{formatMoney(entry.amountCents)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
