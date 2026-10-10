import { ContactForm } from "@/app/contact/contact-form";
import { IsolatedMap } from "@/components/IsolatedMap";
import { PublicShell } from "@/components/PublicShell";
import { PageHero, Prose } from "@/components/ui";
import { db } from "@/lib/db";
import { site } from "@/lib/site";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { YoutubeIcon } from "@/components/brand-icons";
import { notFound } from "next/navigation";

export const metadata = { title: "Contact Us" };

export default async function ContactPage() {
  const page = await db.page.findUnique({ where: { slug: "contact" } });
  if (!page) notFound();

  const rows = [
    { icon: Clock, label: "Sunday Worship", value: site.worship },
    { icon: MapPin, label: "Address", value: site.address, href: site.mapUrl, external: true },
    { icon: Phone, label: "Phone", value: site.phone, href: site.phoneHref },
    { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
    { icon: YoutubeIcon, label: "YouTube", value: site.youtubeHandle, href: site.youtube, external: true },
  ];

  return (
    <PublicShell>
      <PageHero
        eyebrow="Visit & write"
        title={page.title}
        lede={page.excerpt}
        image="/images/real-communion-line.jpg"
      />
      <section className="bg-[#f5f5f7]">
        <div className="mx-auto grid max-w-[1080px] gap-4 px-5 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:gap-6">
          <div className="space-y-4" data-reveal>
            <div className="tile p-7 sm:p-9">
              <h2 className="headline text-[clamp(1.75rem,4vw,2.5rem)] text-[#1d1d1f]">Plan Your Visit</h2>
              <Prose className="mt-4 text-[17px]! sm:text-[17px]!" text={page.body} />
              <ul className="mt-6 divide-y divide-black/10 border-t border-black/10">
                {rows.map(({ icon: Icon, label, value, href, external }) => (
                  <li key={label} className="flex items-start gap-4 py-4">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-[#1d1d1f]">{label}</p>
                      {href ? (
                        <a
                          href={href}
                          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className="break-words text-[16px] text-[#6e6e73] hover:text-accent hover:underline"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="text-[16px] text-[#6e6e73]">{value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <IsolatedMap src={site.mapEmbed} title="Map to GSSAM Fremont" />
          </div>
          <div data-reveal style={{ transitionDelay: "100ms" }}>
            <ContactForm />
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
