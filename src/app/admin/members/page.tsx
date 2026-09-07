import { DemoBanner } from "@/components/ui";
import { db } from "@/lib/db";
import { formatMoney, formatShortDate } from "@/lib/site";

export const metadata = { title: "Members" };

function memberGivingTotal(
  entries: {
    amountCents: number;
    kind: string;
    scope: string;
  }[],
) {
  return entries
    .filter((entry) => entry.scope === "MEMBER" && ["TITHE", "OFFERING"].includes(entry.kind))
    .reduce((total, entry) => total + entry.amountCents, 0);
}

export default async function AdminMembersPage() {
  const members = await db.user.findMany({
    where: { role: "MEMBER" },
    select: {
      id: true,
      name: true,
      email: true,
      household: true,
      createdAt: true,
      financeEntries: {
        select: {
          amountCents: true,
          kind: true,
          scope: true,
          occurredOn: true,
        },
        orderBy: { occurredOn: "desc" },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-gold">Church office</p>
          <h1 className="mt-2 font-display text-4xl text-shepherd">Members</h1>
        </div>
        <div className="card px-5 py-4">
          <p className="text-sm text-muted">Member households</p>
          <p className="font-display text-3xl text-shepherd">{members.length}</p>
        </div>
      </div>
      <DemoBanner />

      {members.length === 0 ? (
        <p className="text-muted">No members have been added yet.</p>
      ) : (
        <div className="overflow-x-auto card">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-cream text-muted">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Household</th>
                <th className="px-4 py-3">Member since</th>
                <th className="px-4 py-3">Records</th>
                <th className="px-4 py-3">Last activity</th>
                <th className="px-4 py-3">Sample giving</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => {
                const lastEntry = member.financeEntries[0];
                const givingTotal = memberGivingTotal(member.financeEntries);
                return (
                  <tr key={member.id} className="border-t border-line">
                    <td className="px-4 py-3 font-medium text-shepherd">{member.name}</td>
                    <td className="px-4 py-3">{member.email}</td>
                    <td className="px-4 py-3">{member.household || "Not set"}</td>
                    <td className="px-4 py-3">{formatShortDate(member.createdAt)}</td>
                    <td className="px-4 py-3">{member.financeEntries.length}</td>
                    <td className="px-4 py-3">
                      {lastEntry ? formatShortDate(lastEntry.occurredOn) : "None"}
                    </td>
                    <td className="px-4 py-3">{formatMoney(givingTotal)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
