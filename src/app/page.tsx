import { PublicShell } from "@/components/PublicShell";
import { formatDate, formatShortDate, site } from "@/lib/site";
import { youtubeThumbUrl, youtubeWatchUrl } from "@/lib/youtube";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";

export default async function HomePage() {
  const [page, ministries, events, sermons, heroPhoto, photos, user] = await Promise.all([
    db.page.findUnique({ where: { slug: "home" } }),
    db.ministry.findMany({ orderBy: { sortOrder: "asc" }, take: 4 }),
    db.churchEvent.findMany({
      where: { published: true, startsAt: { gte: new Date() } },
      orderBy: { startsAt: "asc" },
      take: 4,
    }).then(async (upcoming) =>
      upcoming.length
        ? upcoming
        : db.churchEvent.findMany({
            where: { published: true },
            orderBy: { startsAt: "desc" },
            take: 4,
          }),
    ),
    db.sermon.findMany({
      where: { published: true },
      orderBy: { preachedAt: "desc" },
      take: 3,
    }),
    db.galleryImage.findFirst({ where: { placement: "hero" } }),
    db.galleryImage.findMany({
      where: { placement: "home" },
      orderBy: { createdAt: "desc" },
      take: 6,
    }).then(async (homePhotos) =>
      homePhotos.length
        ? homePhotos
        : db.galleryImage.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    ),
    getSessionUser(),
  ]);

  return (
    <PublicShell>
      <section className="relative overflow-hidden bg-shepherd-deep">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroPhoto?.url || "/images/real-congregation.jpg"}
            alt={heroPhoto?.title || "GSSAM congregation gathered for worship"}
            className="h-full w-full object-cover opacity-40"
          />
          <div className="hero-veil absolute inset-0" />
        </div>
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:py-24 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="text-cream">
            <p className="text-xs uppercase tracking-[0.28em] text-gold">
              Lutheran congregation · Fremont, CA
            </p>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] sm:text-6xl">
              {page?.title || site.name}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-gold-soft">
              {page?.excerpt || site.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/about" className="btn btn-gold">
                Welcome to GSSAM
              </Link>
              <Link href="/donate" className="btn btn-outline border-gold-soft text-cream">
                Give an offering
              </Link>
            </div>
            <p className="mt-6 text-sm text-gold-soft/80">{site.worship}</p>
          </div>
          <div className="hidden justify-self-end lg:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/banner.png"
              alt="The Good Shepherd"
              className="max-h-[32rem] w-auto drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-2 lg:items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/about.jpg"
          alt="GSSAM congregation"
          className="w-full rounded-3xl object-cover"
        />
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-gold">About GSSAM</p>
          <h2 className="mt-3 font-display text-4xl text-shepherd">
            A South Asian Lutheran family in Fremont
          </h2>
          <p className="mt-5 text-lg leading-8 text-ink/80">
            {page?.body.split("\n\n")[0]}
          </p>
          <p className="mt-4 text-lg leading-8 text-ink/80">
            We believe in the Triune God, gather around Word and sacrament, and
            sing traditional Lutheran hymns in Telugu, Hindi, Tamil, and English.
          </p>
          <Link href="/about" className="btn btn-dark mt-6">
            Read more
          </Link>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.25em] text-gold">Ministries</p>
            <h2 className="mt-3 font-display text-4xl text-shepherd">
              Life together beyond Sunday worship
            </h2>
            <p className="mt-4 text-lg leading-8 text-ink/80">
              Through Men’s Fellowship, Women’s Fellowship, Youth Fellowship, and
              Sunday School, GSSAM lives out its calling as a South Asian Lutheran
              congregation — worshiping, praying, and serving neighbors in Fremont.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ministries.map((ministry) => (
              <Link key={ministry.id} href={`/ministries/${ministry.slug}`} className="card group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ministry.imageUrl}
                  alt=""
                  className="h-44 w-full object-cover transition group-hover:scale-[1.02]"
                />
                <div className="p-4">
                  <h3 className="font-display text-xl text-shepherd">{ministry.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{ministry.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gold">Church events</p>
            <h2 className="mt-3 font-display text-4xl text-shepherd">Coming gatherings</h2>
          </div>
          <Link href="/events" className="text-sm font-medium text-burgundy">
            All events
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {events.map((event) => (
            <Link key={event.id} href={`/events/${event.slug}`} className="card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={event.imageUrl} alt="" className="h-40 w-full object-cover" />
              <div className="p-4">
                <p className="text-xs uppercase tracking-wide text-gold">
                  {formatShortDate(event.startsAt)}
                </p>
                <h3 className="mt-1 font-display text-xl text-shepherd">{event.title}</h3>
                <p className="mt-2 text-sm text-muted">{event.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-shepherd text-cream">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-gold">Messages</p>
              <h2 className="mt-3 font-display text-4xl">Worship from GSSAM Fremont</h2>
            </div>
            <Link href="/messages" className="text-sm text-gold">
              All messages
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {sermons.map((sermon) => (
              <a
                key={sermon.id}
                href={youtubeWatchUrl(sermon.youtubeId)}
                className="card bg-shepherd-soft text-cream"
                target="_blank"
                rel="noreferrer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={youtubeThumbUrl(sermon.youtubeId)}
                  alt=""
                  className="h-40 w-full object-cover"
                />
                <div className="p-4">
                  <p className="text-xs text-gold">{formatDate(sermon.preachedAt)}</p>
                  <h3 className="mt-2 font-display text-lg">{sermon.title}</h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-4xl text-shepherd">From the gallery</h2>
          <Link href="/gallery" className="text-sm text-burgundy">
            See all photos
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
          {photos.map((photo) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={photo.id}
              src={photo.url}
              alt={photo.title}
              className="h-44 w-full rounded-2xl object-cover md:h-56"
            />
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-cream">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-14 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-3xl text-shepherd">Join us this Sunday</h2>
            <p className="mt-2 text-ink/80">
              {site.address} · {site.worship}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="btn btn-dark">
              Plan a visit
            </Link>
            {user ? (
              <Link href={user.role === "ADMIN" ? "/admin" : "/member"} className="btn btn-gold">
                Open portal
              </Link>
            ) : (
              <Link href="/login" className="btn btn-gold">
                Member sign in
              </Link>
            )}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
