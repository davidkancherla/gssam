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
      <PageHero title={page.title} lede={page.excerpt} />
      <section className="mx-auto max-w-3xl px-4 py-14">
        <Prose text={page.body} />
      </section>
    </PublicShell>
  );
}
