/**
 * GSSAM Fremont — Site content
 * -----------------------------------------
 * Non-technical editors: everything the site displays lives in this file.
 * To add an event, copy an entry in EVENTS and change the values.
 * To add a sermon, paste its YouTube video ID into SERMONS.
 */

export const CHURCH = {
  name: 'Good Shepherd South Asian Ministry',
  shortName: 'GSSAM',
  city: 'Fremont',
  tagline: 'Worshipping the Good Shepherd in the languages of our hearts',
  address: '4211 Carol Ave, Fremont, CA 94538',
  addressMapsQuery: '4211+Carol+Ave,+Fremont,+CA+94538',
  phone: '(510) 781-0705',
  phoneHref: 'tel:+15107810705',
  email: 'info@gssam-iccfremont.com',
  languages: ['Telugu', 'Hindi', 'Tamil', 'English'],
  denomination: 'Lutheran (ELCA)',
};

export const YOUTUBE = {
  handle: '@GSSAMFremont',
  channelId: 'UCIdiSqp8RumBCxVA_HQYqmg',
  channelUrl: 'https://www.youtube.com/@GSSAMFremont',
  liveUrl: 'https://www.youtube.com/@GSSAMFremont/live',
  subscribeUrl: 'https://www.youtube.com/@GSSAMFremont?sub_confirmation=1',
  /** Privacy-enhanced live embed — shows the stream whenever the channel is live */
  liveEmbed: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UCIdiSqp8RumBCxVA_HQYqmg',
  embedUrl: (videoId: string) => `https://www.youtube-nocookie.com/embed/${videoId}`,
  thumbnail: (videoId: string) => `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
};

/** Sunday worship window in Pacific Time (24h) */
export const WORSHIP = {
  dayOfWeek: 0, // Sunday
  startHour: 11,
  startMinute: 30,
  endHour: 13,
  endMinute: 0,
  label: 'Sundays · 11:30 AM – 1:00 PM PT',
};

/* ---------------------------------- Sermons ---------------------------------- */
/** Pulled from the @GSSAMFremont channel. Newest first. */
export interface Sermon {
  videoId: string;
  title: string;
  date: string; // ISO
  type: 'Sunday Worship' | 'Special Service' | 'Celebration';
}

export const SERMONS: Sermon[] = [
  { videoId: 'xkEJUf0WZhc', title: 'Sunday Worship — July 26, 2026', date: '2026-07-26', type: 'Sunday Worship' },
  { videoId: 'V7Ei8ArS1vI', title: 'Sunday Worship — July 19, 2026', date: '2026-07-19', type: 'Sunday Worship' },
  { videoId: 'AogGJlMbqgU', title: 'Sunday Worship — July 5, 2026', date: '2026-07-05', type: 'Sunday Worship' },
  { videoId: 'achHEyqrhl8', title: 'Sunday Worship — June 7, 2026', date: '2026-06-07', type: 'Sunday Worship' },
  { videoId: 'MBIN-BPBz_c', title: 'Sunday Worship — May 17, 2026', date: '2026-05-17', type: 'Sunday Worship' },
  { videoId: '7pnKu7InteA', title: 'Sunday Worship — February 8, 2026', date: '2026-02-08', type: 'Sunday Worship' },
  { videoId: 'B7r_gg2WtlQ', title: 'Sunday Worship — January 4, 2026', date: '2026-01-04', type: 'Sunday Worship' },
  { videoId: 'zOr44DwARfk', title: 'Good Friday Worship', date: '2026-04-03', type: 'Special Service' },
  { videoId: 'OMsr17ovG84', title: 'Sunday Worship — August 31, 2025', date: '2025-08-31', type: 'Sunday Worship' },
  { videoId: '_klE_IRcdnc', title: 'Sunday Worship — August 3, 2025', date: '2025-08-03', type: 'Sunday Worship' },
];

/* ----------------------------------- Events ----------------------------------- */
export type EventCategory =
  | 'Worship'
  | 'Bible Study'
  | 'Youth'
  | 'Outreach'
  | 'Fellowship'
  | 'Special Service';

export interface ChurchEvent {
  id: string;
  title: string;
  category: EventCategory;
  /** Weekly recurrence: 0 = Sunday … 6 = Saturday. Omit for one-time events. */
  weeklyDay?: number;
  /** One-time event date (ISO, e.g. '2026-12-24'). */
  date?: string;
  startTime: string; // 'HH:MM' 24h, Pacific
  endTime: string;
  location: string;
  description: string;
  image?: string;
}

export const CATEGORY_COLORS: Record<EventCategory, string> = {
  Worship: 'bg-[hsl(349,68%,25%)] text-white',
  'Bible Study': 'bg-[hsl(38,70%,45%)] text-white',
  Youth: 'bg-[hsl(200,55%,35%)] text-white',
  Outreach: 'bg-[hsl(140,40%,35%)] text-white',
  Fellowship: 'bg-[hsl(20,70%,45%)] text-white',
  'Special Service': 'bg-[hsl(280,45%,35%)] text-white',
};

export const EVENTS: ChurchEvent[] = [
  {
    id: 'sunday-worship',
    title: 'Sunday Worship Service',
    category: 'Worship',
    weeklyDay: 0,
    startTime: '11:30',
    endTime: '13:00',
    location: 'GSSAM Sanctuary · 4211 Carol Ave',
    description:
      'Traditional Lutheran worship with hymns in Telugu, Hindi, Tamil, and English, followed by fellowship. Also streamed live on our YouTube channel.',
    image: '/images/hero-worship.png',
  },
  {
    id: 'prayer-meeting',
    title: 'Midweek Prayer Meeting',
    category: 'Worship',
    weeklyDay: 3,
    startTime: '19:00',
    endTime: '20:00',
    location: 'GSSAM Fellowship Hall',
    description:
      'A quiet hour of intercessory prayer, scripture meditation, and hymns. Bring your prayer requests — we pray for one another and our community.',
    image: '/images/prayer.png',
  },
  {
    id: 'bible-study',
    title: 'Friday Bible Study',
    category: 'Bible Study',
    weeklyDay: 5,
    startTime: '19:30',
    endTime: '20:30',
    location: 'GSSAM Fellowship Hall',
    description:
      'Verse-by-verse study of Scripture in a discussion format. All are welcome, whether you are new to the Bible or have studied for years.',
    image: '/images/youth.png',
  },
  {
    id: 'youth-fellowship',
    title: 'Youth Fellowship',
    category: 'Youth',
    weeklyDay: 6,
    startTime: '16:00',
    endTime: '17:30',
    location: 'GSSAM Fellowship Hall',
    description:
      'Worship songs, games, and real conversations about faith and life for middle school through college age. Snacks provided!',
    image: '/images/youth.png',
  },
  {
    id: 'community-outreach',
    title: 'Community Outreach Day',
    category: 'Outreach',
    date: '2026-08-15',
    startTime: '10:00',
    endTime: '13:00',
    location: 'GSSAM Front Lawn',
    description:
      'Serving our Fremont neighbors with groceries, prayer, and friendship. Volunteers meet at 9:30 AM — come as you are.',
    image: '/images/outreach.png',
  },
  {
    id: 'fellowship-potluck',
    title: 'Fellowship Potluck Lunch',
    category: 'Fellowship',
    date: '2026-08-30',
    startTime: '13:00',
    endTime: '15:00',
    location: 'GSSAM Fellowship Hall',
    description:
      'Our monthly congregational potluck after worship. Bring a dish to share and stay for food, laughter, and community.',
    image: '/images/fellowship-meal.png',
  },
  {
    id: 'christmas-carol',
    title: 'Christmas Carol Service',
    category: 'Special Service',
    date: '2026-12-20',
    startTime: '18:00',
    endTime: '20:00',
    location: 'GSSAM Sanctuary',
    description:
      'Carols in Telugu, Hindi, Tamil, and English, candle-lighting, and the Christmas story — followed by dinner. A highlight of our year.',
    image: '/images/celebration.png',
  },
];

/* --------------------------------- Ministries --------------------------------- */
export interface Ministry {
  name: string;
  description: string;
  image: string;
}

export const MINISTRIES: Ministry[] = [
  {
    name: 'Worship & Music',
    description:
      'Our worship team leads traditional Lutheran hymns in Telugu, Hindi, Tamil, and English — accompanied by harmonium, keyboard, and congregational singing. New singers and musicians are always welcome.',
    image: '/images/hero-worship.png',
  },
  {
    name: 'Youth Fellowship',
    description:
      'A space for the next generation to grow in faith together — worship, games, honest conversations, and mentoring for middle schoolers through college students.',
    image: '/images/youth.png',
  },
  {
    name: 'Outreach & Service',
    description:
      'We serve our Fremont neighbors through food distribution, prayer, and practical help — living out the love of Christ beyond our walls.',
    image: '/images/outreach.png',
  },
  {
    name: "Women's Fellowship",
    description:
      'Sisters in Christ gathering for Bible study, prayer, and mutual encouragement — supporting one another through every season of life.',
    image: '/images/prayer.png',
  },
  {
    name: "Men's Fellowship",
    description:
      'Men of the congregation meeting for fellowship, scripture, and service projects that support the church and the wider community.',
    image: '/images/fellowship-meal.png',
  },
  {
    name: 'Cultural Celebrations',
    description:
      'From Christmas carols to harvest thanksgiving, we celebrate our South Asian heritage within the Lutheran tradition — with music, dance, food, and joy.',
    image: '/images/celebration.png',
  },
];

/* ----------------------------------- Gallery ----------------------------------- */
export const GALLERY = [
  { src: '/images/hero-worship.png', caption: 'Sunday worship in the sanctuary' },
  { src: '/images/baptism.png', caption: 'Baptism celebration' },
  { src: '/images/fellowship-meal.png', caption: 'Fellowship potluck' },
  { src: '/images/celebration.png', caption: 'Cultural celebration' },
  { src: '/images/youth.png', caption: 'Youth fellowship' },
  { src: '/images/outreach.png', caption: 'Community outreach' },
  { src: '/images/prayer.png', caption: 'Prayer meeting' },
];
