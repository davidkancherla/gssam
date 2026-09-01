import { addFinanceEntry } from "@/app/actions/finance";
import { requireMemberArea } from "@/lib/auth";
import { DemoBanner, Field, SavedNotice } from "@/components/ui";
import { db } from "@/lib/db";
import { formatMoney, formatShortDate } from "@/lib/site";

export const metadata = { title: "Income" };

export default async function MemberIncome({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const params = await searchParams;
  const user = await requireMemberArea();
  const entries = await db.financeEntry.findMany({
    where:
      user.role === "ADMIN"
        ? { kind: "INCOME" }
        : { memberId: user.id, kind: "INCOME" },
    include: { member: true },
    orderBy: { occurredOn: "desc" },
  });
  const total = entries.reduce((sum, entry) => sum + entry.amountCents, 0);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="font-display text-4xl text-shepherd">Income tracking</h1>
      <p className="text-ink/80">
        Record household income so you can see giving in context. These figures
        are private to your login
        {user.role === "ADMIN" ? " (admins see every demo household)" : ""}.
      </p>
      <DemoBanner />
      <SavedNotice searchParams={params} />
      <div className="card p-5">
        <p className="text-sm text-muted">Year-to-date sample income</p>
        <p className="mt-2 font-display text-4xl text-shepherd">{formatMoney(total)}</p>
      </div>
      <form action={addFinanceEntry} className="card grid gap-4 p-6 sm:grid-cols-2">
        <input type="hidden" name="kind" value="INCOME" />
        <h2 className="font-display text-2xl sm:col-span-2">Add income</h2>
        <Field label="Amount (USD)" name="amount" type="number" required />
        <Field label="Date" name="occurredOn" type="date" required />
        <Field label="Source / category" name="category" defaultValue="Household income (demo)" />
        <Field
          label="Memo"
          name="memo"
          defaultValue="DEMO SAMPLE DATA — not a real offering or household record."
        />
        <div className="sm:col-span-2">
          <button className="btn btn-dark" type="submit">
            Save income
          </button>
        </div>
      </form>
      <ul className="card divide-y divide-line">
        {entries.map((entry) => (
          <li key={entry.id} className="flex justify-between px-5 py-3 text-sm">
            <span>
              {formatShortDate(entry.occurredOn)} · {entry.category}
              {user.role === "ADMIN" && entry.member ? ` · ${entry.member.name}` : ""}
            </span>
            <span>{formatMoney(entry.amountCents)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
