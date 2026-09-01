import { PublicShell } from "@/components/PublicShell";
import { PageHero, Prose } from "@/components/ui";
import { db } from "@/lib/db";
import { site } from "@/lib/site";
import { notFound } from "next/navigation";

export const metadata = { title: "About Us" };

export default async function AboutPage() {
  const page = await db.page.findUnique({ where: { slug: "about" } });
  if (!page) notFound();

  return (
    <PublicShell>
      <PageHero eyebrow="Our story" title={page.title} lede={page.excerpt} />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1.2fr_0.8fr]">
        <Prose text={page.body} />
        <aside className="card h-fit p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Our pastor</p>
          <p className="mt-2 font-display text-2xl text-shepherd">{site.pastor}</p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Pastor Anand shepherds GSSAM with a heart for South Asian families —
            Word, Sacrament, and worship in Telugu, Hindi, Tamil, and English.
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-gold">Worship</p>
          <p className="mt-3 font-display text-2xl text-shepherd">{site.worship}</p>
          <p className="mt-4 text-sm leading-7 text-muted">
            {site.address}
            <br />
            {site.denomination}
            <br />
            Languages: {site.languages.join(", ")}
            <br />
            Formerly Good Shepherd Lutheran Church
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={page.imageUrl || "/images/real-congregation.jpg"}
            alt="GSSAM congregation"
            className="mt-6 w-full rounded-xl object-cover"
          />
        </aside>
      </section>
    </PublicShell>
  );
}
