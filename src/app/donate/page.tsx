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

  const ways = [
    {
      icon: Smartphone,
      title: "Zelle",
      body: (
        <>
          Send to <strong className="font-semibold text-[#1d1d1f] select-all">{site.zelleEmail}</strong>
        </>
      ),
    },
    {
      icon: HandCoins,
      title: "PayPal",
      body: (
        <>
          Send to <strong className="font-semibold text-[#1d1d1f] select-all">{site.paypalEmail}</strong> and
          choose Donation / gift to friend. There is no checkout button on this site.
        </>
      ),
    },
    {
      icon: Mail,
      title: "Check or bill pay",
      body: (
        <>
          Checks payable to <strong className="font-semibold text-[#1d1d1f]">GSSAM</strong> may be mailed
          to {site.address}.
        </>
      ),
    },
    {
      icon: Building2,
      title: "Where your gift goes",
      body: (
        <>
          GSSAM is a church (EIN {site.ein}). Member giving statements live in the signed-in member
          portal and are visible only to that household and to administrators.
        </>
      ),
    },
  ];

  return (
    <PublicShell>
      <PageHero eyebrow="Stewardship" title={page.title} lede={page.excerpt} image="/images/outreach.png" />

      <section className="bg-white">
        <div className="mx-auto max-w-[720px] px-5 py-16 sm:px-6 md:py-24" data-reveal>
          <Prose text={page.body} />
        </div>
      </section>
      {/* Ways to give — gray band */}
      <section className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1080px] px-5 py-16 sm:px-6 md:py-24">
          <h2
            className="headline text-center text-[clamp(2rem,5vw,3.25rem)] text-[#1d1d1f]"
            data-reveal
          >
            Ways to give.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {ways.map(({ icon: Icon, title, body }, i) => (
              <div
                key={title}
                className="tile p-8"
                data-reveal
                style={{ transitionDelay: `${(i % 2) * 90}ms` }}
              >
                <Icon className="h-7 w-7 text-accent" strokeWidth={1.6} aria-hidden="true" />
                <h3 className="mt-4 text-[22px] font-semibold tracking-tight text-[#1d1d1f]">{title}</h3>
                <p className="mt-2 text-[16px] leading-[1.55] text-[#6e6e73]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scripture — the page's one dark band */}
      <section className="bg-black text-white">
        <div className="mx-auto max-w-[880px] px-5 py-20 text-center sm:px-6 md:py-28" data-reveal>
          <p className="headline text-[clamp(1.6rem,4vw,2.75rem)] font-semibold leading-[1.2]">
            &ldquo;Each of you should give what you have decided in your heart to give, not reluctantly
            or under compulsion, for God loves a cheerful giver.&rdquo;
          </p>
          <p className="mt-6 text-[15px] font-medium text-gold-bright">— 2 Corinthians 9:7</p>
        </div>
      </section>

    </PublicShell>
  );
}
