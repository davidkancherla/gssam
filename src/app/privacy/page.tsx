import { PublicShell } from "@/components/PublicShell";
import { PageHero, Prose } from "@/components/ui";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

export const metadata = { title: "Privacy Policy" };

export default async function PrivacyPage() {
  const page = await db.page.findUnique({ where: { slug: "privacy" } });
  if (!page) notFound();

  return (
    <PublicShell>
      <PageHero eyebrow="Legal" title={page.title} lede={page.excerpt} />
      <section className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-[720px] px-5 py-14 sm:px-6 md:py-20">
          <Prose text={page.body} />
        </div>
      </section>
    </PublicShell>
  );
}
