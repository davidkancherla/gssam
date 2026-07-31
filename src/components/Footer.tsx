import { MapPin, Phone, Mail, Youtube, Clock, Heart, Facebook } from 'lucide-react';
import { CHURCH, YOUTUBE, FACEBOOK, WORSHIP } from '@/data/site';
import { NAV_ITEMS } from './Navbar';

export default function Footer({ navigate }: { navigate: (p: string) => void }) {
  return (
    <footer className="bg-maroon-deep text-amber-50/85 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <h3 className="font-display text-2xl font-bold text-white">{CHURCH.name}</h3>
          <p className="mt-1 text-sm text-gold font-medium tracking-wide">{CHURCH.tagline}</p>
          <p className="mt-4 text-sm leading-relaxed max-w-md">
            A {CHURCH.denomination} congregation worshipping the Lord Jesus Christ through
            traditional Lutheran hymns in {CHURCH.languages.join(', ')}. All are welcome at
            the table of the Good Shepherd.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={YOUTUBE.subscribeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2.5 rounded-md transition-colors"
            >
              <Youtube className="w-4 h-4" /> Subscribe on YouTube
            </a>
            <a
              href={FACEBOOK.pageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1877F2] hover:bg-[#0f66d6] text-white text-sm font-semibold px-4 py-2.5 rounded-md transition-colors"
            >
              <Facebook className="w-4 h-4" /> Follow on Facebook
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Visit Us</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2.5">
              <Clock className="w-4 h-4 mt-0.5 shrink-0 text-gold" />
              <span>Sunday Worship<br />{WORSHIP.label}</span>
            </li>
            <li className="flex gap-2.5">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gold" />
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${CHURCH.addressMapsQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white underline-offset-2 hover:underline"
              >
                {CHURCH.address}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Phone className="w-4 h-4 mt-0.5 shrink-0 text-gold" />
              <a href={CHURCH.phoneHref} className="hover:text-white">{CHURCH.phone}</a>
            </li>
            <li className="flex gap-2.5">
              <Mail className="w-4 h-4 mt-0.5 shrink-0 text-gold" />
              <a href={`mailto:${CHURCH.email}`} className="hover:text-white break-all">{CHURCH.email}</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Explore</h4>
          <ul className="space-y-2 text-sm">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button onClick={() => navigate(item.id)} className="hover:text-white transition-colors">
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-amber-50/60">
          <p>© {new Date().getFullYear()} {CHURCH.name} · {CHURCH.city}, CA</p>
          <p className="flex items-center gap-1.5">
            Soli Deo Gloria <Heart className="w-3 h-3 text-gold" />
          </p>
        </div>
      </div>
    </footer>
  );
}
