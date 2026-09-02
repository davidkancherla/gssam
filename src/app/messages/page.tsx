import { PublicShell } from "@/components/PublicShell";
import { PageHero } from "@/components/ui";
import { db } from "@/lib/db";
import { applySermonCatalog } from "@/lib/sermon-catalog";
import { formatDate } from "@/lib/site";
import { youtubeEmbedUrl, youtubeWatchUrl } from "@/lib/youtube";

export const metadata = { title: "Sermons" };

export default async function MessagesPage() {
  const rows = await db.sermon.findMany({
    where: { published: true },
    orderBy: { preachedAt: "desc" },
  });
  const sermons = applySermonCatalog(rows).sort(
    (a, b) => b.preachedAt.getTime() - a.preachedAt.getTime(),
  );

  return (
    <PublicShell>
      <PageHero
        eyebrow="Word & sacrament"
        title="Sermons"
        lede="Sunday worship livestreams from GSSAM Fremont. Watch on YouTube and join us in person at 11:30 AM."
        image="/images/real-altar-candles.jpg"
      />
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-8 md:grid-cols-2">
          {sermons.map((sermon) => (
            <article key={sermon.youtubeId} className="card">
              <iframe
                className="aspect-video w-full"
                src={youtubeEmbedUrl(sermon.youtubeId)}
                title={sermon.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <div className="p-5">
                <p className="text-xs uppercase tracking-wide text-gold">
                  {formatDate(sermon.preachedAt)}
                </p>
                <h2 className="mt-2 font-display text-2xl text-shepherd">{sermon.title}</h2>
                <p className="mt-2 text-sm text-muted">
                  {sermon.preacher} · {sermon.language}
                </p>
                <p className="mt-3 text-sm leading-6">{sermon.description}</p>
                <a
                  className="mt-3 inline-block text-sm text-burgundy underline"
                  href={youtubeWatchUrl(sermon.youtubeId)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open on YouTube
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
