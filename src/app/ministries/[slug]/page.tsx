import { PublicShell } from "@/components/PublicShell";
import { PageHero, Prose } from "@/components/ui";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function MinistryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ministry = await db.ministry.findUnique({ where: { slug } });
  if (!ministry) notFound();

  return (
    <PublicShell>
      <PageHero title={ministry.name} lede={ministry.summary} image={ministry.imageUrl} />
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        {ministry.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={ministry.imageUrl}
            alt=""
            className="w-full rounded-3xl object-cover"
          />
        ) : null}
        <Prose text={ministry.body} />
      </section>
    </PublicShell>
  );
}
