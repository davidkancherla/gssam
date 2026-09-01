import { savePage } from "@/app/actions/content";
import { Field, SavedNotice } from "@/components/ui";
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
      {current ? (
        <form action={savePage} className="card space-y-4 p-6">
          <input type="hidden" name="slug" value={current.slug} />
          <Field label="Title" name="title" defaultValue={current.title} required />
          <Field label="Short introduction" name="excerpt" type="textarea" defaultValue={current.excerpt} />
          <Field label="Page content" name="body" type="textarea" defaultValue={current.body} />
          <p className="text-xs text-muted">
            On Home, the title is the hero heading and the short introduction is
            the hero paragraph. On other pages, title and introduction appear in
            the page header. Separate body paragraphs with a blank line.
          </p>
          <button className="btn btn-dark" type="submit">
            Save {current.title}
          </button>
        </form>
      ) : null}
    </div>
  );
}
