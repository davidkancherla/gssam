import { deleteSermon, saveSermon } from "@/app/actions/content";
import { DeleteButton } from "@/components/DeleteButton";
import { Field, SavedNotice } from "@/components/ui";
import { db } from "@/lib/db";
import { formatShortDate } from "@/lib/site";

function dateInput(value?: Date) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

export const metadata = { title: "Messages CMS" };

export default async function AdminMessages({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; id?: string }>;
}) {
  const params = await searchParams;
  const sermons = await db.sermon.findMany({ orderBy: { preachedAt: "desc" } });
  const current = sermons.find((item) => item.id === params.id);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="font-display text-4xl text-shepherd">Messages</h1>
      <p className="text-ink/80">
        Paste a YouTube video ID, watch URL, youtu.be link, or /embed/ URL.
        Those are saved as a video ID so the public player works.
      </p>
      <SavedNotice searchParams={params} />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3">
          {sermons.map((sermon) => (
            <div key={sermon.id} className="card flex items-center justify-between gap-3 p-4">
              <a href={`/admin/messages?id=${sermon.id}`}>
                <p className="font-medium text-shepherd">{sermon.title}</p>
                <p className="text-xs text-muted">{formatShortDate(sermon.preachedAt)}</p>
              </a>
              <DeleteButton
                label="Remove"
                confirmText="Remove this message?"
                action={deleteSermon.bind(null, sermon.id)}
              />
            </div>
          ))}
        </div>
        <form action={saveSermon} className="card space-y-4 p-6">
          <h2 className="font-display text-2xl">{current ? "Edit message" : "Add message"}</h2>
          {current ? <input type="hidden" name="id" value={current.id} /> : null}
          <Field label="Title" name="title" defaultValue={current?.title} required />
          <Field label="YouTube ID or URL" name="youtubeId" defaultValue={current?.youtubeId} required />
          <Field label="Preacher / channel" name="preacher" defaultValue={current?.preacher} />
          <Field label="Languages" name="language" defaultValue={current?.language} />
          <Field
            label="Date"
            name="preachedAt"
            type="date"
            defaultValue={dateInput(current?.preachedAt)}
            required
          />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked={current?.published ?? true} />
            Published
          </label>
          <Field label="Description" name="description" type="textarea" defaultValue={current?.description} />
          <button className="btn btn-dark" type="submit">
            Save message
          </button>
        </form>
      </div>
    </div>
  );
}
