import { deleteGalleryImage, saveGalleryMeta } from "@/app/actions/content";
import { GalleryUploadForm } from "@/app/admin/gallery/upload-form";
import { DeleteButton } from "@/components/DeleteButton";
import { Field, SavedNotice } from "@/components/ui";
import { db } from "@/lib/db";

export const metadata = { title: "Gallery CMS" };

export default async function AdminGallery({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const params = await searchParams;
  const photos = await db.galleryImage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="font-display text-4xl text-shepherd">Gallery photos</h1>
      <p className="text-ink/80">
        Upload a picture for the public gallery. Choose Homepage gallery or
        Homepage hero so it can appear on the public home page. JPG, PNG, WEBP,
        or GIF up to 8 MB. Deleting an upload also removes the file.
      </p>
      <SavedNotice searchParams={params} />
      <GalleryUploadForm />
      <div className="grid gap-4 sm:grid-cols-2">
        {photos.map((photo) => (
          <article key={photo.id} className="card overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.url} alt={photo.title} className="h-40 w-full object-cover" />
            <form action={saveGalleryMeta} className="space-y-3 p-4">
              <input type="hidden" name="id" value={photo.id} />
              <Field label="Title" name="title" defaultValue={photo.title} />
              <Field label="Album" name="album" defaultValue={photo.album} />
              <label className="text-sm">
                <span className="mb-1 block font-medium text-shepherd">Show on</span>
                <select className="input" name="placement" defaultValue={photo.placement}>
                  <option value="gallery">Gallery only</option>
                  <option value="home">Homepage gallery</option>
                  <option value="hero">Homepage hero</option>
                </select>
              </label>
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
