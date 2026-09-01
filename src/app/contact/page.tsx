import { ContactForm } from "@/app/contact/contact-form";
import { IsolatedMap } from "@/components/IsolatedMap";
import { PublicShell } from "@/components/PublicShell";
import { PageHero, Prose } from "@/components/ui";
import { db } from "@/lib/db";
import { site } from "@/lib/site";
import { notFound } from "next/navigation";

export const metadata = { title: "Contact Us" };

export default async function ContactPage() {
  const page = await db.page.findUnique({ where: { slug: "contact" } });
  if (!page) notFound();

  return (
    <PublicShell>
      <PageHero eyebrow="Visit & write" title={page.title} lede={page.excerpt} />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-2">
        <div>
          <Prose text={page.body} />
          <div className="mt-8 space-y-4 text-sm leading-7">
            <p>
              <strong>Address.</strong> {site.address}
            </p>
            <p>
              <strong>Phone.</strong>{" "}
              <a className="text-burgundy underline" href={site.phoneHref}>
                {site.phone}
              </a>
            </p>
            <p>
              <strong>Email.</strong>{" "}
              <a className="text-burgundy underline" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </p>
          </div>
          <IsolatedMap src={site.mapEmbed} title="Map to GSSAM" />
        </div>
        <ContactForm />
      </section>
    </PublicShell>
  );
}
