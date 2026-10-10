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
      <PageHero
        eyebrow="Our story"
        title={page.title}
        lede={page.excerpt}
        image={page.imageUrl || "/images/real-communion-wide.jpg"}
      />

      <section className="bg-white">
        <div className="mx-auto max-w-[720px] px-5 py-16 sm:px-6 md:py-24" data-reveal>
          <Prose text={page.body} />
        </div>
      </section>

      <section className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1080px] px-5 py-16 sm:px-6 md:py-24">
          <div
            className="tile grid items-center gap-8 p-8 sm:p-12 md:grid-cols-[auto_1fr] md:gap-12"
            data-reveal
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/favicon.png"
              alt="GSSAM logo"
              className="mx-auto h-28 w-28 rounded-full object-cover ring-1 ring-black/10 md:h-36 md:w-36"
            />
            <div className="text-center md:text-left">
              <p className="eyebrow">Our Pastor</p>
              <h2 className="headline mt-2 text-[clamp(2rem,4.5vw,3rem)] text-[#1d1d1f]">{site.pastor}</h2>
              <p className="mt-4 text-[17px] leading-[1.6] text-[#1d1d1f]/80">
                Pastor Anand shepherds our congregation with a heart for South Asian families —
                preaching the Word, administering the Sacraments, and leading worship in the
                languages of our people. He and his family would love to welcome you this Sunday.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
