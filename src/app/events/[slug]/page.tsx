import { PublicShell } from "@/components/PublicShell";
import { PageHero, Prose } from "@/components/ui";
import { db } from "@/lib/db";
import { formatDate, site } from "@/lib/site";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await db.churchEvent.findUnique({ where: { slug } });
  if (!event || !event.published) notFound();

  return (
    <PublicShell>
      <PageHero
        eyebrow={formatDate(event.startsAt)}
        title={event.title}
        lede={event.summary}
        image={event.imageUrl}
      />
      <section className="bg-white">
        <div className="mx-auto grid max-w-[1080px] gap-10 px-5 py-16 sm:px-6 md:py-24 lg:grid-cols-[1fr_340px] lg:gap-16">
          <div data-reveal>
            <Prose text={event.body} />
            <Link href="/events" className="link-chevron mt-12 text-[17px]">
              All events
            </Link>
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start" data-reveal>
            <div className="rounded-[1.75rem] bg-[#f5f5f7] p-7">
              <dl className="divide-y divide-black/10 text-[15px]">
                <div className="pb-4">
                  <dt className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#6e6e73]">When</dt>
                  <dd className="mt-1 text-[17px] font-medium text-[#1d1d1f]">{formatDate(event.startsAt)}</dd>
                </div>
                <div className="pt-4">
                  <dt className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#6e6e73]">Where</dt>
                  <dd className="mt-1 text-[17px] font-medium text-[#1d1d1f]">{event.location}</dd>
                  <dd className="mt-3">
                    <a
                      href={site.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-chevron text-[15px]"
                    >
                      Get directions
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>
    </PublicShell>
  );
}
