import { db } from "@/lib/db";
import Link from "next/link";

export const metadata = { title: "Admin" };

export default async function AdminHomePage() {
  const [pages, events, sermons, photos, inquiries, members] = await Promise.all([
    db.page.count(),
    db.churchEvent.count(),
    db.sermon.count(),
    db.galleryImage.count(),
    db.inquiry.count(),
    db.user.count({ where: { role: "MEMBER" } }),
  ]);

  const cards = [
    { href: "/admin/pages", label: "Pages", value: pages, hint: "Home, about, contact, giving, privacy" },
    { href: "/admin/events", label: "Events", value: events, hint: "Worship feasts and drives" },
    { href: "/admin/messages", label: "Messages", value: sermons, hint: "YouTube worship recordings" },
    { href: "/admin/gallery", label: "Photos", value: photos, hint: "Upload congregation pictures" },
    { href: "/admin/inquiries", label: "Inbox", value: inquiries, hint: "Notes from the contact form" },
    { href: "/admin/finance", label: "Members", value: members, hint: "Demo households in the portal" },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-gold">Church office</p>
        <h1 className="mt-2 font-display text-4xl text-shepherd">
          Keep GSSAM’s website current
        </h1>
        <p className="mt-3 max-w-2xl text-ink/80">
          This is a volunteer-friendly CMS — not a raw database screen. Edit
          pages, post events, add sermon links, and upload photos. Church-wide
          finance totals are on the finance tab; members never see one another’s
          gifts.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="card p-5">
            <p className="text-sm text-muted">{card.label}</p>
            <p className="mt-2 font-display text-4xl text-shepherd">{card.value}</p>
            <p className="mt-2 text-sm text-muted">{card.hint}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
