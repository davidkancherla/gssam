import { useEffect, useState } from 'react';
import { Youtube, MapPin, Radio, CalendarClock } from 'lucide-react';
import { CHURCH, YOUTUBE, WORSHIP } from '@/data/site';
import { isLiveNow, nextWorshipDate, countdownTo, nowPacific } from '@/lib/live';

/**
 * Hero that shows the YouTube live player during the Sunday worship window
 * (11:30 AM–1:00 PM PT, with a small grace margin) and a "Join Us Next Sunday"
 * countdown card the rest of the week.
 */
export default function LiveHero({ navigate }: { navigate: (p: string) => void }) {
  const [live, setLive] = useState(isLiveNow());
  const [cd, setCd] = useState(() => countdownTo(nextWorshipDate()));

  useEffect(() => {
    const t = setInterval(() => {
      setLive(isLiveNow());
      setCd(countdownTo(nextWorshipDate(nowPacific())));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative bg-maroon-deep text-white overflow-hidden">
      {/* background image + overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: "url('/images/hero-worship.png')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-maroon-deep/60 via-maroon-deep/80 to-maroon-deep" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-gold font-semibold tracking-[0.22em] uppercase text-xs sm:text-sm">
            {CHURCH.name}
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            One Shepherd.<br />
            <span className="text-gold">Many Languages.</span><br />
            One Family.
          </h1>
          <p className="mt-5 text-amber-50/85 text-base sm:text-lg leading-relaxed max-w-xl">
            Join our South Asian Lutheran family as we worship the Lord Jesus Christ with
            traditional hymns in Telugu, Hindi, Tamil, and English — in person in Fremont
            and live online every Sunday.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href={YOUTUBE.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-3 rounded-md transition-colors"
            >
              <Youtube className="w-5 h-5" /> Watch Sunday Worship Live
            </a>
            <button
              onClick={() => navigate('contact')}
              className="inline-flex items-center gap-2 border border-gold text-gold hover:bg-saffron hover:text-maroon-deep font-semibold px-5 py-3 rounded-md transition-colors"
            >
              <MapPin className="w-5 h-5" /> Plan Your Visit
            </button>
          </div>

          <p className="mt-5 text-sm text-amber-50/70 flex items-center gap-2">
            <CalendarClock className="w-4 h-4 text-gold" /> {WORSHIP.label} · {CHURCH.address}
          </p>
        </div>

        {/* Live player / countdown card */}
        <div className="w-full">
          {live ? (
            <div className="rounded-xl overflow-hidden shadow-2xl ring-1 ring-gold/50 bg-black">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white text-sm font-semibold">
                <Radio className="w-4 h-4 animate-pulse" /> LIVE NOW — Sunday Worship
              </div>
              <div className="aspect-video">
                <iframe
                  src={`${YOUTUBE.liveEmbed}&autoplay=0`}
                  title="GSSAM Sunday Worship — live stream"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-white/5 backdrop-blur ring-1 ring-gold/40 p-7 sm:p-9 text-center shadow-2xl">
              <p className="text-gold font-semibold tracking-[0.2em] uppercase text-xs">Join Us Next Sunday</p>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold">Worship begins in</h2>
              <div className="mt-6 grid grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto" role="timer" aria-label="Countdown to next Sunday worship">
                {[
                  { v: cd.days, l: 'Days' },
                  { v: cd.hours, l: 'Hours' },
                  { v: cd.minutes, l: 'Minutes' },
                  { v: cd.seconds, l: 'Seconds' },
                ].map(({ v, l }) => (
                  <div key={l} className="rounded-lg bg-maroon-deep/80 ring-1 ring-white/10 py-3">
                    <div className="font-display text-2xl sm:text-4xl font-bold text-gold tabular-nums">
                      {String(v).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] sm:text-xs uppercase tracking-wider text-amber-50/60 mt-1">{l}</div>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm text-amber-50/75">
                {WORSHIP.label} — in person &amp; on YouTube
              </p>
              <a
                href={YOUTUBE.subscribeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 px-4 py-2.5 rounded-md transition-colors"
              >
                <Youtube className="w-4 h-4" /> Subscribe so you never miss a service
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
