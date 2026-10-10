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
        image="/images/real-congregation.jpg"
      />
      {albums.map((album, index) => (
        <section key={album} className={index % 2 === 0 ? "bg-[#f5f5f7]" : "bg-white"}>
          <div className="mx-auto max-w-[1080px] px-5 py-16 sm:px-6 md:py-20">
            <h2
              className="headline text-[clamp(1.75rem,4vw,2.5rem)] text-[#1d1d1f]"
              data-reveal
            >
              {album}
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {photos
                .filter((photo) => photo.album === album)
                .map((photo, i) => (
                  <figure key={photo.id} data-reveal style={{ transitionDelay: `${(i % 4) * 70}ms` }}>
                    <div className="overflow-hidden rounded-[1.25rem] bg-[#e8e8ed]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.url}
                        alt={photo.caption || photo.title}
                        loading="lazy"
                        className="aspect-square w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                      />
                    </div>
                    <figcaption className="mt-2 px-1 text-[13px] text-[#6e6e73]">{photo.title}</figcaption>
                  </figure>
                ))}
            </div>
          </div>
        </section>
      ))}
    </PublicShell>
  );
}
