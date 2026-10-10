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
        image="/images/real-palm-sunday.jpg"
      />
      <section className="bg-[#f5f5f7]">
        <div className="mx-auto grid max-w-[1080px] gap-4 px-5 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          {events.map((event, i) => (
            <Link
              key={event.id}
              href={`/events/${event.slug}`}
              className="tile tile-link flex flex-col"
              data-reveal
              style={{ transitionDelay: `${(i % 2) * 90}ms` }}
            >
              <div className="overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={event.imageUrl} alt="" className="aspect-[16/9] w-full object-cover" />
              </div>
              <div className="flex flex-1 flex-col p-7 sm:p-8">
                <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-accent">
                  {formatDate(event.startsAt)}
                </p>
                <h2 className="mt-2 text-[26px] font-semibold leading-tight tracking-tight text-[#1d1d1f] sm:text-[28px]">
                  {event.title}
                </h2>
                <p className="mt-2 flex-1 text-[16px] leading-[1.55] text-[#6e6e73]">{event.summary}</p>
                <span className="link-chevron mt-5 text-[16px]">Event details</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
