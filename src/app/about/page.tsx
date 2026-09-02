import { PublicShell } from "@/components/PublicShell";
import { Prose } from "@/components/ui";
import { db } from "@/lib/db";
import { site } from "@/lib/site";
import { Church } from "lucide-react";
import { notFound } from "next/navigation";

export const metadata = { title: "About Us" };

export default async function AboutPage() {
  const page = await db.page.findUnique({ where: { slug: "about" } });
  if (!page) notFound();

  return (
    <PublicShell>
      <section className="relative overflow-hidden bg-maroon-deep text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${page.imageUrl || "/images/real-communion-wide.jpg"}')` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 md:py-20">
          <h1 className="font-display text-3xl font-bold sm:text-5xl">{page.title}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-amber-100/85 sm:text-base">
            {page.excerpt}
          </p>
          <div className="ornament-divider mt-6">
            <span className="text-lg text-amber-300" aria-hidden="true">
              ✦
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <Prose text={page.body} />
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-14 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl bg-maroon-deep p-8 text-amber-50 shadow-lg sm:p-10">
          <div className="pattern-dots absolute inset-0 opacity-40" aria-hidden="true" />
          <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:gap-8 sm:text-left">
            <span className="inline-flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-saffron/20 ring-2 ring-gold">
              <Church className="h-9 w-9 text-amber-300" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">Our Pastor</p>
              <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl">{site.pastor}</h2>
              <p className="mt-3 text-sm leading-relaxed text-amber-50/85 sm:text-base">
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
