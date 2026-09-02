import { requireMemberArea } from "@/lib/auth";
import { DemoBanner } from "@/components/ui";
import { db } from "@/lib/db";
import { financeWhereFor } from "@/lib/finance";
import { formatMoney } from "@/lib/site";
import Link from "next/link";

export const metadata = { title: "Member portal" };

export default async function MemberHome() {
  const user = await requireMemberArea();
  const isAdmin = user.role === "ADMIN";
  const entries = await db.financeEntry.findMany({
    where: financeWhereFor(user),
    orderBy: { occurredOn: "desc" },
  });
  const week = await db.weeklyBulletin.findFirst({
    where: { published: true },
    orderBy: { weekOf: "desc" },
  });

  const giving = entries
    .filter((entry) => entry.kind === "TITHE" || entry.kind === "OFFERING")
    .reduce((sum, entry) => sum + entry.amountCents, 0);
  const income = entries
    .filter((entry) => entry.kind === "INCOME")
    .reduce((sum, entry) => sum + entry.amountCents, 0);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-gold">Peace be with you</p>
        <h1 className="mt-2 font-display text-4xl text-shepherd">
          {isAdmin ? "Member view (admin)" : `Welcome, ${user.name.split(" (")[0]}`}
        </h1>
        <p className="mt-3 max-w-2xl text-ink/80">
          {isAdmin
            ? "You are signed in as an administrator. This member view shows only your own household sample, the same way a member would see it. Congregation-wide figures are on Church finance."
            : "This portal shows only your household’s sample records, plus the weekly bulletin for the congregation."}
        </p>
      </div>
      <DemoBanner />
      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/member/finance" className="card p-5">
          <p className="text-sm text-muted">Giving & expenses</p>
          <p className="mt-2 font-display text-3xl text-shepherd">{formatMoney(giving)}</p>
        </Link>
        <Link href="/member/income" className="card p-5">
          <p className="text-sm text-muted">Recorded income</p>
          <p className="mt-2 font-display text-3xl text-shepherd">{formatMoney(income)}</p>
        </Link>
        <Link href="/member/weekly" className="card p-5">
          <p className="text-sm text-muted">This week</p>
          <p className="mt-2 font-display text-2xl text-shepherd">{week?.title ?? "No bulletin yet"}</p>
        </Link>
      </div>
    </div>
  );
}
