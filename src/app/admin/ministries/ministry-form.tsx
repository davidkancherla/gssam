import { Field } from "@/components/ui";

export function MinistryForm({
  current,
}: {
  current?: {
    id: string;
    name: string;
    slug: string;
    summary: string;
    body: string;
    imageUrl: string;
    sortOrder: number;
  };
}) {
  return (
    <form
      action="/api/admin/ministries"
      method="post"
      encType="multipart/form-data"
      className="card space-y-4 p-6"
      {...{ enctype: "multipart/form-data" }}
    >
      <h2 className="font-display text-2xl">{current ? "Edit ministry" : "Add ministry"}</h2>
      {current ? <input type="hidden" name="id" value={current.id} /> : null}
      <Field label="Name" name="name" defaultValue={current?.name} required />
      <Field label="Web name" name="slug" defaultValue={current?.slug} />
      <p className="-mt-2 text-xs text-muted">
        Used in the page address. Leave blank to use the ministry name.
      </p>
      <Field label="Summary" name="summary" defaultValue={current?.summary} />
      <div className="space-y-2">
        {current?.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={current.imageUrl} alt="" className="h-36 w-full rounded-xl object-cover" />
        ) : null}
        <Field label="Photo" name="file">
          <input className="input" name="file" type="file" accept="image/*" />
        </Field>
        <p className="text-xs text-muted">
          Choose a JPG or PNG. Leave empty to keep the current photo.
        </p>
      </div>
      <Field
        label="Order on the homepage"
        name="sortOrder"
        type="number"
        defaultValue={current?.sortOrder ?? 0}
      />
      <Field label="Full description" name="body" type="textarea" defaultValue={current?.body} />
      <button className="btn btn-dark" type="submit">
        Save ministry
      </button>
    </form>
  );
}
