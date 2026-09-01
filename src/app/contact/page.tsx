import { submitInquiry } from "@/app/actions/contact";
import { PublicShell } from "@/components/PublicShell";
import { Field, PageHero, Prose } from "@/components/ui";
import { db } from "@/lib/db";
import { site } from "@/lib/site";
import { notFound } from "next/navigation";

export const metadata = { title: "Contact Us" };

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const page = await db.page.findUnique({ where: { slug: "contact" } });
  const params = await searchParams;
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
          <div className="mt-8 overflow-hidden rounded-2xl border border-line">
            <iframe
              title="Map to GSSAM"
              src={site.mapEmbed}
              className="h-72 w-full"
              loading="lazy"
            />
          </div>
        </div>
        <form action={submitInquiry} className="card space-y-4 p-6">
          <h2 className="font-display text-2xl text-shepherd">Send a message</h2>
          {params.sent ? (
            <p className="rounded-lg bg-shepherd/10 p-3 text-sm text-shepherd">
              Thank you. The church office will see your note in the admin inbox.
            </p>
          ) : null}
          {params.error ? (
            <p className="rounded-lg bg-burgundy/10 p-3 text-sm text-burgundy">
              Please include your name, email, and a message.
            </p>
          ) : null}
          <Field label="Name" name="name" required />
          <Field label="Email" name="email" type="email" required />
          <Field label="Phone" name="phone" />
          <Field label="Message" name="message" type="textarea" required />
          <button className="btn btn-dark" type="submit">
            Send to GSSAM
          </button>
        </form>
      </section>
    </PublicShell>
  );
}
