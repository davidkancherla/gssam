import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const dist = join(root, "dist");
const distServer = join(root, "dist", "server");

const assetBase = "https://raw.githubusercontent.com/davidkancherla/gssam/main/public/";

const images = {
  logo: `${assetBase}brand/logo.png`,
  hero: `${assetBase}images/real-bishop-visit.jpg`,
  congregation: `${assetBase}images/real-congregation.jpg`,
  altar: `${assetBase}images/real-altar-candles.jpg`,
  youth: `${assetBase}images/ministries/youth.jpg`,
  sundaySchool: `${assetBase}images/ministries/sunday-school.jpg`,
  outreach: `${assetBase}images/events/food.jpg`,
};

const site = {
  name: "Good Shepherd South Asian Ministry",
  shortName: "GSSAM",
  address: "4211 Carol Ave, Fremont, CA 94538",
  phone: "(510) 688-8241",
  email: "gssamfremont@gmail.com",
  paymentEmail: "gssam2005@gmail.com",
  worship: "Sundays | 11:30 AM - 1:30 PM PT",
  youtube: "https://www.youtube.com/@GSSAMFremont",
  facebook: "https://www.facebook.com/gssam.fremontca/",
};

const nav = [
  ["/", "Home"],
  ["/about", "About"],
  ["/ministries", "Ministries"],
  ["/events", "Events"],
  ["/messages", "Messages"],
  ["/donate", "Give"],
  ["/contact", "Contact"],
  ["/login", "Admin Login"],
];

const ministries = [
  ["Men's Fellowship", "Bible study, prayer, mentoring, and service for the men of GSSAM."],
  ["Women's Fellowship", "Prayer, study, workshops, friendship, and care for families and neighbors."],
  ["Youth Fellowship", "Faith, friendship, music, leadership, and service for young people."],
  ["Sunday School", "Age-appropriate Bible teaching, songs, crafts, and worship participation."],
  ["Community Engagement", "Outreach, prayer, neighbor-care, and practical service across Fremont."],
];

const events = [
  ["Sunday School and Worship", "Every Sunday, 11:30 AM - 1:30 PM", site.address],
  ["Women's All-Night Prayer", "Monthly gathering", "Prayer and fellowship for the women of the congregation."],
  ["Community Care", "Seasonal outreach", "Food, clothing, books, and support for neighbors in need."],
];

const messages = [
  ["Sunday Worship Recordings", "Watch recent worship messages on the GSSAM Fremont YouTube channel."],
  ["Live Worship", "Join online when travel or health keeps you away from Sunday worship."],
  ["Multilingual Worship", "Traditional Lutheran hymns and liturgy in Telugu, Hindi, and English."],
];

const reviewPages = [
  ["/", "Home"],
  ["/about", "About"],
  ["/ministries", "Ministries"],
  ["/events", "Events"],
  ["/messages", "Messages"],
  ["/donate", "Giving"],
  ["/contact", "Contact"],
  ["/privacy", "Privacy"],
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function style() {
  return `
    :root {
      color-scheme: light;
      --ink: #1d1a16;
      --muted: #665f55;
      --paper: #fffaf1;
      --cream: #f8efd9;
      --red: #8b1e1e;
      --red-dark: #641414;
      --gold: #c49a37;
      --green: #2d5a4a;
      --line: rgba(29, 26, 22, 0.14);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: var(--ink);
      background: var(--paper);
      line-height: 1.55;
    }
    a { color: inherit; }
    input, textarea, select, button { font: inherit; }
    .topbar {
      background: var(--red-dark);
      color: white;
      font-size: 0.92rem;
    }
    .topbar-inner, .nav-inner, .section, .footer-inner {
      width: min(1160px, calc(100vw - 32px));
      margin: 0 auto;
    }
    .topbar-inner {
      min-height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .site-nav {
      position: sticky;
      top: 0;
      z-index: 10;
      background: rgba(255, 250, 241, 0.96);
      border-bottom: 1px solid var(--line);
      backdrop-filter: blur(12px);
    }
    .nav-inner {
      min-height: 82px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 14px;
      text-decoration: none;
      min-width: 240px;
    }
    .brand img {
      width: 96px;
      height: 50px;
      object-fit: contain;
      background: var(--red-dark);
      border-radius: 8px;
      padding: 7px;
      box-shadow: 0 8px 22px rgba(100, 20, 20, 0.2);
    }
    .brand strong { display: block; color: var(--red-dark); font-size: 1.08rem; line-height: 1.1; }
    .brand span { display: block; color: var(--muted); font-size: 0.86rem; }
    .links {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 8px;
    }
    .links a {
      text-decoration: none;
      padding: 9px 11px;
      border-radius: 6px;
      color: #382f25;
      font-weight: 650;
      font-size: 0.94rem;
    }
    .links a:hover, .links a[aria-current="page"] { background: var(--cream); color: var(--red-dark); }
    .hero {
      min-height: 640px;
      display: grid;
      align-items: end;
      background:
        linear-gradient(90deg, rgba(29, 20, 12, 0.82), rgba(29, 20, 12, 0.48), rgba(29, 20, 12, 0.12)),
        url("${images.hero}") center / cover;
      color: white;
    }
    .hero .section { padding: 96px 0 72px; }
    .kicker {
      margin: 0 0 16px;
      color: #f6d879;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      font-size: 0.85rem;
    }
    h1 {
      max-width: 850px;
      margin: 0;
      font-size: clamp(3rem, 8vw, 6.7rem);
      line-height: 0.96;
      letter-spacing: 0;
    }
    .lead {
      max-width: 680px;
      margin: 22px 0 0;
      font-size: 1.2rem;
      color: rgba(255, 255, 255, 0.9);
    }
    .hero-caption {
      display: inline-flex;
      margin-top: 18px;
      padding: 8px 11px;
      border-radius: 6px;
      background: rgba(255, 250, 241, 0.14);
      border: 1px solid rgba(255, 255, 255, 0.26);
      color: rgba(255, 255, 255, 0.92);
      font-size: 0.95rem;
      font-weight: 700;
    }
    .actions, .toolbar { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 46px;
      padding: 11px 16px;
      border-radius: 7px;
      border: 1px solid transparent;
      text-decoration: none;
      font-weight: 800;
      cursor: pointer;
    }
    .button.primary { background: var(--gold); color: #241805; }
    .button.dark { background: var(--red-dark); color: white; }
    .button.secondary { border-color: rgba(255,255,255,0.5); color: white; background: rgba(255,255,255,0.08); }
    .button.light { background: #fffdf8; border-color: var(--line); color: var(--red-dark); }
    .section { padding: 72px 0; }
    .section.compact { padding: 48px 0; }
    .eyebrow { color: var(--red); text-transform: uppercase; font-size: 0.82rem; font-weight: 850; letter-spacing: 0.08em; margin: 0 0 8px; }
    h2 { margin: 0; font-size: clamp(2rem, 4vw, 3.4rem); line-height: 1.03; letter-spacing: 0; color: var(--red-dark); }
    .intro { max-width: 760px; margin: 14px 0 0; color: var(--muted); font-size: 1.08rem; }
    .band { background: var(--cream); border-block: 1px solid var(--line); }
    .split {
      display: grid;
      grid-template-columns: minmax(0, 1.05fr) minmax(300px, 0.95fr);
      gap: 36px;
      align-items: center;
    }
    .photo {
      width: 100%;
      aspect-ratio: 4 / 3;
      object-fit: cover;
      border-radius: 8px;
      box-shadow: 0 18px 42px rgba(39, 23, 10, 0.18);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 18px;
      margin-top: 28px;
    }
    .card {
      background: #fffdf8;
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 22px;
      min-height: 150px;
    }
    .card h3 { margin: 0 0 8px; color: var(--red-dark); font-size: 1.2rem; }
    .card p { margin: 0; color: var(--muted); }
    .feature-row {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 18px;
      margin-top: 28px;
    }
    .feature {
      overflow: hidden;
      border-radius: 8px;
      background: #fffdf8;
      border: 1px solid var(--line);
    }
    .feature img { width: 100%; height: 190px; object-fit: cover; display: block; }
    .feature div { padding: 20px; }
    .feature h3 { margin: 0 0 7px; color: var(--red-dark); }
    .feature p { margin: 0; color: var(--muted); }
    .notice {
      margin-top: 22px;
      background: #fffdf8;
      border-left: 5px solid var(--gold);
      padding: 18px 20px;
      border-radius: 6px;
      color: var(--muted);
    }
    .footer {
      background: #211914;
      color: #fff8e8;
      padding: 42px 0;
    }
    .footer-inner {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr 0.8fr;
      gap: 24px;
    }
    .footer a { color: #f6d879; }
    .footer h2 { color: white; font-size: 1.4rem; }
    .portal {
      min-height: 68vh;
      display: grid;
      grid-template-columns: 250px minmax(0, 1fr);
      background: var(--paper);
    }
    .portal aside {
      border-right: 1px solid var(--line);
      background: #fffdf8;
      padding: 24px 18px;
    }
    .portal-main { padding: 36px; }
    .portal-links { display: grid; gap: 8px; margin-top: 24px; }
    .portal-links a, .portal-links button {
      width: 100%;
      display: block;
      border: 0;
      border-radius: 7px;
      background: transparent;
      color: var(--red-dark);
      cursor: pointer;
      font-weight: 750;
      padding: 10px 12px;
      text-align: left;
      text-decoration: none;
    }
    .portal-links a:hover, .portal-links a[aria-current="page"], .portal-links button:hover { background: var(--cream); }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
      margin-top: 18px;
    }
    .field { display: grid; gap: 5px; font-size: 0.92rem; color: var(--red-dark); font-weight: 700; }
    .field.full { grid-column: 1 / -1; }
    .input {
      width: 100%;
      border: 1px solid var(--line);
      border-radius: 7px;
      background: white;
      color: var(--ink);
      padding: 11px 12px;
      font-weight: 500;
    }
    textarea.input { min-height: 110px; resize: vertical; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border-top: 1px solid var(--line); padding: 12px; text-align: left; vertical-align: top; }
    th { background: var(--cream); color: var(--muted); font-size: 0.84rem; }
    .status { display: inline-flex; border-radius: 999px; background: var(--cream); padding: 4px 8px; color: var(--red-dark); font-size: 0.8rem; font-weight: 800; }
    .table-wrap { overflow-x: auto; margin-top: 18px; }
    .login-wrap { min-height: 68vh; display: grid; place-items: center; padding: 40px 16px; }
    .login-card { width: min(460px, 100%); }
    .error { background: #fff0f0; border: 1px solid #e9b8b8; color: #801818; border-radius: 7px; padding: 12px; margin-top: 16px; }
    @media (max-width: 820px) {
      .topbar-inner, .nav-inner { align-items: flex-start; flex-direction: column; padding: 10px 0; }
      .nav-inner { gap: 12px; }
      .links { justify-content: flex-start; }
      .hero { min-height: 580px; }
      .split, .grid, .feature-row, .footer-inner, .portal, .form-grid { grid-template-columns: 1fr; }
      .section { padding: 52px 0; }
      .brand { min-width: 0; }
      .portal-main { padding: 24px 16px; }
      .portal aside { border-right: 0; border-bottom: 1px solid var(--line); }
    }
  `;
}

function publicShell({ title, description, body, path = "/" }) {
  const links = nav
    .map(([href, label]) => `<a href="${href}"${href === path ? ' aria-current="page"' : ""}>${label}</a>`)
    .join("");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} | ${site.shortName}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <style>${style()}</style>
</head>
<body>
  <div class="topbar">
    <div class="topbar-inner">
      <span>${site.worship}</span>
      <span>${site.address}</span>
    </div>
  </div>
  <nav class="site-nav" aria-label="Main navigation">
    <div class="nav-inner">
      <a class="brand" href="/">
        <img src="${images.logo}" alt="GSSAM logo">
        <span><strong>${site.name}</strong><span>Fremont, California</span></span>
      </a>
      <div class="links">${links}</div>
    </div>
  </nav>
  ${body}
  <footer class="footer">
    <div class="footer-inner">
      <div>
        <h2>${site.name}</h2>
        <p>Worshipping the Good Shepherd in Telugu, Hindi, and English.</p>
      </div>
      <div>
        <strong>Visit</strong>
        <p>${site.address}<br>${site.worship}</p>
      </div>
      <div>
        <strong>Contact</strong>
        <p><a href="mailto:${site.email}">${site.email}</a><br><a href="tel:+15106888241">${site.phone}</a></p>
      </div>
    </div>
  </footer>
</body>
</html>`;
}

function home() {
  return publicShell({
    path: "/",
    title: "Welcome",
    description: "Good Shepherd South Asian Ministry is a Lutheran congregation in Fremont, California.",
    body: `
      <header class="hero">
        <div class="section">
          <p class="kicker">Good Shepherd South Asian Ministry</p>
          <h1>Worship in the languages of our hearts.</h1>
          <p class="lead">Join our South Asian Lutheran family in Fremont for Sunday School and worship with traditional hymns in Telugu, Hindi, and English.</p>
          <p class="hero-caption">Pastor Anand Darla's ordination</p>
          <div class="actions">
            <a class="button primary" href="/contact">Plan a Visit</a>
            <a class="button secondary" href="${site.youtube}">Watch Online</a>
          </div>
        </div>
      </header>
      <section class="section split">
        <div>
          <p class="eyebrow">Sunday worship</p>
          <h2>Come as family. Worship as one body in Christ.</h2>
          <p class="intro">GSSAM welcomes families across the Bay Area to gather each Sunday from 11:30 AM to 1:30 PM at 4211 Carol Ave in Fremont.</p>
        </div>
        <img class="photo" src="${images.congregation}" alt="GSSAM congregation gathered for worship">
      </section>
      <section class="band">
        <div class="section">
          <p class="eyebrow">Ministries</p>
          <h2>Faith, fellowship, and service for every generation.</h2>
          <div class="feature-row">
            <article class="feature"><img src="${images.youth}" alt="Youth ministry"><div><h3>Youth Fellowship</h3><p>Faith, friendship, music, leadership, and service.</p></div></article>
            <article class="feature"><img src="${images.sundaySchool}" alt="Sunday School"><div><h3>Sunday School</h3><p>Bible teaching, songs, and crafts for children.</p></div></article>
            <article class="feature"><img src="${images.outreach}" alt="Community outreach"><div><h3>Community Engagement</h3><p>Serving neighbors with prayer and practical care.</p></div></article>
          </div>
        </div>
      </section>
    `,
  });
}

function simplePage(path, title, description, content) {
  return publicShell({
    path,
    title,
    description,
    body: `<main class="section"><p class="eyebrow">${site.shortName}</p><h1 style="color: var(--red-dark); font-size: clamp(2.7rem, 6vw, 5.4rem);">${title}</h1><p class="lead" style="color: var(--muted);">${description}</p>${content}</main>`,
  });
}

function cards(items) {
  return `<div class="grid">${items
    .map(([heading, text, meta = ""]) => `<article class="card"><h3>${heading}</h3><p>${text}</p>${meta ? `<p><strong>${meta}</strong></p>` : ""}</article>`)
    .join("")}</div>`;
}

const routes = {
  "/": home(),
  "/about": publicShell({
    path: "/about",
    title: "About",
    description: "About Good Shepherd South Asian Ministry in Fremont.",
    body: `
      <main class="section split">
        <div>
          <p class="eyebrow">About us</p>
          <h1 style="color: var(--red-dark); font-size: clamp(2.7rem, 6vw, 5.4rem);">A Lutheran congregation with South Asian roots.</h1>
          <p class="intro">Good Shepherd South Asian Ministry welcomes people from many cultural backgrounds into Christian worship, Scripture, prayer, and service.</p>
          <p>We believe in the Triune God, confess the historic Christian faith, and gather around Word and Sacrament. GSSAM continues the ministry of Good Shepherd Lutheran Church at 4211 Carol Ave in Fremont.</p>
          <p>Pastor Anand Darla shepherds the congregation through preaching, prayer, Sacraments, and multilingual worship for South Asian families.</p>
        </div>
        <img class="photo" src="${images.altar}" alt="Church altar and candles">
      </main>
    `,
  }),
  "/ministries": simplePage(
    "/ministries",
    "Ministries",
    "Men's Fellowship, Women's Fellowship, Youth Fellowship, Sunday School, and Community Engagement.",
    cards(ministries),
  ),
  "/events": simplePage(
    "/events",
    "Events",
    "Gather for worship, prayer, fellowship, and community care.",
    cards(events),
  ),
  "/messages": simplePage(
    "/messages",
    "Messages",
    "Recent worship recordings and live services are available through the GSSAM Fremont YouTube channel.",
    `${cards(messages)}<div class="actions"><a class="button primary" href="${site.youtube}">Open YouTube Channel</a></div>`,
  ),
  "/donate": simplePage(
    "/donate",
    "Giving",
    "Thank you for supporting the ministry of GSSAM through tithes, offerings, and special gifts.",
    `<div class="grid">
      <article class="card"><h3>Zelle</h3><p>${site.paymentEmail}</p></article>
      <article class="card"><h3>PayPal</h3><p>${site.paymentEmail}</p></article>
      <article class="card"><h3>Checks</h3><p>Mail to ${site.address}</p></article>
    </div>
    <div class="notice">GSSAM is a church recognized as a religious organization, EIN 20-5071191. Please keep receipts and consult a tax professional for your situation.</div>`,
  ),
  "/contact": simplePage(
    "/contact",
    "Contact",
    "We would be glad to welcome you on Sunday or answer a question during the week.",
    `<div class="grid">
      <article class="card"><h3>Address</h3><p>${site.address}</p></article>
      <article class="card"><h3>Phone</h3><p><a href="tel:+15106888241">${site.phone}</a></p></article>
      <article class="card"><h3>Email</h3><p><a href="mailto:${site.email}">${site.email}</a></p></article>
    </div>
    <div class="actions"><a class="button primary" href="mailto:${site.email}">Email the Church</a><a class="button light" href="https://www.google.com/maps/search/?api=1&query=4211+Carol+Ave+Fremont+CA+94538">Open Map</a></div>`,
  ),
  "/privacy": simplePage(
    "/privacy",
    "Privacy",
    "GSSAM values your privacy and protects personal information shared through the website.",
    `<div class="notice">For questions about privacy or personal information, please contact the church office at <a href="mailto:${site.email}">${site.email}</a>.</div>`,
  ),
};

const worker = `const ROUTES = ${JSON.stringify(routes)};
const REVIEW_PAGES = ${JSON.stringify(reviewPages)};
const SITE = ${JSON.stringify(site)};
const ADMIN_EMAIL_DEFAULT = "admin@gssam.demo";
const SESSION_COOKIE = "gssam_poc_admin";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function fullStyle() {
  const match = ROUTES["/"].match(/<style>([\\s\\S]*?)<\\/style>/);
  return match ? match[1] : "";
}

function page(title, body, path) {
  return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>' +
    escapeHtml(title) + ' | GSSAM</title><style>' + fullStyle() + '</style></head><body>' + body + '</body></html>';
}

function adminShell(title, activePath, inner, userEmail) {
  const links = [
    ["/admin", "Overview"],
    ["/admin/review", "Content Review"],
    ["/admin/members", "Members"],
    ["/", "Public Site"]
  ].map(function(item) {
    const current = item[0] === activePath ? ' aria-current="page"' : "";
    return '<a href="' + item[0] + '"' + current + '>' + item[1] + '</a>';
  }).join("");

  return page(title, '<div class="portal"><aside><p class="eyebrow">POC admin</p><h2 style="font-size:1.6rem">' + escapeHtml(SITE.shortName) +
    '</h2><p class="intro" style="font-size:.92rem">' + escapeHtml(userEmail) +
    '</p><nav class="portal-links">' + links +
    '<form method="post" action="/logout"><button type="submit">Sign out</button></form></nav></aside><main class="portal-main">' + inner +
    '</main></div>', activePath);
}

function redirectTo(path, status) {
  return new Response(null, { status: status || 303, headers: { location: path } });
}

function html(body, status) {
  return new Response(body, {
    status: status || 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

function parseCookies(request) {
  const cookie = request.headers.get("cookie") || "";
  const result = {};
  for (const part of cookie.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    result[part.slice(0, idx).trim()] = part.slice(idx + 1).trim();
  }
  return result;
}

function base64UrlEncode(text) {
  return btoa(text).replace(/\\+/g, "-").replace(/\\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(text) {
  const normalized = text.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return atob(padded);
}

function hex(buffer) {
  return Array.from(new Uint8Array(buffer)).map(function(byte) {
    return byte.toString(16).padStart(2, "0");
  }).join("");
}

async function sha256Hex(text) {
  return hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)));
}

async function hmac(text, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return hex(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(text)));
}

async function createSession(email, env) {
  const expires = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = base64UrlEncode(JSON.stringify({ email, expires }));
  const sessionSecret = getRequiredSecret(env, "POC_SESSION_SECRET");
  const sig = await hmac(payload, sessionSecret);
  return payload + "." + sig;
}

async function getSession(request, env) {
  const token = parseCookies(request)[SESSION_COOKIE];
  if (!token || !token.includes(".")) return null;
  const parts = token.split(".");
  const sessionSecret = getRequiredSecret(env, "POC_SESSION_SECRET");
  const expected = await hmac(parts[0], sessionSecret);
  if (parts[1] !== expected) return null;
  try {
    const payload = JSON.parse(base64UrlDecode(parts[0]));
    if (!payload.email || !payload.expires || payload.expires < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

async function requireAdmin(request, env) {
  return await getSession(request, env);
}

function loginPage(error, next) {
  const errorHtml = error ? '<p class="error">' + escapeHtml(error) + '</p>' : "";
  return page("Admin Login", '<main class="login-wrap"><form class="card login-card" method="post" action="/login">' +
    '<p class="eyebrow">Admin portal</p><h1 style="font-size:2.6rem;color:var(--red-dark)">Sign in</h1>' +
    '<p class="intro" style="font-size:.98rem">Use the POC admin login to review content and manage private member information.</p>' +
    errorHtml + '<input type="hidden" name="next" value="' + escapeHtml(next || "/admin") + '">' +
    '<div class="form-grid" style="grid-template-columns:1fr"><label class="field">Email<input class="input" type="email" name="email" required autocomplete="username"></label>' +
    '<label class="field">Password<input class="input" type="password" name="password" required autocomplete="current-password"></label></div>' +
    '<div class="toolbar"><button class="button dark" type="submit">Sign in</button><a class="button light" href="/">Back to public site</a></div></form></main>', "/login");
}

function getRequiredSecret(env, key) {
  const value = env[key];
  if (!value) throw new Error(key + " is not configured.");
  return String(value);
}

async function handleLogin(request, env) {
  const form = await request.formData();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");
  const next = String(form.get("next") || "/admin");
  const allowedEmail = String(env.POC_ADMIN_EMAIL || ADMIN_EMAIL_DEFAULT).toLowerCase();
  const expectedHash = getRequiredSecret(env, "POC_ADMIN_PASSWORD_SHA256");
  if (email !== allowedEmail || (await sha256Hex(password)) !== expectedHash) {
    return html(loginPage("That email or password is not right.", next), 401);
  }
  const session = await createSession(email, env);
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/admin";
  return new Response(null, {
    status: 303,
    headers: {
      location: safeNext,
      "set-cookie": SESSION_COOKIE + "=" + session + "; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800"
    }
  });
}

function signOut() {
  return new Response(null, {
    status: 303,
    headers: {
      location: "/",
      "set-cookie": SESSION_COOKIE + "=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0"
    }
  });
}

function assertDb(env) {
  if (!env.DB) throw new Error("Managed database binding is not available.");
  return env.DB;
}

function dateLabel(value) {
  if (!value) return "Not set";
  const date = new Date(value + "T12:00:00");
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function shortDate(value) {
  if (!value) return "Not set";
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

async function adminHome(request, env, user) {
  const db = assertDb(env);
  const members = await db.prepare("SELECT COUNT(*) AS count FROM member_profiles").first();
  const notes = await db.prepare("SELECT COUNT(*) AS count FROM content_review_notes").first();
  return html(adminShell("Admin", "/admin", '<p class="eyebrow">Church office</p><h1 style="color:var(--red-dark);font-size:clamp(2.5rem,5vw,4.8rem)">POC admin portal</h1>' +
    '<p class="intro">Use this shared proof-of-concept portal to review public content and test the private member directory. Member birthdays and anniversaries stay behind this login.</p>' +
    '<div class="grid"><a class="card" href="/admin/review"><h3>Content Review</h3><p>' + Number(notes?.count || 0) + ' reviewer notes</p></a>' +
    '<a class="card" href="/admin/members"><h3>Members</h3><p>' + Number(members?.count || 0) + ' people in the private directory</p></a>' +
    '<a class="card" href="/"><h3>Public Site</h3><p>Open the public website reviewers will validate.</p></a></div>' +
    '<div class="notice">This POC is hosted on managed infrastructure with a managed database. Replace the shared POC login with individual admin accounts before real production use.</div>', user.email));
}

function memberForm(member) {
  const m = member || {};
  return '<form class="card" method="post" action="/admin/members"><input type="hidden" name="id" value="' + escapeHtml(m.id || "") + '">' +
    '<h3>' + (member ? "Edit member information" : "Add member information") + '</h3>' +
    '<div class="form-grid"><label class="field">First name<input class="input" name="firstName" required value="' + escapeHtml(m.first_name || "") + '"></label>' +
    '<label class="field">Last name<input class="input" name="lastName" required value="' + escapeHtml(m.last_name || "") + '"></label>' +
    '<label class="field">Email<input class="input" type="email" name="email" value="' + escapeHtml(m.email || "") + '"></label>' +
    '<label class="field">Phone<input class="input" name="phone" value="' + escapeHtml(m.phone || "") + '"></label>' +
    '<label class="field">Household / family<input class="input" name="household" value="' + escapeHtml(m.household || "") + '"></label>' +
    '<label class="field">Address<input class="input" name="address" value="' + escapeHtml(m.address || "") + '"></label>' +
    '<label class="field">Birthday<input class="input" type="date" name="birthday" value="' + escapeHtml(m.birthday || "") + '"></label>' +
    '<label class="field">Wedding anniversary<input class="input" type="date" name="anniversary" value="' + escapeHtml(m.anniversary || "") + '"></label>' +
    '<label class="field full">Internal notes<textarea class="input" name="notes">' + escapeHtml(m.notes || "") + '</textarea></label>' +
    '<label class="field"><span><input type="checkbox" name="isActive" ' + (m.is_active === 0 ? "" : "checked") + '> Active member</span></label></div>' +
    '<div class="toolbar"><button class="button dark" type="submit">' + (member ? "Save member" : "Add member") + '</button>' + (member ? '<a class="button light" href="/admin/members">Cancel edit</a>' : "") + '</div></form>';
}

function membersTable(members) {
  if (!members.length) return '<p class="notice">No people have been added yet.</p>';
  return '<div class="card table-wrap"><table><thead><tr><th>Name</th><th>Contact</th><th>Household</th><th>Birthday</th><th>Anniversary</th><th>Status</th><th>Actions</th></tr></thead><tbody>' +
    members.map(function(m) {
      return '<tr><td><strong>' + escapeHtml(m.first_name) + ' ' + escapeHtml(m.last_name) + '</strong>' + (m.notes ? '<p style="font-size:.82rem;color:var(--muted)">' + escapeHtml(m.notes) + '</p>' : '') +
        '</td><td>' + escapeHtml(m.email || "No email") + '<br><span style="color:var(--muted)">' + escapeHtml(m.phone || "No phone") + '</span></td>' +
        '<td>' + escapeHtml(m.household || "Not set") + (m.address ? '<br><span style="color:var(--muted)">' + escapeHtml(m.address) + '</span>' : '') + '</td>' +
        '<td>' + escapeHtml(dateLabel(m.birthday)) + '</td><td>' + escapeHtml(dateLabel(m.anniversary)) + '</td><td><span class="status">' + (m.is_active ? "Active" : "Inactive") + '</span></td>' +
        '<td><a href="/admin/members?id=' + encodeURIComponent(m.id) + '">Edit</a><form method="post" action="/admin/members/delete" style="margin-top:8px"><input type="hidden" name="id" value="' + escapeHtml(m.id) + '"><button class="button light" type="submit">Remove</button></form></td></tr>';
    }).join("") + '</tbody></table></div>';
}

async function membersPage(request, env, user) {
  const db = assertDb(env);
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const selected = id ? await db.prepare("SELECT * FROM member_profiles WHERE id = ?").bind(id).first() : null;
  const members = await db.prepare("SELECT * FROM member_profiles ORDER BY is_active DESC, last_name ASC, first_name ASC").all();
  const saved = url.searchParams.get("saved") ? '<p class="notice">Saved. This information is private to the admin portal.</p>' : "";
  const body = '<p class="eyebrow">Private admin directory</p><h1 style="color:var(--red-dark);font-size:clamp(2.5rem,5vw,4.8rem)">Members</h1>' +
    '<p class="intro">Add people information, birthdays, wedding anniversaries, contact details, and internal notes. This section is not visible on the external church website.</p>' +
    saved + memberForm(selected) + membersTable(members.results || []);
  return html(adminShell("Members", "/admin/members", body, user.email));
}

async function saveMember(request, env) {
  const db = assertDb(env);
  const form = await request.formData();
  const id = String(form.get("id") || "").trim();
  const first = String(form.get("firstName") || "").trim();
  const last = String(form.get("lastName") || "").trim();
  if (!first || !last) return redirectTo("/admin/members?error=missing-name");
  const values = [
    first,
    last,
    String(form.get("email") || "").trim().toLowerCase(),
    String(form.get("phone") || "").trim(),
    String(form.get("household") || "").trim(),
    String(form.get("address") || "").trim(),
    String(form.get("birthday") || "").trim() || null,
    String(form.get("anniversary") || "").trim() || null,
    String(form.get("notes") || "").trim(),
    form.get("isActive") === "on" ? 1 : 0
  ];
  if (id) {
    await db.prepare("UPDATE member_profiles SET first_name = ?, last_name = ?, email = ?, phone = ?, household = ?, address = ?, birthday = ?, anniversary = ?, notes = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
      .bind(...values, id).run();
  } else {
    await db.prepare("INSERT INTO member_profiles (id, first_name, last_name, email, phone, household, address, birthday, anniversary, notes, is_active, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)")
      .bind(crypto.randomUUID(), ...values).run();
  }
  return redirectTo("/admin/members?saved=1");
}

async function deleteMember(request, env) {
  const db = assertDb(env);
  const form = await request.formData();
  const id = String(form.get("id") || "").trim();
  if (id) await db.prepare("DELETE FROM member_profiles WHERE id = ?").bind(id).run();
  return redirectTo("/admin/members?saved=1");
}

function reviewForm() {
  return '<form class="card" method="post" action="/admin/review"><h3>Add review note</h3><div class="form-grid">' +
    '<label class="field">Page<select class="input" name="pagePath">' + REVIEW_PAGES.map(function(page) { return '<option value="' + escapeHtml(page[0]) + '">' + escapeHtml(page[1]) + ' - ' + escapeHtml(page[0]) + '</option>'; }).join("") + '</select></label>' +
    '<label class="field">Note title<input class="input" name="title" required placeholder="Example: Update worship copy"></label>' +
    '<label class="field full">Suggestion<textarea class="input" name="note" required placeholder="Write the content suggestion or issue here."></textarea></label></div>' +
    '<div class="toolbar"><button class="button dark" type="submit">Save note</button></div></form>';
}

function notesTable(notes) {
  if (!notes.length) return '<p class="notice">No review notes yet.</p>';
  return '<div class="card table-wrap"><table><thead><tr><th>Page</th><th>Suggestion</th><th>Added</th><th></th></tr></thead><tbody>' +
    notes.map(function(note) {
      return '<tr><td><a href="' + escapeHtml(note.page_path) + '">' + escapeHtml(note.page_path) + '</a></td><td><strong>' + escapeHtml(note.title) + '</strong><p>' + escapeHtml(note.note) + '</p></td><td>' + escapeHtml(shortDate(note.created_at)) + '</td><td><form method="post" action="/admin/review/delete"><input type="hidden" name="id" value="' + escapeHtml(note.id) + '"><button class="button light" type="submit">Remove</button></form></td></tr>';
    }).join("") + '</tbody></table></div>';
}

async function reviewPage(request, env, user) {
  const db = assertDb(env);
  const url = new URL(request.url);
  const notes = await db.prepare("SELECT * FROM content_review_notes ORDER BY created_at DESC").all();
  const saved = url.searchParams.get("saved") ? '<p class="notice">Saved. Review notes stay inside the admin portal.</p>' : "";
  const body = '<p class="eyebrow">Content validation</p><h1 style="color:var(--red-dark);font-size:clamp(2.5rem,5vw,4.8rem)">Content Review</h1>' +
    '<p class="intro">Use this page for POC reviewers to record suggestions while they check the public site.</p>' + saved + reviewForm() + notesTable(notes.results || []);
  return html(adminShell("Content Review", "/admin/review", body, user.email));
}

async function saveReviewNote(request, env) {
  const db = assertDb(env);
  const form = await request.formData();
  const pagePath = String(form.get("pagePath") || "/").trim();
  const title = String(form.get("title") || "").trim();
  const note = String(form.get("note") || "").trim();
  if (!title || !note) return redirectTo("/admin/review");
  await db.prepare("INSERT INTO content_review_notes (id, page_path, title, note) VALUES (?, ?, ?, ?)")
    .bind(crypto.randomUUID(), pagePath, title, note).run();
  return redirectTo("/admin/review?saved=1");
}

async function deleteReviewNote(request, env) {
  const db = assertDb(env);
  const form = await request.formData();
  const id = String(form.get("id") || "").trim();
  if (id) await db.prepare("DELETE FROM content_review_notes WHERE id = ?").bind(id).run();
  return redirectTo("/admin/review?saved=1");
}

function notFound() {
  return new Response(ROUTES["/"], {
    status: 404,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname.endsWith("/") && url.pathname !== "/" ? url.pathname.slice(0, -1) : url.pathname;
    try {
      if (pathname === "/api/health") {
        return Response.json({ ok: true, service: "gssam-sites-poc", admin: true, db: Boolean(env.DB) });
      }
      if (pathname === "/login" && request.method === "GET") {
        const existing = await getSession(request, env);
        if (existing) return redirectTo("/admin");
        return html(loginPage("", url.searchParams.get("next") || "/admin"));
      }
      if (pathname === "/login" && request.method === "POST") return await handleLogin(request, env);
      if (pathname === "/logout" && request.method === "POST") return signOut();

      if (pathname.startsWith("/admin")) {
        const user = await requireAdmin(request, env);
        if (!user) return redirectTo("/login?next=" + encodeURIComponent(pathname), 307);
        if (pathname === "/admin" && request.method === "GET") return await adminHome(request, env, user);
        if (pathname === "/admin/members" && request.method === "GET") return await membersPage(request, env, user);
        if (pathname === "/admin/members" && request.method === "POST") return await saveMember(request, env);
        if (pathname === "/admin/members/delete" && request.method === "POST") return await deleteMember(request, env);
        if (pathname === "/admin/review" && request.method === "GET") return await reviewPage(request, env, user);
        if (pathname === "/admin/review" && request.method === "POST") return await saveReviewNote(request, env);
        if (pathname === "/admin/review/delete" && request.method === "POST") return await deleteReviewNote(request, env);
      }

      const route = ROUTES[pathname];
      if (!route) return notFound();
      return new Response(route, {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "public, max-age=300",
        },
      });
    } catch (error) {
      return html(page("Admin unavailable", '<main class="section"><h1 style="color:var(--red-dark)">Admin portal unavailable</h1><p class="intro">' + escapeHtml(error?.message || "Please try again.") + '</p><div class="toolbar"><a class="button light" href="/">Back to public site</a></div></main>', pathname), 500);
    }
  },
};
`;

await mkdir(distServer, { recursive: true });
await writeFile(join(dist, "package.json"), `${JSON.stringify({ type: "module" })}\n`);
await writeFile(join(distServer, "index.js"), worker);
console.log("Built dist/server/index.js for Sites POC hosting.");
