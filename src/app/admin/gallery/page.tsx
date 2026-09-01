import { deleteGalleryImage, saveGalleryMeta, uploadGalleryImage } from "@/app/actions/content";
import { requireAdmin } from "@/lib/auth";
import { DeleteButton } from "@/components/DeleteButton";
import { Field, SavedNotice } from "@/components/ui";
import { db } from "@/lib/db";

export const metadata = { title: "Gallery CMS" };

export default async function AdminGallery({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const params = await searchParams;
  await requireAdmin();
  const photos = await db.galleryImage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="font-display text-4xl text-shepherd">Gallery photos</h1>
      <p className="text-ink/80">
        Upload a picture for the public gallery or homepage albums. JPG, PNG,
        WEBP, or GIF up to 8 MB.
      </p>
      <SavedNotice searchParams={params} />
      <form action={uploadGalleryImage} className="card grid gap-4 p-6 sm:grid-cols-2">
        <Field label="Photo" name="file">
          <input className="input" name="file" type="file" accept="image/*" required />
        </Field>
        <Field label="Title" name="title" />
        <Field label="Album" name="album" defaultValue="Congregation" />
        <Field label="Caption" name="caption" />
        <div className="sm:col-span-2">
          <button className="btn btn-dark" type="submit">
            Upload photo
          </button>
        </div>
      </form>
      <div className="grid gap-4 sm:grid-cols-2">
        {photos.map((photo) => (
          <article key={photo.id} className="card overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.url} alt={photo.title} className="h-40 w-full object-cover" />
            <form action={saveGalleryMeta} className="space-y-3 p-4">
              <input type="hidden" name="id" value={photo.id} />
              <Field label="Title" name="title" defaultValue={photo.title} />
              <Field label="Album" name="album" defaultValue={photo.album} />
              <Field label="Caption" name="caption" defaultValue={photo.caption} />
              <div className="flex items-center justify-between">
                <button className="btn btn-gold text-sm" type="submit">
                  Save caption
                </button>
                <DeleteButton
                  label="Delete"
                  confirmText="Delete this photo from the gallery?"
                  action={deleteGalleryImage.bind(null, photo.id)}
                />
              </div>
            </form>
          </article>
        ))}
      </div>
    </div>
  );
}
