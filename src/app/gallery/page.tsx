import { PublicShell } from "@/components/PublicShell";
import { PageHero } from "@/components/ui";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "Gallery" };

export default async function GalleryPage() {
  const photos = await db.galleryImage.findMany({
    orderBy: [{ album: "asc" }, { createdAt: "desc" }],
  });
  const albums = [...new Set(photos.map((photo) => photo.album))];

  return (
    <PublicShell>
      <PageHero
        eyebrow="Life together"
        title="Gallery"
        lede="Photos from worship, fellowship, and congregation life at GSSAM in Fremont. Admins can add new pictures from the church portal."
      />
      <section className="mx-auto max-w-6xl px-4 py-14">
        {albums.map((album) => (
          <div key={album} className="mb-12">
            <h2 className="font-display text-3xl text-shepherd">{album}</h2>
            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {photos
                .filter((photo) => photo.album === album)
                .map((photo) => (
                  <figure key={photo.id} className="overflow-hidden rounded-2xl bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.url}
                      alt={photo.caption || photo.title}
                      className="h-44 w-full object-cover md:h-52"
                    />
                    <figcaption className="px-3 py-2 text-sm text-muted">
                      {photo.title}
                    </figcaption>
                  </figure>
                ))}
            </div>
          </div>
        ))}
      </section>
    </PublicShell>
  );
}
