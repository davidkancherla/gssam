"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { savePage, type PageFormState } from "@/app/actions/content";
import { Field } from "@/components/ui";

export function PageForm({
  slug,
  title,
  excerpt,
  body,
}: {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState<PageFormState, FormData>(
    savePage,
    null,
  );

  useEffect(() => {
    if (state?.saved) router.refresh();
  }, [state, router]);

  return (
    <form action={action} className="card space-y-4 p-6">
      {state?.error ? (
        <p className="rounded-lg bg-burgundy/10 p-3 text-sm text-burgundy">{state.error}</p>
      ) : null}
      {state?.saved ? (
        <p className="rounded-xl bg-shepherd/10 px-4 py-3 text-sm text-shepherd">
          Saved. The public site and portals will show the update.
        </p>
      ) : null}
      <input type="hidden" name="slug" value={slug} />
      <Field label="Title" name="title" defaultValue={title} required />
      <Field label="Short introduction" name="excerpt" type="textarea" defaultValue={excerpt} />
      <Field label="Page content" name="body" type="textarea" defaultValue={body} />
      <p className="text-xs text-muted">
        Separate paragraphs with a blank line. A short line without a period is
        shown as a heading on the public site.
      </p>
      <button className="btn btn-dark" disabled={pending} type="submit">
        {pending ? "Saving…" : `Save ${title}`}
      </button>
    </form>
  );
}
