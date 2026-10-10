import { PublicShell } from "@/components/PublicShell";
import { YoutubeIcon } from "@/components/brand-icons";
import { PageHero } from "@/components/ui";
import { db } from "@/lib/db";
import { applySermonCatalog } from "@/lib/sermon-catalog";
import { formatDate, site } from "@/lib/site";
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
      <section className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1080px] px-5 py-16 sm:px-6 md:py-24">
          <div className="mb-10 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center" data-reveal>
            <a
              href={site.youtubeLive}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <YoutubeIcon className="h-[18px] w-[18px]" /> Watch Sunday Worship Live
            </a>
            <a
              href={site.youtubeSubscribe}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              Subscribe to {site.youtubeHandle}
            </a>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {sermons.map((sermon, i) => (
              <article
                key={sermon.youtubeId}
                className="tile flex flex-col"
                data-reveal
                style={{ transitionDelay: `${(i % 2) * 90}ms` }}
              >
                <iframe
                  className="aspect-video w-full bg-black"
                  src={youtubeEmbedUrl(sermon.youtubeId)}
                  title={sermon.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <div className="flex flex-1 flex-col p-7">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-accent">
                    {formatDate(sermon.preachedAt)}
                  </p>
                  <h2 className="mt-2 text-[22px] font-semibold leading-tight tracking-tight text-[#1d1d1f] sm:text-[24px]">
                    {sermon.title}
                  </h2>
                  <p className="mt-1 text-[14px] text-[#6e6e73]">
                    {sermon.preacher} · {sermon.language}
                  </p>
                  <p className="mt-3 flex-1 text-[15px] leading-[1.55] text-[#1d1d1f]/80">{sermon.description}</p>
                  <a
                    className="link-chevron mt-4 text-[15px]"
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
        </div>
      </section>
    </PublicShell>
  );
}
