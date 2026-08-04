import { useMemo } from 'react';
import { ArrowRight, Youtube, MapPin, Clock, Languages, BookOpen, HeartHandshake } from 'lucide-react';
import LiveHero from '@/components/LiveHero';
import EventCard, { eventDate } from '@/components/EventCard';
import { CHURCH, YOUTUBE, SERMONS, EVENTS, GALLERY, WORSHIP } from '@/data/site';
import { formatDate } from '@/lib/live';

export default function Home({ navigate }: { navigate: (p: string) => void }) {
  const latestSermon = SERMONS[0];

  const upcoming = useMemo(
    () =>
      [...EVENTS]
        .map((ev) => ({ ev, at: eventDate(ev) }))
        .sort((a, b) => a.at.getTime() - b.at.getTime())
        .slice(0, 3)
        .map((x) => x.ev),
    []
  );

  return (
    <>
      <LiveHero navigate={navigate} />

      {/* Welcome */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-gold font-semibold tracking-[0.2em] uppercase text-xs">Welcome Home</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-maroon">
              A South Asian family in the Lutheran tradition
            </h2>
            <p className="mt-4 leading-relaxed text-foreground/85">
              Since 1988, Good Shepherd South Asian Ministry has gathered in Fremont to worship
              the Lord Jesus Christ through the timeless hymns of the Lutheran church — sung in the
              heart languages of our people: Telugu, Hindi, Tamil, and English.
            </p>
            <p className="mt-3 leading-relaxed text-foreground/85">
              Whether you are new to the Bay Area, exploring faith, or looking for a church that
              feels like home, there is a seat saved for you this Sunday.
            </p>
            <button
              onClick={() => navigate('about')}
              className="mt-6 inline-flex items-center gap-2 text-maroon font-semibold hover:gap-3 transition-all"
            >
              Learn our story <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="/images/real-congregation.jpg" alt="GSSAM congregation on Palm Sunday" className="rounded-xl object-cover h-48 w-full shadow-md" loading="lazy" />
            <img src="/images/real-elders.jpg" alt="GSSAM elders honored with flower garlands" className="rounded-xl object-cover h-48 w-full shadow-md mt-8" loading="lazy" />
          </div>
        </div>

        {/* Quick facts */}
        <div className="mt-14 grid sm:grid-cols-3 gap-5">
          {[
            { icon: Clock, title: 'Sunday Worship', text: WORSHIP.label },
            { icon: MapPin, title: 'Find Us', text: CHURCH.address },
            { icon: Languages, title: 'We Worship In', text: CHURCH.languages.join(' · ') },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-xl bg-card ring-1 ring-border p-6 text-center shadow-sm">
              <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-saffron/25 text-maroon">
                <Icon className="w-5 h-5" />
              </span>
              <h3 className="mt-3 font-display font-bold text-lg">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest sermon */}
      <section className="bg-secondary/60 pattern-dots">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid lg:grid-cols-2 gap-10 items-center">
          <div className="rounded-xl overflow-hidden shadow-xl ring-1 ring-border bg-black aspect-video">
            <iframe
              src={YOUTUBE.embedUrl(latestSermon.videoId)}
              title={latestSermon.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
          <div>
            <p className="text-gold font-semibold tracking-[0.2em] uppercase text-xs">Latest Service</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-maroon">{latestSermon.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{formatDate(latestSermon.date)}</p>
            <p className="mt-4 leading-relaxed text-foreground/85">
              Missed a Sunday? Every service is streamed and archived on our YouTube channel,
              {` ${YOUTUBE.handle}`} — worship with us anytime, anywhere.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => navigate('sermons')}
                className="inline-flex items-center gap-2 bg-maroon text-white font-semibold px-5 py-2.5 rounded-md hover:bg-maroon-deep transition-colors"
              >
                <BookOpen className="w-4 h-4" /> Browse Sermon Archive
              </button>
              <a
                href={YOUTUBE.subscribeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-md transition-colors"
              >
                <Youtube className="w-4 h-4" /> Subscribe
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-gold font-semibold tracking-[0.2em] uppercase text-xs">This Week &amp; Beyond</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-maroon">Upcoming at GSSAM</h2>
          </div>
          <button
            onClick={() => navigate('events')}
            className="inline-flex items-center gap-2 text-maroon font-semibold hover:gap-3 transition-all"
          >
            Full calendar <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {upcoming.map((ev) => (
            <EventCard key={ev.id} ev={ev} />
          ))}
        </div>
      </section>

      {/* Gallery strip */}
      <section className="bg-maroon-deep py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center text-white">
            <p className="text-amber-300 font-semibold tracking-[0.2em] uppercase text-xs">Life Together</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold">Our Community in Pictures</h2>
          </div>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {GALLERY.slice(0, 4).map((g) => (
              <figure key={g.caption} className="group relative rounded-xl overflow-hidden ring-1 ring-white/10">
                <img src={g.src} alt={g.caption} className="h-44 md:h-52 w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent text-white text-xs px-3 py-2.5">
                  {g.caption}
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-10 text-center">
            <button
              onClick={() => navigate('give')}
              className="inline-flex items-center gap-2 bg-saffron text-maroon-deep font-bold px-6 py-3 rounded-md hover:brightness-110 transition"
            >
              <HeartHandshake className="w-5 h-5" /> Support Our Ministry
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
