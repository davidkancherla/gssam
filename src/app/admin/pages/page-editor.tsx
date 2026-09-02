import { Field } from "@/components/ui";
import { WELCOME_HOME_DEFAULTS } from "@/lib/gallery-placement";

const PHOTO_PAGES = new Set(["home", "about"]);

function PhotoPicker({
  label,
  fileName,
  galleryName,
  currentUrl,
  help,
  gallery,
}: {
  label: string;
  fileName: string;
  galleryName: string;
  currentUrl: string;
  help: string;
  gallery: { id: string; url: string; title: string }[];
}) {
  return (
    <div className="space-y-3">
      {currentUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={currentUrl} alt="" className="h-40 w-full rounded-xl object-cover" />
      ) : null}
      <Field label={label} name={fileName}>
        <input className="input" name={fileName} type="file" accept="image/*" />
      </Field>
      {gallery.length ? (
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-shepherd">Or use a gallery photo</span>
          <select className="input" name={galleryName} defaultValue="">
            <option value="">Keep the current photo</option>
            {gallery.map((photo) => (
              <option key={photo.id} value={photo.url}>
                {photo.title}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <p className="text-xs text-muted">{help}</p>
    </div>
  );
}

export function PageEditor({
  page,
  gallery,
  welcomeLeftUrl,
  welcomeRightUrl,
}: {
  page: { slug: string; title: string; excerpt: string; body: string; imageUrl: string };
  gallery: { id: string; url: string; title: string }[];
  welcomeLeftUrl?: string;
  welcomeRightUrl?: string;
}) {
  const showPhoto = PHOTO_PAGES.has(page.slug);
  const isHome = page.slug === "home";

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
        <PhotoPicker
          label={isHome ? "Homepage hero photo" : "About photo"}
          fileName="file"
          galleryName="galleryUrl"
          currentUrl={page.imageUrl}
          help={
            isHome
              ? "This is the homepage hero. The default is Pastor Anand Darla's ordination. A chosen file or gallery pick is saved and used on /."
              : "This picture appears in the About page header."
          }
          gallery={gallery}
        />
      ) : null}
      {isHome ? (
        <div className="grid gap-6 border-t border-line pt-4 sm:grid-cols-2">
          <PhotoPicker
            label="Welcome Home left photo"
            fileName="welcomeLeftFile"
            galleryName="welcomeLeftGalleryUrl"
            currentUrl={welcomeLeftUrl || WELCOME_HOME_DEFAULTS.left.url}
            help="Left picture beside Welcome Home. File upload or gallery pick, same Save as the hero."
            gallery={gallery}
          />
          <PhotoPicker
            label="Welcome Home right photo"
            fileName="welcomeRightFile"
            galleryName="welcomeRightGalleryUrl"
            currentUrl={welcomeRightUrl || WELCOME_HOME_DEFAULTS.right.url}
            help="Right picture beside Welcome Home (elders / fellowship). File upload or gallery pick."
            gallery={gallery}
          />
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
