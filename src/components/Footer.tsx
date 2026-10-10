import Link from "next/link";
import { Heart } from "lucide-react";
import { FacebookIcon, YoutubeIcon } from "@/components/brand-icons";
import { nav, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto bg-[#f5f5f7] text-[13px] leading-relaxed text-[#6e6e73]">
      <div className="mx-auto max-w-[1080px] px-4 sm:px-6">
        <div className="grid gap-10 border-b border-black/10 py-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/favicon.png"
                alt=""
                className="h-10 w-10 rounded-full object-cover ring-1 ring-black/10"
              />
              <h3 className="text-[17px] font-semibold text-[#1d1d1f]">{site.name}</h3>
            </div>
            <p className="mt-3 text-[13px] font-medium text-accent-gold">{site.tagline}</p>
            <p className="mt-3 max-w-md">
              A {site.denomination} congregation worshipping the Lord Jesus Christ through
              traditional Lutheran hymns in {site.languages.join(", ")}. All are welcome at
              the table of the Good Shepherd.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={site.youtubeSubscribe}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-ink"
              >
                <YoutubeIcon className="h-4 w-4 text-[#ff3b30]" /> Subscribe on YouTube
              </a>
              <a
                href={site.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm border border-black/15 bg-white text-[#1d1d1f] hover:bg-[#e8e8ed]"
              >
                <FacebookIcon className="h-4 w-4 text-[#1877F2]" /> Follow on Facebook
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="mb-3 text-[12px] font-semibold text-[#1d1d1f]">Visit Us</h4>
            <ul className="space-y-2.5">
              <li>
                <span className="block text-[#1d1d1f]">Sunday Worship</span>
                {site.worship}
              </li>
              <li>
                <a
                  href={site.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#1d1d1f] hover:underline"
                >
                  {site.address}
                </a>
              </li>
              <li>
                <a href={site.phoneHref} className="hover:text-[#1d1d1f] hover:underline">
                  {site.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="break-all hover:text-[#1d1d1f] hover:underline">
                  {site.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="mb-3 text-[12px] font-semibold text-[#1d1d1f]">Explore</h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-[#1d1d1f] hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/gallery" className="hover:text-[#1d1d1f] hover:underline">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#1d1d1f] hover:underline">
                  Member &amp; admin sign in
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#1d1d1f] hover:underline">
                  Privacy policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2 py-5 text-[12px] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name} · {site.city}, CA · EIN {site.ein}
          </p>
          <p className="flex items-center gap-1.5">
            Soli Deo Gloria <Heart className="h-3 w-3 text-accent" aria-hidden="true" />
          </p>
        </div>
      </div>
    </footer>
  );
}
