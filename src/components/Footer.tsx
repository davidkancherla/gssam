import Link from "next/link";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto bg-shepherd-deep text-gold-soft">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-3">
        <div>
          <p className="font-display text-2xl text-white">{site.shortName}</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-gold-soft/80">
            {site.name} is a Lutheran congregation in Fremont, California.
            We worship in Telugu, Hindi, Tamil, and English.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Visit</p>
          <p className="mt-3 text-sm leading-7">
            {site.address}
            <br />
            {site.worship}
            <br />
            <a className="underline" href={site.phoneHref}>
              {site.phone}
            </a>
            <br />
            <a className="underline" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold">On this site</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link href="/donate">Give an offering</Link>
            <Link href="/messages">Watch messages</Link>
            <Link href="/login">Member & admin sign in</Link>
            <Link href="/privacy">Privacy policy</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-gold-soft/70">
        © {new Date().getFullYear()} {site.name}. EIN {site.ein}.
      </div>
    </footer>
  );
}
