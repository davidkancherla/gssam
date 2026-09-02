import { PublicShell } from "@/components/PublicShell";
import { PageHero, Prose } from "@/components/ui";
import { db } from "@/lib/db";
import { site } from "@/lib/site";
import { Building2, HandCoins, Mail, Smartphone } from "lucide-react";
import { notFound } from "next/navigation";

export const metadata = { title: "Give" };

export default async function DonatePage() {
  const page = await db.page.findUnique({ where: { slug: "donate" } });
  if (!page) notFound();

  return (
    <PublicShell>
      <PageHero
        eyebrow="Stewardship"
        title={page.title}
        lede={page.excerpt}
        image="/images/outreach.png"
      />
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <div className="rounded-2xl bg-maroon-deep p-6 text-center text-amber-50 shadow-md sm:p-8">
          <p className="font-display text-lg italic leading-relaxed sm:text-xl">
            &ldquo;Each of you should give what you have decided in your heart to give, not reluctantly
            or under compulsion, for God loves a cheerful giver.&rdquo;
          </p>
          <p className="mt-2 text-sm font-semibold tracking-wide text-amber-300">— 2 Corinthians 9:7</p>
        </div>

        <Prose className="mt-10" text={page.body} />

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <div className="rounded-xl bg-card p-6 shadow-sm ring-1 ring-border">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-saffron/25 text-maroon">
              <Smartphone className="h-5 w-5" />
            </span>
            <h2 className="mt-3 font-display text-lg font-bold">Zelle</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Send to <strong>{site.zelleEmail}</strong>
            </p>
          </div>
          <div className="rounded-xl bg-card p-6 shadow-sm ring-1 ring-border">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-saffron/25 text-maroon">
              <HandCoins className="h-5 w-5" />
            </span>
            <h2 className="mt-3 font-display text-lg font-bold">PayPal</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Send to <strong>{site.paypalEmail}</strong> and choose Donation / gift to friend.
              There is no checkout button on this site.
            </p>
          </div>
          <div className="rounded-xl bg-card p-6 shadow-sm ring-1 ring-border">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-saffron/25 text-maroon">
              <Mail className="h-5 w-5" />
            </span>
            <h2 className="mt-3 font-display text-lg font-bold">Check or bill pay</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Checks payable to <strong>GSSAM</strong> may be mailed to {site.address}.
            </p>
          </div>
          <div className="rounded-xl bg-card p-6 shadow-sm ring-1 ring-border">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-saffron/25 text-maroon">
              <Building2 className="h-5 w-5" />
            </span>
            <h2 className="mt-3 font-display text-lg font-bold">Where your gift goes</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              GSSAM is a church (EIN {site.ein}). Member giving statements live in the signed-in
              member portal and are visible only to that household and to administrators.
            </p>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
