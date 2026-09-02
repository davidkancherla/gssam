import type { ReactNode } from "react";
import { paragraphs } from "@/lib/site";

export function Prose({ text, className = "" }: { text: string; className?: string }) {
  const blocks = paragraphs(text);
  return (
    <div className={`space-y-5 text-[1.05rem] leading-8 text-ink/90 ${className}`}>
      {blocks.map((block) => {
        const heading =
          block.length < 72 &&
          !block.includes(".") &&
          !block.includes(":") &&
          block.split("\n").length === 1;
        if (heading) {
          return (
            <h2 key={block} className="font-display text-2xl text-shepherd pt-2">
              {block}
            </h2>
          );
        }
        return (
          <p key={block} className="whitespace-pre-line">
            {block}
          </p>
        );
      })}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  lede,
  image,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  image?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-maroon-deep text-white">
      {image ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${image}')` }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80" />
        </>
      ) : null}
      <div className="relative mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 md:py-20">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">{eyebrow}</p>
        ) : null}
        <h1 className="mt-2 font-display text-3xl font-bold sm:text-5xl">{title}</h1>
        {lede ? <p className="mx-auto mt-3 max-w-2xl text-sm text-amber-100/85 sm:text-base">{lede}</p> : null}
        <div className="ornament-divider mt-6">
          <span className="text-lg text-amber-300" aria-hidden="true">
            ✦
          </span>
        </div>
      </div>
    </section>
  );
}

export function DemoBanner() {
  return (
    <div className="rounded-xl border border-gold bg-gold-soft/40 px-4 py-3 text-sm text-shepherd">
      <strong>Demo sample data only.</strong> Amounts, names, and household
      records in this portal are fictional examples for training. They are not
      real GSSAM member finances.
    </div>
  );
}

export function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
  step,
  min,
  children,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number;
  required?: boolean;
  step?: string;
  min?: string;
  children?: ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-shepherd">{label}</span>
      {children ? (
        children
      ) : type === "textarea" ? (
        <textarea
          className="input min-h-36"
          name={name}
          defaultValue={defaultValue}
          required={required}
        />
      ) : (
        <input
          className="input"
          name={name}
          type={type}
          defaultValue={defaultValue}
          required={required}
          step={step}
          min={min}
        />
      )}
    </label>
  );
}

export function SavedNotice({
  searchParams,
}: {
  searchParams?: { saved?: string; error?: string };
}) {
  if (searchParams?.error) {
    return (
      <p className="rounded-xl bg-burgundy/10 px-4 py-3 text-sm text-burgundy">
        {searchParams.error === "1"
          ? "Could not save. Please try again."
          : searchParams.error}
      </p>
    );
  }
  if (!searchParams?.saved) return null;
  return (
    <p className="rounded-xl bg-shepherd/10 px-4 py-3 text-sm text-shepherd">
      Saved. The public site and portals will show the update.
    </p>
  );
}
