import { PublicShell } from "@/components/PublicShell";
import { PageHero, Prose } from "@/components/ui";
import { db } from "@/lib/db";
import Link from "next/link";
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
      <PageHero eyebrow="Ministries" title={ministry.name} lede={ministry.summary} image={ministry.imageUrl} />
      <section className="bg-white">
        <div className="mx-auto max-w-[720px] px-5 py-16 sm:px-6 md:py-24" data-reveal>
          <Prose text={ministry.body} />
          <Link href="/ministries" className="link-chevron mt-12 text-[17px]">
            All ministries
          </Link>
        </div>
      </section>
    </PublicShell>
  );
}
