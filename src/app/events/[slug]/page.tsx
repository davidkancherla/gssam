import { PublicShell } from "@/components/PublicShell";
import { PageHero, Prose } from "@/components/ui";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/site";
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
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-14 lg:grid-cols-[1.2fr_0.8fr]">
        <Prose text={event.body} />
        <aside className="card overflow-hidden">
          {event.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={event.imageUrl} alt="" className="h-56 w-full object-cover" />
          ) : null}
          <div className="p-5 text-sm leading-7">
            <p>
              <strong>When.</strong> {formatDate(event.startsAt)}
            </p>
            <p>
              <strong>Where.</strong> {event.location}
            </p>
          </div>
        </aside>
      </section>
    </PublicShell>
  );
}
