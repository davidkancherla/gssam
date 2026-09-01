"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Field } from "@/components/ui";

export function GalleryUploadForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setError("");
    setPending(true);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        body: data,
        credentials: "same-origin",
      });
      const payload = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(payload.error || "Upload failed. Please try a JPG or PNG under 8 MB.");
        return;
      }
      form.reset();
      router.replace("/admin/gallery?saved=1");
      router.refresh();
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card grid gap-4 p-6 sm:grid-cols-2">
      {error ? (
        <p className="rounded-lg bg-burgundy/10 p-3 text-sm text-burgundy sm:col-span-2">
          {error}
        </p>
      ) : null}
      <Field label="Photo" name="file">
        <input className="input" name="file" type="file" accept="image/*" required />
      </Field>
      <Field label="Title" name="title" />
      <Field label="Album" name="album" defaultValue="Congregation" />
      <label className="text-sm">
        <span className="mb-1 block font-medium text-shepherd">Show on</span>
        <select className="input" name="placement" defaultValue="gallery">
          <option value="gallery">Gallery only</option>
          <option value="home">Homepage gallery</option>
          <option value="hero">Homepage hero</option>
        </select>
      </label>
      <Field label="Caption" name="caption" />
      <div className="sm:col-span-2">
        <button className="btn btn-dark" disabled={pending} type="submit">
          {pending ? "Uploading…" : "Upload photo"}
        </button>
      </div>
    </form>
  );
}
