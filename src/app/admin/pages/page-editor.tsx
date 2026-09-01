"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Field } from "@/components/ui";

export function PageEditor({
  page,
}: {
  page: { slug: string; title: string; excerpt: string; body: string };
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setError("");
    setSaved(false);
    setPending(true);
    try {
      const res = await fetch("/api/admin/pages", {
        method: "POST",
        body: new FormData(form),
        credentials: "same-origin",
      });
      const payload = (await res.json().catch(() => ({}))) as {
        error?: string;
        slug?: string;
      };
      if (!res.ok) {
        setError(payload.error || "Could not save this page. Please try again.");
        return;
      }
      setSaved(true);
      const slug = payload.slug || page.slug;
      router.replace(`/admin/pages?slug=${encodeURIComponent(slug)}&saved=1`);
      router.refresh();
    } catch {
      setError("Could not save this page. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6">
      <input type="hidden" name="slug" value={page.slug} />
      {error ? (
        <p className="rounded-lg bg-burgundy/10 p-3 text-sm text-burgundy">{error}</p>
      ) : null}
      {saved ? (
        <p className="rounded-lg bg-shepherd/10 p-3 text-sm text-shepherd">
          Saved. The public page will show this update.
        </p>
      ) : null}
      <Field label="Title" name="title" defaultValue={page.title} required />
      <Field
        label="Short introduction"
        name="excerpt"
        type="textarea"
        defaultValue={page.excerpt}
      />
      <Field label="Page content" name="body">
        <textarea className="input min-h-64" name="body" defaultValue={page.body} />
      </Field>
      <p className="text-xs text-muted">
        On Home, the title is the hero heading and the short introduction is the
        hero paragraph. On other pages, title and introduction appear in the page
        header. Separate body paragraphs with a blank line.
      </p>
      <button className="btn btn-dark" disabled={pending} type="submit">
        {pending ? "Saving…" : `Save ${page.title}`}
      </button>
    </form>
  );
}
