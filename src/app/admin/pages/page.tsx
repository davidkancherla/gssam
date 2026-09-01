import { PageEditor } from "@/app/admin/pages/page-editor";
import { SavedNotice } from "@/components/ui";
import { db } from "@/lib/db";
import Link from "next/link";

export const metadata = { title: "Edit pages" };

export default async function AdminPages({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; slug?: string }>;
}) {
  const params = await searchParams;
  const pages = await db.page.findMany({ orderBy: { title: "asc" } });
  const current = pages.find((page) => page.slug === params.slug) ?? pages[0];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="font-display text-4xl text-shepherd">Edit public pages</h1>
      <SavedNotice searchParams={params} />
      <div className="flex flex-wrap gap-2">
        {pages.map((page) => (
          <Link
            key={page.slug}
            href={`/admin/pages?slug=${page.slug}`}
            className={`rounded-full px-4 py-2 text-sm ${
              current?.slug === page.slug ? "bg-shepherd text-white" : "bg-white border border-line"
            }`}
          >
            {page.title}
          </Link>
        ))}
      </div>
      {current ? <PageEditor key={current.slug} page={current} /> : null}
    </div>
  );
}
