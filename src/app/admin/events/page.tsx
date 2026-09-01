import { deleteEvent, saveEvent } from "@/app/actions/content";
import { requireAdmin } from "@/lib/auth";
import { DeleteButton } from "@/components/DeleteButton";
import { Field, SavedNotice } from "@/components/ui";
import { db } from "@/lib/db";
import { formatShortDate } from "@/lib/site";

function localInput(value?: Date | null) {
  if (!value) return "";
  const date = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export const metadata = { title: "Events CMS" };

export default async function AdminEvents({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; id?: string }>;
}) {
  const params = await searchParams;
  await requireAdmin();
  const events = await db.churchEvent.findMany({ orderBy: { startsAt: "asc" } });
  const current = events.find((item) => item.id === params.id);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="font-display text-4xl text-shepherd">Events</h1>
      <SavedNotice searchParams={params} />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="card flex items-center justify-between gap-3 p-4">
              <a href={`/admin/events?id=${event.id}`}>
                <p className="font-medium text-shepherd">{event.title}</p>
                <p className="text-xs text-muted">{formatShortDate(event.startsAt)}</p>
              </a>
              <DeleteButton
                label="Remove"
                confirmText="Delete this event?"
                action={deleteEvent.bind(null, event.id)}
              />
            </div>
          ))}
        </div>
        <form action={saveEvent} className="card space-y-4 p-6">
          <h2 className="font-display text-2xl">{current ? "Edit event" : "Add event"}</h2>
          {current ? <input type="hidden" name="id" value={current.id} /> : null}
          <Field label="Title" name="title" defaultValue={current?.title} required />
          <Field label="URL slug" name="slug" defaultValue={current?.slug} />
          <Field label="Summary" name="summary" defaultValue={current?.summary} />
          <Field label="Location" name="location" defaultValue={current?.location} />
          <Field
            label="Starts"
            name="startsAt"
            type="datetime-local"
            defaultValue={localInput(current?.startsAt)}
            required
          />
          <Field
            label="Ends"
            name="endsAt"
            type="datetime-local"
            defaultValue={localInput(current?.endsAt)}
          />
          <Field label="Image URL" name="imageUrl" defaultValue={current?.imageUrl} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked={current?.published ?? true} />
            Published on the public site
          </label>
          <Field label="Details" name="body" type="textarea" defaultValue={current?.body} />
          <button className="btn btn-dark" type="submit">
            Save event
          </button>
        </form>
      </div>
    </div>
  );
}
