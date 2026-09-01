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
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
}) {
  return (
    <section className="bg-shepherd text-cream">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        {eyebrow ? (
          <p className="text-xs uppercase tracking-[0.25em] text-gold">{eyebrow}</p>
        ) : null}
        <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight sm:text-5xl">
          {title}
        </h1>
        {lede ? <p className="mt-4 max-w-2xl text-lg text-gold-soft/90">{lede}</p> : null}
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
  max,
  children,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number;
  required?: boolean;
  step?: string | number;
  min?: string | number;
  max?: string | number;
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
          max={max}
        />
      )}
    </label>
  );
}

export function SavedNotice({ searchParams }: { searchParams?: { saved?: string } }) {
  if (!searchParams?.saved) return null;
  return (
    <p className="rounded-xl bg-shepherd/10 px-4 py-3 text-sm text-shepherd">
      Saved. The public site and portals will show the update.
    </p>
  );
}
