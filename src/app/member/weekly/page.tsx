import { requireMemberArea } from "@/lib/auth";
import { DemoBanner } from "@/components/ui";
import { db } from "@/lib/db";
import { financeWhereFor } from "@/lib/finance";
import { formatMoney, formatShortDate } from "@/lib/site";

export const metadata = { title: "Weekly" };

export default async function MemberWeekly() {
  const user = await requireMemberArea();
  const weeks = await db.weeklyBulletin.findMany({
    where: { published: true },
    orderBy: { weekOf: "desc" },
  });

  const myOfferings = await db.financeEntry.findMany({
    where: financeWhereFor(user, { kind: { in: ["TITHE", "OFFERING"] } }),
    orderBy: { occurredOn: "desc" },
    take: 8,
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="font-display text-4xl text-shepherd">Weekly</h1>
      <p className="text-ink/80">
        The congregation bulletin is shared with every member. Your weekly
        giving list below is only your household.
      </p>
      <DemoBanner />
      {weeks.map((week) => (
        <article key={week.id} className="card p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">
            {formatShortDate(week.weekOf)}
          </p>
          <h2 className="mt-2 font-display text-3xl text-shepherd">{week.title}</h2>
          <p className="mt-3 text-sm">
            <strong>Scripture.</strong> {week.scripture}
          </p>
          <p className="mt-3 whitespace-pre-line leading-7">{week.worshipNotes}</p>
          <p className="mt-3 whitespace-pre-line leading-7">{week.announcements}</p>
          <p className="mt-4 text-sm text-muted">
            Congregation offering total (unnamed): {formatMoney(week.offeringTotalCents)}
          </p>
        </article>
      ))}
      <section className="card p-6">
        <h2 className="font-display text-2xl text-shepherd">My weekly giving</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {myOfferings.map((entry) => (
            <li key={entry.id} className="flex justify-between border-b border-line py-2">
              <span>
                {formatShortDate(entry.occurredOn)} · {entry.category}
              </span>
              <span>{formatMoney(entry.amountCents)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
