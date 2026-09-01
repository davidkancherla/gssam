import { PublicShell } from "@/components/PublicShell";
import { PageHero, Prose } from "@/components/ui";
import { db } from "@/lib/db";
import { site } from "@/lib/site";
import { notFound } from "next/navigation";

export const metadata = { title: "Giving" };

export default async function DonatePage() {
  const page = await db.page.findUnique({ where: { slug: "donate" } });
  if (!page) notFound();

  return (
    <PublicShell>
      <PageHero eyebrow="Stewardship" title={page.title} lede={page.excerpt} />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1.15fr_0.85fr]">
        <Prose text={page.body} />
        <aside className="space-y-4">
          <div className="card p-6">
            <h2 className="font-display text-2xl text-shepherd">Give online</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7">
              <li>
                <strong>PayPal</strong> — {site.paypalEmail}
                <br />
                Reminder: use Donation / gift to friend.
              </li>
              <li>
                <strong>Zelle</strong> — {site.zelleEmail}
              </li>
              <li>
                <strong>Checks</strong> mailed or bill-pay to {site.address}
              </li>
            </ul>
            <a className="btn btn-gold mt-6" href={`mailto:${site.paypalEmail}`}>
              Email the church office
            </a>
          </div>
          <div className="card p-6 text-sm leading-7 text-muted">
            GSSAM is a church (EIN {site.ein}). Member giving statements live in
            the signed-in member portal and are visible only to that household
            and to administrators.
          </div>
        </aside>
      </section>
    </PublicShell>
  );
}
