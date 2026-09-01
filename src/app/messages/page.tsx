import { PublicShell } from "@/components/PublicShell";
import { PageHero } from "@/components/ui";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/site";

export const metadata = { title: "Messages" };

export default async function MessagesPage() {
  const sermons = await db.sermon.findMany({
    where: { published: true },
    orderBy: { preachedAt: "desc" },
  });

  return (
    <PublicShell>
      <PageHero
        eyebrow="Word & sacrament"
        title="Messages"
        lede="Sunday worship livestreams from GSSAM Fremont. Watch on YouTube and join us in person at 11:30 AM."
      />
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-8 md:grid-cols-2">
          {sermons.map((sermon, index) => (
            <article key={sermon.id} className="card">
              {index === 0 ? (
                <iframe
                  className="aspect-video w-full"
                  src={`https://www.youtube.com/embed/${sermon.youtubeId}`}
                  title={sermon.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <a
                  href={`https://www.youtube.com/watch?v=${sermon.youtubeId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://i.ytimg.com/vi/${sermon.youtubeId}/hqdefault.jpg`}
                    alt=""
                    className="aspect-video w-full object-cover"
                  />
                </a>
              )}
              <div className="p-5">
                <p className="text-xs uppercase tracking-wide text-gold">
                  {formatDate(sermon.preachedAt)}
                </p>
                <h2 className="mt-2 font-display text-2xl text-shepherd">{sermon.title}</h2>
                <p className="mt-2 text-sm text-muted">
                  {sermon.preacher} · {sermon.language}
                </p>
                <p className="mt-3 text-sm leading-6">{sermon.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
