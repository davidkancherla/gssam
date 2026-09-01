import { Field } from "@/components/ui";

const PHOTO_PAGES = new Set(["home", "about"]);

export function PageEditor({
  page,
  gallery,
}: {
  page: { slug: string; title: string; excerpt: string; body: string; imageUrl: string };
  gallery: { id: string; url: string; title: string }[];
}) {
  const showPhoto = PHOTO_PAGES.has(page.slug);

  return (
    <form
      action="/api/admin/pages"
      method="post"
      encType="multipart/form-data"
      className="card space-y-4 p-6"
      {...{ enctype: "multipart/form-data" }}
    >
      <input type="hidden" name="slug" value={page.slug} />
      {showPhoto ? (
        <div className="space-y-3">
          {page.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={page.imageUrl}
              alt=""
              className="h-40 w-full rounded-xl object-cover"
            />
          ) : null}
          <Field
            label={page.slug === "home" ? "Homepage photo" : "About photo"}
            name="file"
          >
            <input className="input" name="file" type="file" accept="image/*" />
          </Field>
          {gallery.length ? (
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-shepherd">
                Or use a gallery photo
              </span>
              <select className="input" name="galleryUrl" defaultValue="">
                <option value="">Keep the current photo</option>
                {gallery.map((photo) => (
                  <option key={photo.id} value={photo.url}>
                    {photo.title}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <p className="text-xs text-muted">
            {page.slug === "home"
              ? "This is the large picture behind the welcome heading. A chosen file is saved on the server and used as the public hero."
              : "This picture appears on the About page and in the About section of the homepage."}
          </p>
        </div>
      ) : null}
      <Field label="Title" name="title" defaultValue={page.title} required />
      <Field
        label="Short introduction"
        name="excerpt"
        type="textarea"
        defaultValue={page.excerpt}
      />
      <Field label="Page content" name="body">
        <textarea className="input min-h-64" name="body" defaultValue={page.body} />
      </Field>
      <p className="text-xs text-muted">
        On Home, the title is the hero heading and the short introduction is the
        hero paragraph. On other pages, title and introduction appear in the page
        header. Separate body paragraphs with a blank line.
      </p>
      <button className="btn btn-dark" type="submit">
        Save {page.title}
      </button>
    </form>
  );
}
