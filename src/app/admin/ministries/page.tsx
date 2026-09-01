import { deleteMinistry, saveMinistry } from "@/app/actions/content";
import { DeleteButton } from "@/components/DeleteButton";
import { Field, SavedNotice } from "@/components/ui";
import { db } from "@/lib/db";

export const metadata = { title: "Ministries CMS" };

export default async function AdminMinistries({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; id?: string }>;
}) {
  const params = await searchParams;
  const ministries = await db.ministry.findMany({ orderBy: { sortOrder: "asc" } });
  const current = ministries.find((item) => item.id === params.id);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="font-display text-4xl text-shepherd">Ministries</h1>
      <SavedNotice searchParams={params} />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3">
          {ministries.map((ministry) => (
            <div key={ministry.id} className="card flex items-center justify-between p-4">
              <a href={`/admin/ministries?id=${ministry.id}`} className="font-medium text-shepherd">
                {ministry.name}
              </a>
              <DeleteButton
                label="Remove"
                confirmText="Remove this ministry from the public site?"
                action={deleteMinistry.bind(null, ministry.id)}
              />
            </div>
          ))}
        </div>
        <form action={saveMinistry} className="card space-y-4 p-6">
          <h2 className="font-display text-2xl">{current ? "Edit ministry" : "Add ministry"}</h2>
          {current ? <input type="hidden" name="id" value={current.id} /> : null}
          <Field label="Name" name="name" defaultValue={current?.name} required />
          <Field label="URL slug" name="slug" defaultValue={current?.slug} />
          <Field label="Summary" name="summary" defaultValue={current?.summary} />
          <Field label="Image path or uploaded URL" name="imageUrl" defaultValue={current?.imageUrl} />
          <Field label="Sort order" name="sortOrder" type="number" defaultValue={current?.sortOrder ?? 0} />
          <Field label="Full description" name="body" type="textarea" defaultValue={current?.body} />
          <button className="btn btn-dark" type="submit">
            Save ministry
          </button>
        </form>
      </div>
    </div>
  );
}
