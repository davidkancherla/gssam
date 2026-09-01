import { PublicShell } from "@/components/PublicShell";
import { PageHero } from "@/components/ui";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/site";
import Link from "next/link";

export const metadata = { title: "Church Events" };

export default async function EventsPage() {
  const events = await db.churchEvent.findMany({
    where: { published: true },
    orderBy: { startsAt: "asc" },
  });

  return (
    <PublicShell>
      <PageHero
        eyebrow="Calendar"
        title="Church events"
        lede="Worship feasts, fellowship, and neighbor-care gatherings at 4211 Carol Ave."
      />
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-6 md:grid-cols-2">
          {events.map((event) => (
            <Link key={event.id} href={`/events/${event.slug}`} className="card flex flex-col sm:flex-row">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={event.imageUrl}
                alt=""
                className="h-44 w-full object-cover sm:h-auto sm:w-52"
              />
              <div className="p-5">
                <p className="text-xs uppercase tracking-wide text-gold">
                  {formatDate(event.startsAt)}
                </p>
                <h2 className="mt-2 font-display text-2xl text-shepherd">{event.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{event.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
