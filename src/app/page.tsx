import Link from "next/link";
import {
  BookOpen,
  Clock,
  HeartHandshake,
  Languages,
  MapPin,
} from "lucide-react";
import { YoutubeIcon } from "@/components/brand-icons";
import { LiveHero } from "@/components/LiveHero";
import { PublicShell } from "@/components/PublicShell";
import { db } from "@/lib/db";
import { applySermonCatalog } from "@/lib/sermon-catalog";
import { BISHOP_VISIT, formatDate, formatShortDate, site } from "@/lib/site";
import { WELCOME_HOME_DEFAULTS } from "@/lib/gallery-placement";
import { youtubeEmbedUrl } from "@/lib/youtube";

export default async function HomePage() {
  const [page, events, sermons, photos, welcomeLeft, welcomeRight] = await Promise.all([
    db.page.findUnique({ where: { slug: "home" } }),
    db.churchEvent.findMany({
      where: { published: true, startsAt: { gte: new Date() } },
      orderBy: { startsAt: "asc" },
      take: 3,
    }).then(async (upcoming) =>
      upcoming.length
        ? upcoming
        : db.churchEvent.findMany({
            where: { published: true },
            orderBy: { startsAt: "desc" },
            take: 3,
          }),
    ),
    db.sermon.findMany({
      where: { published: true },
      orderBy: { preachedAt: "desc" },
      take: 1,
    }),
    db.galleryImage.findMany({
      where: { placement: "home" },
      orderBy: { createdAt: "desc" },
      take: 4,
    }).then(async (homePhotos) =>
      homePhotos.length
        ? homePhotos
        : db.galleryImage.findMany({ orderBy: { createdAt: "desc" }, take: 4 }),
    ),
    db.galleryImage.findFirst({ where: { placement: "welcome-left" } }),
    db.galleryImage.findFirst({ where: { placement: "welcome-right" } }),
  ]);

  const latestSermon = applySermonCatalog(sermons)[0];
  const heroImage = page?.imageUrl || BISHOP_VISIT.image;
  const heroCaption = heroImage === BISHOP_VISIT.image ? BISHOP_VISIT.caption : undefined;

  return (
    <PublicShell>
      <LiveHero imageUrl={heroImage} caption={heroCaption} />

      {/* Welcome — light gray band */}
      <section className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1080px] px-5 py-20 sm:px-6 md:py-28">
          <div className="mx-auto max-w-[760px] text-center" data-reveal>
            <p className="eyebrow">Welcome Home</p>
            <h2 className="headline mt-2 text-[clamp(2rem,5.5vw,3.5rem)] text-[#1d1d1f]">
              A South Asian family in the Lutheran tradition
            </h2>
            <p className="mt-6 text-[17px] leading-[1.6] text-[#1d1d1f]/80 sm:text-[19px]">
              Since 1988, Good Shepherd South Asian Ministry has gathered in Fremont to worship
              the Lord Jesus Christ through the timeless hymns of the Lutheran church — sung in the
              heart languages of our people: Telugu, Hindi, and English.
            </p>
            <p className="mt-4 text-[17px] leading-[1.6] text-[#1d1d1f]/80 sm:text-[19px]">
              Whether you are new to the Bay Area, exploring faith, or looking for a church that
              feels like home, there is a seat saved for you this Sunday.
            </p>
            <Link href="/about" className="link-chevron mt-6 text-[17px]">
              Learn our story
            </Link>
          </div>

          <div className="mt-14 grid gap-3 sm:grid-cols-2 sm:gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={welcomeLeft?.url || WELCOME_HOME_DEFAULTS.left.url}
              alt={welcomeLeft?.caption || welcomeLeft?.title || WELCOME_HOME_DEFAULTS.left.alt}
              className="aspect-[4/3] w-full rounded-[1.75rem] object-cover"
              data-reveal
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={welcomeRight?.url || WELCOME_HOME_DEFAULTS.right.url}
              alt={welcomeRight?.caption || welcomeRight?.title || WELCOME_HOME_DEFAULTS.right.alt}
              className="aspect-[4/3] w-full rounded-[1.75rem] object-cover"
              data-reveal
              style={{ transitionDelay: "120ms" }}
            />
          </div>

          <div className="mt-3 grid gap-3 sm:mt-4 sm:grid-cols-3 sm:gap-4">
            {[
              { icon: Clock, title: "Sunday Worship", text: site.worship },
              { icon: MapPin, title: "Find Us", text: site.address, href: site.mapUrl },
              { icon: Languages, title: "We Worship In", text: site.languages.join(" · ") },
            ].map(({ icon: Icon, title, text, href }, i) => (
              <div
                key={title}
                className="tile p-7 text-center sm:p-8"
                data-reveal
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <Icon className="mx-auto h-7 w-7 text-accent" strokeWidth={1.6} aria-hidden="true" />
                <h3 className="mt-4 text-[19px] font-semibold text-[#1d1d1f]">{title}</h3>
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-[15px] text-[#6e6e73] hover:text-accent hover:underline"
                  >
                    {text}
                  </a>
                ) : (
                  <p className="mt-1 text-[15px] text-[#6e6e73]">{text}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest service — the page's one dark band */}
      {latestSermon ? (
        <section className="bg-black text-white">
          <div className="mx-auto max-w-[1080px] px-5 py-20 sm:px-6 md:py-28">
            <div className="mx-auto max-w-[760px] text-center" data-reveal>
              <p className="text-[13px] font-semibold text-gold-bright">Latest Service</p>
              <h2 className="headline mt-2 text-[clamp(2rem,5vw,3.25rem)]">{latestSermon.title}</h2>
              <p className="mt-3 text-[15px] text-white/60">{formatDate(latestSermon.preachedAt)}</p>
            </div>
            <div
              className="mt-10 aspect-video overflow-hidden rounded-[1.5rem] bg-[#1d1d1f] ring-1 ring-white/10 sm:rounded-[2rem]"
              data-reveal="zoom"
            >
              <iframe
                src={youtubeEmbedUrl(latestSermon.youtubeId)}
                title={latestSermon.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="mx-auto mt-10 max-w-[640px] text-center" data-reveal>
              <p className="text-[17px] leading-[1.6] text-white/75">
                Missed a Sunday? Every service is streamed and archived on our YouTube channel,
                {` ${site.youtubeHandle}`} — worship with us anytime, anywhere.
              </p>
              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/messages" className="btn btn-light w-full max-w-xs sm:w-auto">
                  <BookOpen className="h-4 w-4" aria-hidden="true" /> Browse Sermon Archive
                </Link>
                <a
                  href={site.youtubeSubscribe}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-light w-full max-w-xs sm:w-auto"
                >
                  <YoutubeIcon className="h-4 w-4" /> Subscribe
                </a>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Upcoming events — white band */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1080px] px-5 py-20 sm:px-6 md:py-28">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" data-reveal>
            <div>
              <p className="eyebrow">This Week &amp; Beyond</p>
              <h2 className="headline mt-2 text-[clamp(2rem,5vw,3.25rem)] text-[#1d1d1f]">Upcoming at GSSAM</h2>
            </div>
            <Link href="/events" className="link-chevron text-[17px]">
              Full calendar
            </Link>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {events.map((event, i) => (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
                className="tile tile-link group flex flex-col bg-[#f5f5f7]"
                data-reveal
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <div className="overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={event.imageUrl} alt="" className="aspect-[16/10] w-full object-cover" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-accent">
                    {formatShortDate(event.startsAt)}
                  </p>
                  <h3 className="mt-2 text-[21px] font-semibold leading-tight tracking-tight text-[#1d1d1f]">
                    {event.title}
                  </h3>
                  <p className="mt-2 flex-1 text-[15px] leading-[1.5] text-[#6e6e73]">{event.summary}</p>
                  <span className="link-chevron mt-4 text-[15px]">Learn more</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Community in pictures — gray band */}
      <section className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1080px] px-5 py-20 sm:px-6 md:py-28">
          <div className="text-center" data-reveal>
            <p className="eyebrow">Life Together</p>
            <h2 className="headline mt-2 text-[clamp(2rem,5vw,3.25rem)] text-[#1d1d1f]">
              Our Community in Pictures
            </h2>
            <Link href="/gallery" className="link-chevron mt-4 text-[17px]">
              See the gallery
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {photos.map((photo, i) => (
              <figure
                key={photo.id}
                className="group relative overflow-hidden rounded-[1.25rem] sm:rounded-[1.5rem]"
                data-reveal
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] md:min-h-52"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-4 pb-3 pt-10 text-[13px] font-medium text-white">
                  {photo.title}
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-14 text-center" data-reveal>
            <Link href="/donate" className="btn btn-primary">
              <HeartHandshake className="h-[18px] w-[18px]" aria-hidden="true" /> Support Our Ministry
            </Link>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
