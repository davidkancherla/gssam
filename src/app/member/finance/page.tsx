import { addFinanceEntry, deleteFinanceEntry } from "@/app/actions/finance";
import { requireMemberArea } from "@/lib/auth";
import { DeleteButton } from "@/components/DeleteButton";
import { DemoBanner, Field, SavedNotice } from "@/components/ui";
import { db } from "@/lib/db";
import { formatMoney, formatShortDate } from "@/lib/site";

export const metadata = { title: "Finance" };

export default async function MemberFinance({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const params = await searchParams;
  const user = await requireMemberArea();
  const isAdmin = user.role === "ADMIN";
  const entries = await db.financeEntry.findMany({
    where: isAdmin ? undefined : { memberId: user.id },
    include: { member: true },
    orderBy: { occurredOn: "desc" },
  });

  const visible = isAdmin
    ? entries
    : entries.filter((entry) => entry.memberId === user.id);

  const offerings = visible
    .filter((entry) => entry.kind === "TITHE" || entry.kind === "OFFERING")
    .reduce((sum, entry) => sum + entry.amountCents, 0);
  const income = visible
    .filter((entry) => entry.kind === "INCOME")
    .reduce((sum, entry) => sum + entry.amountCents, 0);
  const expenses = visible
    .filter((entry) => entry.kind === "EXPENSE")
    .reduce((sum, entry) => sum + entry.amountCents, 0);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="font-display text-4xl text-shepherd">Finance</h1>
      <p className="text-ink/80">
        Track tithes, weekly offerings, household income, and expenses. Other
        members cannot see these rows.
      </p>
      <DemoBanner />
      <SavedNotice searchParams={params} />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <p className="text-sm text-muted">Tithes & offerings</p>
          <p className="mt-2 font-display text-3xl">{formatMoney(offerings)}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-muted">Income</p>
          <p className="mt-2 font-display text-3xl">{formatMoney(income)}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-muted">Expenses</p>
          <p className="mt-2 font-display text-3xl">{formatMoney(expenses)}</p>
        </div>
      </div>
      <form action={addFinanceEntry} className="card grid gap-4 p-6 sm:grid-cols-2">
        <h2 className="font-display text-2xl sm:col-span-2">Add a household record</h2>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-shepherd">Type</span>
          <select className="input" name="kind" defaultValue="OFFERING">
            <option value="TITHE">Tithe</option>
            <option value="OFFERING">Weekly offering</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
        </label>
        <Field label="Amount (USD)" name="amount" type="number" required />
        <Field label="Date" name="occurredOn" type="date" required />
        <Field label="Category" name="category" defaultValue="Sunday offering" />
        <Field
          label="Memo"
          name="memo"
          defaultValue="DEMO SAMPLE DATA — not a real offering or household record."
        />
        <div className="sm:col-span-2">
          <button className="btn btn-dark" type="submit">
            Save to my records
          </button>
        </div>
      </form>
      <div className="overflow-x-auto card">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-cream text-muted">
            <tr>
              <th className="px-4 py-3">Date</th>
              {isAdmin ? <th className="px-4 py-3">Household</th> : null}
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {visible.map((entry) => (
              <tr key={entry.id} className="border-t border-line">
                <td className="px-4 py-3">{formatShortDate(entry.occurredOn)}</td>
                {isAdmin ? (
                  <td className="px-4 py-3">{entry.member?.name ?? "Church-wide"}</td>
                ) : null}
                <td className="px-4 py-3">{entry.kind}</td>
                <td className="px-4 py-3">{entry.category}</td>
                <td className="px-4 py-3">{formatMoney(entry.amountCents)}</td>
                <td className="px-4 py-3">
                  <DeleteButton
                    label="Remove"
                    confirmText="Remove this sample record?"
                    action={deleteFinanceEntry.bind(null, entry.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
