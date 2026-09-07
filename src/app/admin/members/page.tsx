import Link from "next/link";
import { deleteMemberProfile, saveMemberProfile } from "@/app/actions/members";
import { DeleteButton } from "@/components/DeleteButton";
import { Field, SavedNotice } from "@/components/ui";
import { db } from "@/lib/db";
import { formatShortDate } from "@/lib/site";

export const metadata = { title: "Members" };

function dateInputValue(value: Date | null) {
  return value ? value.toISOString().slice(0, 10) : "";
}

function monthDay(value: Date | null) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(value);
}

export default async function AdminMembersPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; saved?: string; error?: string }>;
}) {
  const params = await searchParams;
  const [members, selected] = await Promise.all([
    db.memberProfile.findMany({
      orderBy: [{ isActive: "desc" }, { lastName: "asc" }, { firstName: "asc" }],
    }),
    params.id ? db.memberProfile.findUnique({ where: { id: params.id } }) : null,
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-gold">Private admin directory</p>
          <h1 className="mt-2 font-display text-4xl text-shepherd">Members</h1>
          <p className="mt-2 max-w-2xl text-sm text-ink/75">
            Store people information for church volunteers here. Birthdays,
            anniversaries, contact details, and notes stay inside the admin
            portal and are not shown on the public website.
          </p>
        </div>
        <div className="card px-5 py-4">
          <p className="text-sm text-muted">People listed</p>
          <p className="font-display text-3xl text-shepherd">{members.length}</p>
        </div>
      </div>

      <SavedNotice searchParams={params} />

      <form action={saveMemberProfile} className="card grid gap-4 p-6 sm:grid-cols-2">
        <input type="hidden" name="id" value={selected?.id ?? ""} />
        <div className="sm:col-span-2">
          <h2 className="font-display text-2xl text-shepherd">
            {selected ? "Edit member information" : "Add member information"}
          </h2>
          <p className="mt-1 text-sm text-muted">
            Use this for the people directory. A member does not need a login
            account to be listed here.
          </p>
        </div>
        <Field label="First name" name="firstName" defaultValue={selected?.firstName} required />
        <Field label="Last name" name="lastName" defaultValue={selected?.lastName} required />
        <Field label="Email" name="email" type="email" defaultValue={selected?.email} />
        <Field label="Phone" name="phone" type="tel" defaultValue={selected?.phone} />
        <Field label="Household / family" name="household" defaultValue={selected?.household} />
        <Field label="Address" name="address" defaultValue={selected?.address} />
        <Field label="Birthday" name="birthday" type="date" defaultValue={dateInputValue(selected?.birthday ?? null)} />
        <Field
          label="Wedding anniversary"
          name="anniversary"
          type="date"
          defaultValue={dateInputValue(selected?.anniversary ?? null)}
        />
        <div className="sm:col-span-2">
          <Field label="Notes" name="notes" type="textarea" defaultValue={selected?.notes} />
        </div>
        <label className="flex items-center gap-2 text-sm text-shepherd">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={selected?.isActive ?? true}
            className="h-4 w-4"
          />
          Active member
        </label>
        <div className="flex flex-wrap gap-3 sm:col-span-2">
          <button className="btn btn-dark" type="submit">
            {selected ? "Save member" : "Add member"}
          </button>
          {selected ? (
            <Link href="/admin/members" className="btn btn-light">
              Cancel edit
            </Link>
          ) : null}
        </div>
      </form>

      {members.length === 0 ? (
        <p className="text-muted">No people have been added yet.</p>
      ) : (
        <div className="overflow-x-auto card">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-cream text-muted">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Household</th>
                <th className="px-4 py-3">Birthday</th>
                <th className="px-4 py-3">Anniversary</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Added</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-t border-line align-top">
                  <td className="px-4 py-3">
                    <p className="font-medium text-shepherd">
                      {member.firstName} {member.lastName}
                    </p>
                    {member.notes ? (
                      <p className="mt-1 max-w-xs text-xs text-muted">{member.notes}</p>
                    ) : null}
                  </td>
                  <td className="space-y-1 px-4 py-3">
                    <p>{member.email || "No email"}</p>
                    <p className="text-muted">{member.phone || "No phone"}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p>{member.household || "Not set"}</p>
                    {member.address ? <p className="mt-1 text-xs text-muted">{member.address}</p> : null}
                  </td>
                  <td className="px-4 py-3">{monthDay(member.birthday)}</td>
                  <td className="px-4 py-3">{monthDay(member.anniversary)}</td>
                  <td className="px-4 py-3">{member.isActive ? "Active" : "Inactive"}</td>
                  <td className="px-4 py-3">{formatShortDate(member.createdAt)}</td>
                  <td className="space-y-2 px-4 py-3">
                    <Link href={`/admin/members?id=${member.id}`} className="block text-sm text-shepherd hover:underline">
                      Edit
                    </Link>
                    <DeleteButton
                      label="Remove"
                      confirmText="Remove this person from the private member directory?"
                      action={deleteMemberProfile.bind(null, member.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
