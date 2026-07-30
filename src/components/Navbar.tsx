import { useState } from 'react';
import { Menu, X, Church } from 'lucide-react';
import { CHURCH } from '@/data/site';

export const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About Us' },
  { id: 'sermons', label: 'Sermons' },
  { id: 'events', label: 'Events' },
  { id: 'ministries', label: 'Ministries' },
  { id: 'give', label: 'Give' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar({ page, navigate }: { page: string; navigate: (p: string) => void }) {
  const [open, setOpen] = useState(false);

  const go = (id: string) => {
    navigate(id);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-maroon-deep border-b border-white/10 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => go('home')}
            className="flex items-center gap-2.5 text-white group"
            aria-label="GSSAM Fremont — home"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-saffron text-maroon-deep group-hover:scale-105 transition-transform">
              <Church className="w-5 h-5" />
            </span>
            <span className="text-left leading-tight">
              <span className="block font-display font-bold text-lg tracking-wide">{CHURCH.shortName}</span>
              <span className="block text-[10px] uppercase tracking-[0.18em] text-amber-200/80">
                South Asian Ministry · Fremont
              </span>
            </span>
          </button>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => go(item.id)}
                  className={`px-3.5 py-2 rounded-md text-sm font-medium transition-colors ${
                    page === item.id
                      ? 'bg-saffron text-maroon-deep'
                      : 'text-amber-50/90 hover:bg-white/10 hover:text-white'
                  }`}
                  aria-current={page === item.id ? 'page' : undefined}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white p-2 rounded-md hover:bg-white/10"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {open && (
          <ul className="md:hidden pb-4 space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => go(item.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-medium ${
                    page === item.id
                      ? 'bg-saffron text-maroon-deep'
                      : 'text-amber-50/90 hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
}
