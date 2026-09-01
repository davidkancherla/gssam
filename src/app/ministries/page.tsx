import { PublicShell } from "@/components/PublicShell";
import { PageHero } from "@/components/ui";
import { db } from "@/lib/db";
import Link from "next/link";

export const metadata = { title: "Ministries" };

export default async function MinistriesPage() {
  const ministries = await db.ministry.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <PublicShell>
      <PageHero
        eyebrow="Serve & grow"
        title="Ministries"
        lede="GSSAM has a range of fellowships and departments that live out the vision of this congregation in Fremont."
      />
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-14 md:grid-cols-2">
        {ministries.map((ministry) => (
          <Link key={ministry.id} href={`/ministries/${ministry.slug}`} className="card flex flex-col sm:flex-row">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ministry.imageUrl}
              alt=""
              className="h-48 w-full object-cover sm:h-auto sm:w-48"
            />
            <div className="p-5">
              <h2 className="font-display text-2xl text-shepherd">{ministry.name}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{ministry.summary}</p>
            </div>
          </Link>
        ))}
      </section>
    </PublicShell>
  );
}
