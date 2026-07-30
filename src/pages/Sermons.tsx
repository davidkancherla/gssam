import { useMemo, useState } from 'react';
import { Play, Search, Youtube, X } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { SERMONS, YOUTUBE, type Sermon } from '@/data/site';
import { formatDate } from '@/lib/live';

const TYPE_FILTERS = ['All', 'Sunday Worship', 'Special Service'] as const;

export default function Sermons() {
  const [query, setQuery] = useState('');
  const [year, setYear] = useState<string>('All');
  const [type, setType] = useState<(typeof TYPE_FILTERS)[number]>('All');
  const [playing, setPlaying] = useState<Sermon | null>(null);

  const years = useMemo(
    () => ['All', ...Array.from(new Set(SERMONS.map((s) => s.date.slice(0, 4)))).sort().reverse()],
    []
  );

  const filtered = useMemo(
    () =>
      SERMONS.filter(
        (s) =>
          (year === 'All' || s.date.startsWith(year)) &&
          (type === 'All' || s.type === type) &&
          (query.trim() === '' || s.title.toLowerCase().includes(query.trim().toLowerCase()))
      ),
    [query, year, type]
  );

  return (
    <>
      <PageHeader
        title="Sermons & Services"
        subtitle={`Every service from ${YOUTUBE.handle} — worship with us anytime, anywhere.`}
        image="/images/prayer.png"
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search services…"
              aria-label="Search services"
              className="w-full rounded-md border border-input bg-card pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 ring-gold"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {TYPE_FILTERS.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-3.5 py-2 rounded-md text-sm font-medium transition-colors ${
                  type === t ? 'bg-maroon text-white' : 'bg-card ring-1 ring-border hover:bg-secondary'
                }`}
              >
                {t}
              </button>
            ))}
            <span className="hidden sm:block w-px bg-border mx-1" aria-hidden="true" />
            {years.map((y) => (
              <button
                key={y}
                onClick={() => setYear(y)}
                className={`px-3.5 py-2 rounded-md text-sm font-medium transition-colors ${
                  year === y ? 'bg-saffron text-maroon-deep' : 'bg-card ring-1 ring-border hover:bg-secondary'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((s) => (
            <article
              key={s.videoId}
              className="group rounded-xl bg-card ring-1 ring-border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setPlaying(s)}
                className="relative block w-full aspect-video bg-black"
                aria-label={`Play ${s.title}`}
              >
                <img
                  src={YOUTUBE.thumbnail(s.videoId)}
                  alt=""
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  loading="lazy"
                />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex items-center justify-center w-14 h-14 rounded-full bg-red-600/95 text-white group-hover:scale-110 transition-transform shadow-lg">
                    <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
                  </span>
                </span>
              </button>
              <div className="p-4">
                <span className="text-[11px] font-semibold text-gold uppercase tracking-wider">{s.type}</span>
                <h3 className="mt-1 font-display font-bold leading-snug">{s.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{formatDate(s.date)}</p>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-10 text-center text-muted-foreground">No services match your search.</p>
        )}

        {/* Subscribe CTA */}
        <div className="mt-14 rounded-2xl bg-maroon-deep text-white p-8 sm:p-10 text-center shadow-lg">
          <h2 className="font-display text-2xl sm:text-3xl font-bold">
            150+ services on <span className="text-gold">YouTube</span>
          </h2>
          <p className="mt-3 text-amber-100/85 max-w-xl mx-auto text-sm sm:text-base">
            The full archive — every Sunday worship, festival service, and celebration — lives on
            our channel. Subscribe to get notified the moment we go live each Sunday.
          </p>
          <a
            href={YOUTUBE.subscribeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-md transition-colors"
          >
            <Youtube className="w-5 h-5" /> Subscribe to {YOUTUBE.handle}
          </a>
        </div>
      </section>

      {/* Player modal */}
      {playing && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={playing.title}
          onClick={() => setPlaying(null)}
        >
          <div
            className="w-full max-w-4xl rounded-xl overflow-hidden bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-2.5 bg-maroon-deep text-white">
              <p className="text-sm font-semibold truncate">{playing.title}</p>
              <button
                onClick={() => setPlaying(null)}
                className="p-1.5 rounded hover:bg-white/10"
                aria-label="Close player"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video">
              <iframe
                src={`${YOUTUBE.embedUrl(playing.videoId)}?autoplay=1`}
                title={playing.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
