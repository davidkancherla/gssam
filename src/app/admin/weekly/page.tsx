import { deleteWeekly, saveWeekly } from "@/app/actions/content";
import { requireAdmin } from "@/lib/auth";
import { DeleteButton } from "@/components/DeleteButton";
import { Field, SavedNotice } from "@/components/ui";
import { db } from "@/lib/db";
import { formatMoney, formatShortDate } from "@/lib/site";

function dateInput(value?: Date) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

export const metadata = { title: "Weekly bulletin" };

export default async function AdminWeekly({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; id?: string }>;
}) {
  const params = await searchParams;
  await requireAdmin();
  const weeks = await db.weeklyBulletin.findMany({ orderBy: { weekOf: "desc" } });
  const current = weeks.find((item) => item.id === params.id);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="font-display text-4xl text-shepherd">Weekly bulletin</h1>
      <p className="text-ink/80">
        Members see scripture, worship notes, and announcements. Church-wide
        offering totals are visible in the admin view and on the weekly page as
        a congregation total, not as named gifts.
      </p>
      <SavedNotice searchParams={params} />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3">
          {weeks.map((week) => (
            <div key={week.id} className="card flex items-center justify-between p-4">
              <a href={`/admin/weekly?id=${week.id}`}>
                <p className="font-medium text-shepherd">{week.title}</p>
                <p className="text-xs text-muted">
                  {formatShortDate(week.weekOf)} · {formatMoney(week.offeringTotalCents)} congregation offering
                </p>
              </a>
              <DeleteButton
                label="Remove"
                confirmText="Delete this weekly summary?"
                action={deleteWeekly.bind(null, week.id)}
              />
            </div>
          ))}
        </div>
        <form action={saveWeekly} className="card space-y-4 p-6">
          <h2 className="font-display text-2xl">{current ? "Edit week" : "New week"}</h2>
          {current ? <input type="hidden" name="id" value={current.id} /> : null}
          <Field label="Week of" name="weekOf" type="date" defaultValue={dateInput(current?.weekOf)} required />
          <Field label="Title" name="title" defaultValue={current?.title} required />
          <Field label="Scripture" name="scripture" defaultValue={current?.scripture} />
          <Field label="Worship notes" name="worshipNotes" type="textarea" defaultValue={current?.worshipNotes} />
          <Field label="Announcements" name="announcements" type="textarea" defaultValue={current?.announcements} />
          <Field
            label="Congregation offering total (USD)"
            name="offeringTotal"
            type="number"
            step="0.01"
            min="0"
            defaultValue={current ? current.offeringTotalCents / 100 : 0}
          />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked={current?.published ?? true} />
            Visible to members
          </label>
          <button className="btn btn-dark" type="submit">
            Save weekly summary
          </button>
        </form>
      </div>
    </div>
  );
}
