export const DROPPED_YOUTUBE_IDS = new Set(["--YvdIrX6Sc"]);

export const SERMON_CATALOG = [
  {
    youtubeId: "xkEJUf0WZhc",
    title: "GSSAM Sunday worship live - July 26TH - 11.30 AM - 1 PM",
    preachedAt: new Date("2026-07-26T11:30:00-07:00"),
    description: "Sunday worship livestream from GSSAM Fremont.",
  },
  {
    youtubeId: "V7Ei8ArS1vI",
    title: "GSSAM Sunday worship live - July 19th - 11.30 AM - 1 PM",
    preachedAt: new Date("2026-07-19T11:30:00-07:00"),
    description: "Sunday worship livestream from GSSAM Fremont.",
  },
  {
    youtubeId: "AogGJlMbqgU",
    title: "GSSAM Sunday worship live - July 5th - 11.30 AM - 1 PM",
    preachedAt: new Date("2026-07-05T11:30:00-07:00"),
    description: "Sunday worship livestream from GSSAM Fremont.",
  },
  {
    youtubeId: "achHEyqrhl8",
    title: "GSSAM Sunday worship live - June 7th - 11.30 AM - 1 PM",
    preachedAt: new Date("2026-06-07T11:30:00-07:00"),
    description: "Sunday worship livestream from GSSAM Fremont.",
  },
  {
    youtubeId: "MBIN-BPBz_c",
    title: "GSSAM Sunday worship live - May 17th - 11.30 AM - 1 PM",
    preachedAt: new Date("2026-05-17T11:30:00-07:00"),
    description: "Sunday worship livestream from GSSAM Fremont.",
  },
  {
    youtubeId: "7NfSbYOQtgI",
    title: "GSSAM Easter Sunday  live - 31st March - 11.30 AM - 1 PM",
    preachedAt: new Date("2024-03-31T11:30:00-07:00"),
    description: "Easter Sunday worship with the GSSAM congregation in Fremont.",
  },
  {
    youtubeId: "zOr44DwARfk",
    title: "GSSAM Good Friday worship live - Feb 29th - 7 PM - 8.30 PM",
    preachedAt: new Date("2024-03-29T19:00:00-07:00"),
    description: "Good Friday evening worship, 7:00–8:30 PM.",
  },
  {
    youtubeId: "D9G1jnlXheA",
    title: "GSSAM Palm Sunday worship live - March 24th 11.30 AM - 1 PM",
    preachedAt: new Date("2024-03-24T11:30:00-07:00"),
    description: "Palm Sunday worship, 11:30 AM–1:30 PM.",
  },
  {
    youtubeId: "elDcgGhHm8k",
    title: "GSSAM Sunday worship live - March 17th - 11.30 AM - 1.00 PM",
    preachedAt: new Date("2024-03-17T11:30:00-07:00"),
    description: "Sunday worship livestream from GSSAM Fremont.",
  },
  {
    youtubeId: "M3Qgw6f_by8",
    title: "GSSAM Sunday worship live - March 10th - 11.30 - 12.45",
    preachedAt: new Date("2024-03-10T11:30:00-07:00"),
    description: "Sunday worship livestream from GSSAM Fremont.",
  },
  {
    youtubeId: "9gjPgTqupx8",
    title: "GSSAM Sunday worship live - March 03 - 11.15 - 12.45",
    preachedAt: new Date("2024-03-03T11:15:00-08:00"),
    description: "Sunday worship livestream from GSSAM Fremont.",
  },
  {
    youtubeId: "cUKBVFtXxw4",
    title: "GSSAM Fremont Sunday Live Stream -02/25/2024",
    preachedAt: new Date("2024-02-25T11:30:00-08:00"),
    description: "Sunday worship livestream from GSSAM Fremont.",
  },
  {
    youtubeId: "PqsKFecjJng",
    title: "GSSAM Sunday worship live - Feb 18 th - 10.30 - 11.45",
    preachedAt: new Date("2024-02-18T10:30:00-08:00"),
    description: "Sunday worship livestream from GSSAM Fremont.",
  },
  {
    youtubeId: "NRFAQ8_ncEE",
    title: "GSSAM Sunday worship live - Feb 11 th - 10.30 - 11.45 AM",
    preachedAt: new Date("2024-02-11T10:30:00-08:00"),
    description: "Sunday worship livestream from GSSAM Fremont.",
  },
] as const;

export function applySermonCatalog<
  T extends { youtubeId: string; title: string; preachedAt: Date; description: string },
>(sermons: T[]) {
  const seen = new Set<string>();
  return sermons.flatMap((sermon) => {
    if (DROPPED_YOUTUBE_IDS.has(sermon.youtubeId) || seen.has(sermon.youtubeId)) {
      return [];
    }
    seen.add(sermon.youtubeId);
    const canonical = SERMON_CATALOG.find((item) => item.youtubeId === sermon.youtubeId);
    if (!canonical) return [sermon];
    return [
      {
        ...sermon,
        title: canonical.title,
        preachedAt: new Date(canonical.preachedAt),
        description: canonical.description,
      },
    ];
  });
}
