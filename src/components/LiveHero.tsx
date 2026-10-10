"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Radio } from "lucide-react";
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
    <section className="overflow-hidden bg-white">
      <div className="mx-auto max-w-[980px] px-5 pb-10 pt-14 text-center sm:px-6 sm:pt-20 md:pb-14">
        <div data-reveal>
          {live ? (
            <p className="inline-flex items-center gap-1.5 rounded-full bg-[#ff3b30]/10 px-3 py-1 text-[13px] font-semibold text-[#c4161c]">
              <Radio className="h-3.5 w-3.5 animate-pulse" aria-hidden="true" /> Live now — Sunday Worship
            </p>
          ) : (
            <p className="eyebrow">Sunday Worship · Fremont &amp; online</p>
          )}
          <h1 className="headline mt-3 text-[clamp(2.75rem,9vw,6rem)] text-[#1d1d1f]">
            One Shepherd.
            <br />
            <span className="text-accent">Many Languages.</span>
            <br />
            One Family.
          </h1>
          <p className="subhead mx-auto mt-5 max-w-[640px]">
            Join our South Asian Lutheran family as we worship the Lord Jesus Christ with
            traditional hymns in Telugu, Hindi, and English — in person in Fremont
            and live online every Sunday.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={site.youtubeLive}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary w-full max-w-xs sm:w-auto"
            >
              <YoutubeIcon className="h-[18px] w-[18px]" /> Watch Sunday Worship Live
            </a>
            <Link href="/contact" className="btn btn-secondary w-full max-w-xs sm:w-auto">
              Plan Your Visit
            </Link>
          </div>

          <p className="mt-6 text-[14px] text-[#6e6e73]">
            {site.worship} · {site.address}
          </p>
        </div>
      </div>

      <div className="px-3 sm:px-4" data-reveal="zoom">
        <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[1.75rem] bg-black sm:rounded-[2.25rem]">
          {live ? (
            <div className="aspect-video">
              <iframe
                src={`${site.youtubeLiveEmbed}&autoplay=0`}
                title="GSSAM Sunday Worship — live stream"
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <figure className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hero}
                alt={kicker}
                className="aspect-[4/3] w-full object-cover sm:aspect-[16/8]"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent px-5 pb-4 pt-16 text-left text-[13px] font-medium text-white sm:px-8 sm:pb-6 sm:text-[15px]">
                {kicker}
              </figcaption>
            </figure>
          )}
        </div>
      </div>

      {/* Countdown to next Sunday — clean, tabular, Apple-style. */}
      <div className="px-3 pb-3 pt-3 sm:px-4 sm:pb-4 sm:pt-4">
        <div
          className="mx-auto flex max-w-[1400px] flex-col items-center gap-6 rounded-[1.75rem] bg-[#f5f5f7] px-5 py-8 sm:rounded-[2.25rem] md:flex-row md:justify-between md:px-12 md:py-10"
          data-reveal
        >
          <div className="text-center md:text-left">
            <p className="eyebrow">Join Us Next Sunday</p>
            <h2 className="mt-1 text-[24px] font-semibold tracking-tight text-[#1d1d1f] sm:text-[28px]">
              Worship begins in
            </h2>
            <p className="mt-1 text-[14px] text-[#6e6e73]">{site.worship} — in person &amp; on YouTube</p>
          </div>

          <div
            className="grid grid-cols-4 gap-1 sm:gap-3"
            role="timer"
            aria-label="Countdown to next Sunday worship"
          >
            {[
              { v: cd.days, l: "Days" },
              { v: cd.hours, l: "Hours" },
              { v: cd.minutes, l: "Minutes" },
              { v: cd.seconds, l: "Seconds" },
            ].map(({ v, l }, i) => (
              <div key={l} className="flex items-start">
                <div className="min-w-[3.6rem] text-center sm:min-w-[4.75rem]">
                  <div className="text-[34px] font-semibold leading-none tracking-tight tabular-nums text-[#1d1d1f] sm:text-[52px]">
                    {String(v).padStart(2, "0")}
                  </div>
                  <div className="mt-2 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6e6e73]">
                    {l}
                  </div>
                </div>
                {i < 3 ? (
                  <span
                    className="hidden pt-1 text-[28px] font-light leading-none text-[#c7c7cc] sm:block sm:text-[40px]"
                    aria-hidden="true"
                  >
                    :
                  </span>
                ) : null}
              </div>
            ))}
          </div>

          <a
            href={site.youtubeSubscribe}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ink btn-sm whitespace-normal text-center"
          >
            <YoutubeIcon className="h-4 w-4 shrink-0 text-[#ff3b30]" /> Subscribe so you never miss a service
          </a>
        </div>
      </div>
    </section>
  );
}
