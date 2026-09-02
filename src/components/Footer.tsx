import Link from "next/link";
import { Clock, Heart, Mail, MapPin, Phone } from "lucide-react";
import { FacebookIcon, YoutubeIcon } from "@/components/brand-icons";
import { nav, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto bg-maroon-deep text-amber-50/85">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <h3 className="font-display text-2xl font-bold text-white">{site.name}</h3>
          <p className="mt-1 text-sm font-medium tracking-wide text-amber-300">{site.tagline}</p>
          <p className="mt-4 max-w-md text-sm leading-relaxed">
            A {site.denomination} congregation worshipping the Lord Jesus Christ through
            traditional Lutheran hymns in {site.languages.join(", ")}. All are welcome at
            the table of the Good Shepherd.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={site.youtubeSubscribe}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
            >
              <YoutubeIcon className="h-4 w-4" /> Subscribe on YouTube
            </a>
            <a
              href={site.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-[#1877F2] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0f66d6]"
            >
              <FacebookIcon className="h-4 w-4" /> Follow on Facebook
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Visit Us</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
              <span>
                Sunday Worship
                <br />
                {site.worship}
              </span>
            </li>
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
              <a
                href={site.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 hover:text-white hover:underline"
              >
                {site.address}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
              <a href={site.phoneHref} className="hover:text-white">
                {site.phone}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
              <a href={`mailto:${site.email}`} className="break-all hover:text-white">
                {site.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Explore</h4>
          <ul className="space-y-2 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/gallery" className="hover:text-white">
                Gallery
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-white">
                Member &amp; admin sign in
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-white">
                Privacy policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-amber-50/60 sm:flex-row sm:px-6">
          <p>
            © {new Date().getFullYear()} {site.name} · {site.city}, CA · EIN {site.ein}
          </p>
          <p className="flex items-center gap-1.5">
            Soli Deo Gloria <Heart className="h-3 w-3 text-amber-300" />
          </p>
        </div>
      </div>
    </footer>
  );
}
