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

  return (
    <PublicShell>
      <PageHero
        eyebrow="Visit & write"
        title={page.title}
        lede={page.excerpt}
        image="/images/real-communion-line.jpg"
      />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl font-bold text-maroon">Plan Your Visit</h2>
          <Prose className="mt-4" text={page.body} />
          <ul className="mt-6 space-y-4">
            <li className="flex gap-3 rounded-xl bg-card p-4 ring-1 ring-border">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <div>
                <p className="text-sm font-semibold">Sunday Worship</p>
                <p className="text-sm text-muted-foreground">{site.worship}</p>
              </div>
            </li>
            <li className="flex gap-3 rounded-xl bg-card p-4 ring-1 ring-border">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <div>
                <p className="text-sm font-semibold">Address</p>
                <a href={site.mapUrl} className="text-sm text-muted-foreground hover:text-maroon">
                  {site.address}
                </a>
              </div>
            </li>
            <li className="flex gap-3 rounded-xl bg-card p-4 ring-1 ring-border">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <div>
                <p className="text-sm font-semibold">Phone</p>
                <a href={site.phoneHref} className="text-sm text-muted-foreground hover:text-maroon">
                  {site.phone}
                </a>
              </div>
            </li>
            <li className="flex gap-3 rounded-xl bg-card p-4 ring-1 ring-border">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <div>
                <p className="text-sm font-semibold">Email</p>
                <a href={`mailto:${site.email}`} className="text-sm text-muted-foreground hover:text-maroon">
                  {site.email}
                </a>
              </div>
            </li>
            <li className="flex gap-3 rounded-xl bg-card p-4 ring-1 ring-border">
              <YoutubeIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <div>
                <p className="text-sm font-semibold">YouTube</p>
                <a href={site.youtube} className="text-sm text-muted-foreground hover:text-maroon">
                  {site.youtubeHandle}
                </a>
              </div>
            </li>
          </ul>
          <IsolatedMap src={site.mapEmbed} title="Map to GSSAM Fremont" />
        </div>
        <ContactForm />
      </section>
    </PublicShell>
  );
}
