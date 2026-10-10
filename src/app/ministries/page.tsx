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
        image="/images/real-kids-singing.jpg"
      />
      <section className="bg-[#f5f5f7]">
        <div className="mx-auto grid max-w-[1080px] gap-4 px-5 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          {ministries.map((ministry, i) => (
            <Link
              key={ministry.id}
              href={`/ministries/${ministry.slug}`}
              className="tile tile-link flex flex-col"
              data-reveal
              style={{ transitionDelay: `${(i % 2) * 90}ms` }}
            >
              <div className="overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ministry.imageUrl} alt="" className="aspect-[16/10] w-full object-cover" />
              </div>
              <div className="flex flex-1 flex-col p-7 sm:p-8">
                <h2 className="text-[26px] font-semibold leading-tight tracking-tight text-[#1d1d1f] sm:text-[28px]">
                  {ministry.name}
                </h2>
                <p className="mt-2 flex-1 text-[16px] leading-[1.55] text-[#6e6e73]">{ministry.summary}</p>
                <span className="link-chevron mt-5 text-[16px]">Learn more</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
