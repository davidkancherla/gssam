import { addFinanceEntry, deleteFinanceEntry } from "@/app/actions/finance";
import { requireAdmin } from "@/lib/auth";
import { DeleteButton } from "@/components/DeleteButton";
import { DemoBanner, Field, SavedNotice } from "@/components/ui";
import { db } from "@/lib/db";
import { churchWideCardTotals } from "@/lib/finance";
import { formatMoney, formatShortDate } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata = { title: "Church finance" };

export default async function AdminFinance({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const params = await searchParams;
  await requireAdmin();
  const [entries, members] = await Promise.all([
    db.financeEntry.findMany({
      include: { member: { select: { id: true, name: true, email: true } } },
      orderBy: { occurredOn: "desc" },
    }),
    db.user.findMany({
      where: { role: "MEMBER" },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const { income, expenses } = churchWideCardTotals(entries);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="font-display text-4xl text-shepherd">Church-wide finance</h1>
      <DemoBanner />
      <SavedNotice searchParams={params} />
      <p className="text-sm text-ink/80">
        The cards count unnamed <strong>church-wide</strong> rows only. Member
        household INCOME and personal EXPENSE rows are listed below for the
        office but are never added into these totals.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <p className="text-sm text-muted">Church-wide income & offerings</p>
          <p
            className="mt-2 font-display text-3xl text-shepherd"
            data-church-wide="income"
          >
            {formatMoney(income)}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-muted">Church-wide expenses</p>
          <p
            className="mt-2 font-display text-3xl text-burgundy"
            data-church-wide="expenses"
          >
            {formatMoney(expenses)}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-muted">Net (church-wide sample)</p>
          <p className="mt-2 font-display text-3xl" data-church-wide="net">
            {formatMoney(income - expenses)}
          </p>
        </div>
      </div>
      <form action={addFinanceEntry} className="card grid gap-4 p-6 sm:grid-cols-2">
        <input type="hidden" name="returnTo" value="/admin/finance" />
        <h2 className="font-display text-2xl sm:col-span-2">Add a sample record</h2>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-shepherd">Type</span>
          <select className="input" name="kind" defaultValue="OFFERING">
            <option value="TITHE">Tithe</option>
            <option value="OFFERING">Offering</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-shepherd">Scope</span>
          <select className="input" name="scope" defaultValue="CHURCH">
            <option value="CHURCH">Church-wide (no household name)</option>
            <option value="MEMBER">Assign to a demo member</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-shepherd">Member (if assigned)</span>
          <select className="input" name="memberId" defaultValue="">
            <option value="">None</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </label>
        <Field label="Amount (USD)" name="amount" type="number" step="0.01" min="0.01" required />
        <Field label="Date" name="occurredOn" type="date" required />
        <Field label="Category" name="category" defaultValue="Sunday offering" />
        <Field label="Memo" name="memo" defaultValue="DEMO SAMPLE DATA — not a real offering or household record." />
        <div className="sm:col-span-2">
          <button className="btn btn-dark" type="submit">
            Add record
          </button>
        </div>
      </form>
      <div className="overflow-x-auto card">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-cream text-muted">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Household</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-t border-line">
                <td className="px-4 py-3">{formatShortDate(entry.occurredOn)}</td>
                <td className="px-4 py-3">{entry.member?.name ?? "Church-wide"}</td>
                <td className="px-4 py-3">{entry.kind}</td>
                <td className="px-4 py-3">{entry.category}</td>
                <td className="px-4 py-3">{formatMoney(entry.amountCents)}</td>
                <td className="px-4 py-3">
                  <DeleteButton
                    label="Remove"
                    confirmText="Delete this sample finance record?"
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
