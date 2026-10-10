import type { ReactNode } from "react";
import { paragraphs } from "@/lib/site";

export function Prose({ text, className = "" }: { text: string; className?: string }) {
  const blocks = paragraphs(text);
  return (
    <div className={`space-y-6 text-[17px] leading-[1.65] text-[#1d1d1f]/85 sm:text-[19px] ${className}`}>
      {blocks.map((block) => {
        const heading =
          block.length < 72 &&
          !block.includes(".") &&
          !block.includes(":") &&
          block.split("\n").length === 1;
        if (heading) {
          return (
            <h2
              key={block}
              className="pt-6 font-display text-[28px] font-semibold leading-tight tracking-tight text-[#1d1d1f] sm:text-[34px]"
            >
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

/**
 * Apple-style page header: centered eyebrow, very large tight headline, short
 * subhead, and an optional full-bleed rounded photo card underneath.
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  image,
  imageAlt = "",
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  image?: string;
  imageAlt?: string;
}) {
  return (
    <section className="overflow-hidden bg-white">
      <div className="mx-auto max-w-[980px] px-5 pb-10 pt-14 text-center sm:px-6 sm:pt-20 md:pb-14">
        <div data-reveal>
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1 className="headline mt-2 text-[clamp(2.5rem,7vw,4.75rem)] text-[#1d1d1f]">{title}</h1>
          {lede ? <p className="subhead mx-auto mt-4 max-w-[680px]">{lede}</p> : null}
        </div>
      </div>
      {image ? (
        <div className="px-3 pb-3 sm:px-4 sm:pb-4" data-reveal="zoom">
          <div className="mx-auto max-w-[1400px] overflow-hidden rounded-[1.75rem] bg-[#f5f5f7] sm:rounded-[2.25rem]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={imageAlt}
              className="aspect-[4/3] w-full object-cover sm:aspect-[21/9]"
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}

/** Full-width band: tone="white" | "gray" | "dark". */
export function Section({
  tone = "white",
  className = "",
  innerClassName = "",
  children,
  id,
}: {
  tone?: "white" | "gray" | "dark";
  className?: string;
  innerClassName?: string;
  children: ReactNode;
  id?: string;
}) {
  const toneClass =
    tone === "gray" ? "bg-[#f5f5f7] text-[#1d1d1f]" : tone === "dark" ? "bg-black text-white" : "bg-white text-[#1d1d1f]";
  return (
    <section id={id} className={`${toneClass} ${className}`}>
      <div className={`mx-auto max-w-[1080px] px-5 py-16 sm:px-6 md:py-24 ${innerClassName}`}>{children}</div>
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
      <span className="mb-1.5 block text-[13px] font-medium text-[#1d1d1f]">{label}</span>
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
