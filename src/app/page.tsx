import Link from "next/link";
import {
  ArrowRight,
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

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Welcome Home</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-maroon sm:text-4xl">
              A South Asian family in the Lutheran tradition
            </h2>
            <p className="mt-4 leading-relaxed text-foreground/85">
              Since 1988, Good Shepherd South Asian Ministry has gathered in Fremont to worship
              the Lord Jesus Christ through the timeless hymns of the Lutheran church — sung in the
              heart languages of our people: Telugu, Hindi, Tamil, and English.
            </p>
            <p className="mt-3 leading-relaxed text-foreground/85">
              Whether you are new to the Bay Area, exploring faith, or looking for a church that
              feels like home, there is a seat saved for you this Sunday.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-flex items-center gap-2 font-semibold text-maroon hover:gap-3"
            >
              Learn our story <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={welcomeLeft?.url || WELCOME_HOME_DEFAULTS.left.url}
              alt={welcomeLeft?.caption || welcomeLeft?.title || WELCOME_HOME_DEFAULTS.left.alt}
              className="h-48 w-full rounded-xl object-cover shadow-md"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={welcomeRight?.url || WELCOME_HOME_DEFAULTS.right.url}
              alt={welcomeRight?.caption || welcomeRight?.title || WELCOME_HOME_DEFAULTS.right.alt}
              className="mt-8 h-48 w-full rounded-xl object-cover shadow-md"
            />
          </div>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {[
            { icon: Clock, title: "Sunday Worship", text: site.worship },
            { icon: MapPin, title: "Find Us", text: site.address },
            { icon: Languages, title: "We Worship In", text: site.languages.join(" · ") },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-xl bg-card p-6 text-center shadow-sm ring-1 ring-border">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-saffron/25 text-maroon">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 font-display text-lg font-bold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {latestSermon ? (
        <section className="pattern-dots bg-secondary/60">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
            <div className="aspect-video overflow-hidden rounded-xl bg-black shadow-xl ring-1 ring-border">
              <iframe
                src={youtubeEmbedUrl(latestSermon.youtubeId)}
                title={latestSermon.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Latest Service</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-maroon">{latestSermon.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{formatDate(latestSermon.preachedAt)}</p>
              <p className="mt-4 leading-relaxed text-foreground/85">
                Missed a Sunday? Every service is streamed and archived on our YouTube channel,
                {` ${site.youtubeHandle}`} — worship with us anytime, anywhere.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/messages"
                  className="inline-flex items-center gap-2 rounded-md bg-maroon px-5 py-2.5 font-semibold text-white hover:bg-maroon-deep"
                >
                  <BookOpen className="h-4 w-4" /> Browse Sermon Archive
                </Link>
                <a
                  href={site.youtubeSubscribe}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-red-600 px-5 py-2.5 font-semibold text-white hover:bg-red-700"
                >
                  <YoutubeIcon className="h-4 w-4" /> Subscribe
                </a>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">This Week &amp; Beyond</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-maroon sm:text-4xl">Upcoming at GSSAM</h2>
          </div>
          <Link href="/events" className="inline-flex items-center gap-2 font-semibold text-maroon hover:gap-3">
            Full calendar <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {events.map((event) => (
            <Link key={event.id} href={`/events/${event.slug}`} className="card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={event.imageUrl} alt="" className="h-40 w-full object-cover" />
              <div className="p-4">
                <p className="text-xs uppercase tracking-wide text-gold">{formatShortDate(event.startsAt)}</p>
                <h3 className="mt-1 font-display text-xl font-bold text-maroon">{event.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{event.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-maroon-deep py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">Life Together</p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Our Community in Pictures</h2>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {photos.map((photo) => (
              <figure key={photo.id} className="group relative overflow-hidden rounded-xl ring-1 ring-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105 md:h-52"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2.5 text-xs text-white">
                  {photo.title}
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/donate"
              className="inline-flex items-center gap-2 rounded-md bg-saffron px-6 py-3 font-bold text-maroon-deep hover:brightness-110"
            >
              <HeartHandshake className="h-5 w-5" /> Support Our Ministry
            </Link>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
