"use client";

import { useState, type FormEvent } from "react";
import { Field } from "@/components/ui";

export function MinistryForm({
  current,
}: {
  current?: {
    id: string;
    name: string;
    slug: string;
    summary: string;
    body: string;
    imageUrl: string;
    sortOrder: number;
  };
}) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setError("");
    setPending(true);
    try {
      const res = await fetch("/api/admin/ministries", {
        method: "POST",
        body: new FormData(form),
        credentials: "same-origin",
      });
      const payload = (await res.json().catch(() => ({}))) as {
        error?: string;
        id?: string;
      };
      if (!res.ok) {
        setError(payload.error || "Could not save this ministry.");
        setPending(false);
        return;
      }
      const id = payload.id || current?.id || "";
      window.location.assign(
        id ? `/admin/ministries?id=${encodeURIComponent(id)}&saved=1` : "/admin/ministries?saved=1",
      );
    } catch {
      setError("Could not save this ministry.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6">
      <h2 className="font-display text-2xl">{current ? "Edit ministry" : "Add ministry"}</h2>
      {current ? <input type="hidden" name="id" value={current.id} /> : null}
      {error ? (
        <p className="rounded-lg bg-burgundy/10 p-3 text-sm text-burgundy">{error}</p>
      ) : null}
      <Field label="Name" name="name" defaultValue={current?.name} required />
      <Field label="Web name" name="slug" defaultValue={current?.slug} />
      <p className="-mt-2 text-xs text-muted">
        Used in the page address. Leave blank to use the ministry name.
      </p>
      <Field label="Summary" name="summary" defaultValue={current?.summary} />
      <div className="space-y-2">
        {current?.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={current.imageUrl} alt="" className="h-36 w-full rounded-xl object-cover" />
        ) : null}
        <Field label="Photo" name="file">
          <input className="input" name="file" type="file" accept="image/*" />
        </Field>
        <p className="text-xs text-muted">
          Choose a JPG or PNG. Leave empty to keep the current photo.
        </p>
      </div>
      <Field
        label="Order on the homepage"
        name="sortOrder"
        type="number"
        defaultValue={current?.sortOrder ?? 0}
      />
      <Field label="Full description" name="body" type="textarea" defaultValue={current?.body} />
      <button className="btn btn-dark" disabled={pending} type="submit">
        {pending ? "Saving…" : "Save ministry"}
      </button>
    </form>
  );
}
