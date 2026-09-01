"use client";

import { useState, type FormEvent } from "react";
import { Field } from "@/components/ui";

const PHOTO_PAGES = new Set(["home", "about"]);

export function PageEditor({
  page,
  gallery,
}: {
  page: { slug: string; title: string; excerpt: string; body: string; imageUrl: string };
  gallery: { id: string; url: string; title: string }[];
}) {
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);
  const showPhoto = PHOTO_PAGES.has(page.slug);

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
      window.location.assign(`/admin/pages?slug=${encodeURIComponent(slug)}&saved=1`);
    } catch {
      setError("Could not save this page. Please try again.");
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
      {showPhoto ? (
        <div className="space-y-3">
          {page.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={page.imageUrl}
              alt=""
              className="h-40 w-full rounded-xl object-cover"
            />
          ) : null}
          <Field
            label={page.slug === "home" ? "Homepage photo" : "About photo"}
            name="file"
          >
            <input className="input" name="file" type="file" accept="image/*" />
          </Field>
          {gallery.length ? (
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-shepherd">
                Or use a gallery photo
              </span>
              <select className="input" name="galleryUrl" defaultValue="">
                <option value="">Keep the current photo</option>
                {gallery.map((photo) => (
                  <option key={photo.id} value={photo.url}>
                    {photo.title}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <p className="text-xs text-muted">
            {page.slug === "home"
              ? "This is the large picture behind the welcome heading."
              : "This picture appears on the About page and in the About section of the homepage."}
          </p>
        </div>
      ) : null}
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
