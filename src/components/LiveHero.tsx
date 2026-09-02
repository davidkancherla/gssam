"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarClock, MapPin, Radio } from "lucide-react";
import { YoutubeIcon } from "@/components/brand-icons";
import { countdownTo, isLiveNow, nextWorshipDate, nowPacific } from "@/lib/live";
import { BISHOP_VISIT, site } from "@/lib/site";

export function LiveHero({ imageUrl, caption }: { imageUrl?: string; caption?: string }) {
  const [live, setLive] = useState(false);
  const [cd, setCd] = useState(() => countdownTo(nextWorshipDate()));

  useEffect(() => {
    const tick = () => {
      setLive(isLiveNow());
      setCd(countdownTo(nextWorshipDate(nowPacific())));
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  const hero = imageUrl || BISHOP_VISIT.image;
  const kicker = caption || (hero === BISHOP_VISIT.image ? BISHOP_VISIT.caption : site.name);

  return (
    <section className="relative overflow-hidden bg-maroon-deep text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${hero}')` }}
        aria-hidden="true"
      />
      <div className="hero-veil absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-300 sm:text-sm">
            {kicker}
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            One Shepherd.
            <br />
            <span className="text-amber-300">Many Languages.</span>
            <br />
            One Family.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-amber-50/85 sm:text-lg">
            Join our South Asian Lutheran family as we worship the Lord Jesus Christ with
            traditional hymns in Telugu, Hindi, Tamil, and English — in person in Fremont
            and live online every Sunday.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href={site.youtubeLive}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
            >
              <YoutubeIcon className="h-5 w-5" /> Watch Sunday Worship Live
            </a>
            <Link
              href="/contact"
              className="btn btn-outline-light rounded-md px-5 py-3"
            >
              <MapPin className="h-5 w-5" /> Plan Your Visit
            </Link>
          </div>

          <p className="mt-5 flex items-center gap-2 text-sm text-amber-50/70">
            <CalendarClock className="h-4 w-4 text-amber-300" /> {site.worship} · {site.address}
          </p>
        </div>

        <div className="w-full">
          {live ? (
            <div className="overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/20">
              <div className="flex items-center gap-2 bg-red-600 px-4 py-2.5 text-sm font-semibold text-white">
                <Radio className="h-4 w-4 animate-pulse" /> LIVE NOW — Sunday Worship
              </div>
              <div className="aspect-video">
                <iframe
                  src={`${site.youtubeLiveEmbed}&autoplay=0`}
                  title="GSSAM Sunday Worship — live stream"
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-white/10 p-7 text-center shadow-2xl ring-1 ring-white/20 backdrop-blur-md sm:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
                Join Us Next Sunday
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Worship begins in</h2>
              <div
                className="mx-auto mt-6 grid max-w-md grid-cols-4 gap-2 sm:gap-3"
                role="timer"
                aria-label="Countdown to next Sunday worship"
              >
                {[
                  { v: cd.days, l: "Days" },
                  { v: cd.hours, l: "Hours" },
                  { v: cd.minutes, l: "Minutes" },
                  { v: cd.seconds, l: "Seconds" },
                ].map(({ v, l }) => (
                  <div key={l} className="rounded-xl bg-black/30 py-3 ring-1 ring-white/10">
                    <div className="font-display text-2xl font-bold tabular-nums text-amber-300 sm:text-4xl">
                      {String(v).padStart(2, "0")}
                    </div>
                    <div className="mt-1 text-[10px] uppercase tracking-wider text-amber-50/60 sm:text-xs">
                      {l}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm text-amber-50/75">
                {site.worship} — in person &amp; on YouTube
              </p>
              <a
                href={site.youtubeSubscribe}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                <YoutubeIcon className="h-4 w-4" /> Subscribe so you never miss a service
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
