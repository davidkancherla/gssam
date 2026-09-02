export const site = {
  name: "Good Shepherd South Asian Ministry",
  shortName: "GSSAM",
  city: "Fremont",
  tagline: "Worshipping the Good Shepherd in the languages of our hearts",
  description:
    "Join our South Asian Lutheran family as we worship the Lord Jesus Christ with traditional hymns in Telugu, Hindi, and English — in person in Fremont and live online every Sunday.",
  address: "4211 Carol Ave, Fremont, CA 94538",
  addressLines: ["4211 Carol Ave", "Fremont, CA 94538"],
  addressMapsQuery: "4211+Carol+Ave,+Fremont,+CA+94538",
  phone: "(510) 688-8241",
  phoneHref: "tel:+15106888241",
  email: "gssamfremont@gmail.com",
  ein: "20-5071191",
  pastor: "Ps. Anand Darla",
  denomination: "Lutheran (ELCA)",
  worship: "Sundays · 11:30 AM – 1:30 PM PT",
  languages: ["Telugu", "Hindi", "English"],
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=4211+Carol+Ave+Fremont+CA+94538",
  mapEmbed:
    "https://maps.google.com/maps?q=4211%20Carol%20Ave%20Fremont%20CA%2094538&t=&z=15&ie=UTF8&iwloc=&output=embed",
  youtube: "https://www.youtube.com/@GSSAMFremont",
  youtubeHandle: "@GSSAMFremont",
  youtubeLive: "https://www.youtube.com/@GSSAMFremont/live",
  youtubeSubscribe: "https://www.youtube.com/@GSSAMFremont?sub_confirmation=1",
  youtubeChannelId: "UCIdiSqp8RumBCxVA_HQYqmg",
  youtubeLiveEmbed:
    "https://www.youtube-nocookie.com/embed/live_stream?channel=UCIdiSqp8RumBCxVA_HQYqmg",
  facebook: "https://www.facebook.com/gssam.fremontca/",
  paypalEmail: "gssam2005@gmail.com",
  zelleEmail: "gssam2005@gmail.com",
};

export const WORSHIP = {
  dayOfWeek: 0,
  startHour: 11,
  startMinute: 30,
  endHour: 13,
  endMinute: 30,
  label: site.worship,
  image: "/images/real-bishop-visit.jpg",
};

/** Gallery source of truth for the homepage hero. */
export const BISHOP_VISIT = {
  image: "/images/real-bishop-visit.jpg",
  caption: "Pastor Anand Darla's ordination",
};

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/messages", label: "Sermons" },
  { href: "/events", label: "Events" },
  { href: "/ministries", label: "Ministries" },
  { href: "/donate", label: "Give" },
  { href: "/contact", label: "Contact" },
];

export function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function formatDate(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatShortDate(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function paragraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
}
