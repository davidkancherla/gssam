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
  email: "gssam2005@gmail.com",
  worship: "Sundays | 11:30 AM - 1:00 PM PT",
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
];

const ministries = [
  ["Men's Fellowship", "Bible study, prayer, mentoring, and service for the men of GSSAM."],
  ["Women's Fellowship", "Prayer, study, workshops, friendship, and care for families and neighbors."],
  ["Youth Fellowship", "Faith, friendship, music, leadership, and service for young people."],
  ["Sunday School", "Age-appropriate Bible teaching, songs, crafts, and worship participation."],
  ["Community Engagement", "Outreach, prayer, neighbor-care, and practical service across Fremont."],
];

const events = [
  ["Sunday School and Worship", "Every Sunday, 11:30 AM - 1:00 PM", site.address],
  ["Women's All-Night Prayer", "Monthly gathering", "Prayer and fellowship for the women of the congregation."],
  ["Community Care", "Seasonal outreach", "Food, clothing, books, and support for neighbors in need."],
];

const messages = [
  ["Sunday Worship Recordings", "Watch recent worship messages on the GSSAM Fremont YouTube channel."],
  ["Live Worship", "Join online when travel or health keeps you away from Sunday worship."],
  ["Multilingual Worship", "Traditional Lutheran hymns and liturgy in Telugu, Hindi, Tamil, and English."],
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
    .brand img { width: 56px; height: 56px; object-fit: contain; }
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
    .links a:hover { background: var(--cream); color: var(--red-dark); }
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
    .actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
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
    }
    .button.primary { background: var(--gold); color: #241805; }
    .button.secondary { border-color: rgba(255,255,255,0.5); color: white; background: rgba(255,255,255,0.08); }
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
      margin-top: 28px;
      background: #fffdf8;
      border-left: 5px solid var(--gold);
      padding: 20px;
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
    .portal-note {
      background: var(--green);
      color: white;
    }
    .portal-note .intro { color: rgba(255,255,255,0.86); }
    @media (max-width: 820px) {
      .topbar-inner, .nav-inner { align-items: flex-start; flex-direction: column; padding: 10px 0; }
      .nav-inner { gap: 12px; }
      .links { justify-content: flex-start; }
      .hero { min-height: 580px; }
      .split, .grid, .feature-row, .footer-inner { grid-template-columns: 1fr; }
      .section { padding: 52px 0; }
      .brand { min-width: 0; }
    }
  `;
}

function shell({ title, description, body, path = "/" }) {
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
        <p>Worshipping the Good Shepherd in Telugu, Hindi, Tamil, and English.</p>
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
  return shell({
    path: "/",
    title: "Welcome",
    description: "Good Shepherd South Asian Ministry is a Lutheran congregation in Fremont, California.",
    body: `
      <header class="hero">
        <div class="section">
          <p class="kicker">Good Shepherd South Asian Ministry</p>
          <h1>Worship in the languages of our hearts.</h1>
          <p class="lead">Join our South Asian Lutheran family in Fremont for Sunday School and worship with traditional hymns in Telugu, Hindi, Tamil, and English.</p>
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
          <p class="intro">GSSAM welcomes families across the East Bay and South Bay to gather each Sunday from 11:30 AM to 1:00 PM at 4211 Carol Ave in Fremont.</p>
          <div class="notice">This validation deployment publishes the public church website on managed hosting. The existing admin CMS and member portals remain in the repo and are ready for the next managed database and storage phase.</div>
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
  return shell({
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
  "/about": shell({
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
      <article class="card"><h3>Zelle</h3><p>${site.email}</p></article>
      <article class="card"><h3>PayPal</h3><p>${site.email}</p></article>
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
    <div class="actions"><a class="button primary" href="mailto:${site.email}">Email the Church</a><a class="button secondary" style="color: var(--red-dark); border-color: var(--line);" href="https://www.google.com/maps/search/?api=1&query=4211+Carol+Ave+Fremont+CA+94538">Open Map</a></div>`,
  ),
  "/privacy": simplePage(
    "/privacy",
    "Privacy",
    "GSSAM values your privacy and protects personal information shared through the website.",
    `<div class="notice">This validation deployment does not collect form submissions. The repo's full Next.js CMS/member portal includes private session handling and role-based access for the managed backend phase.</div>`,
  ),
  "/admin": simplePage(
    "/admin",
    "Admin Portal",
    "The admin CMS is included in the source repo and awaits managed database and storage provisioning before production use.",
    `<div class="notice">Next phase: connect managed Postgres or D1, object storage for uploads, production secrets, and role-based admin accounts.</div>`,
  ),
  "/member": simplePage(
    "/member",
    "Member Portal",
    "The member portal is included in the source repo and designed to share backend rules with the future mobile app.",
    `<div class="notice">Next phase: expose versioned API routes for mobile, keep authorization server-side, and remove demo financial data before launch.</div>`,
  ),
};

const worker = `const ROUTES = ${JSON.stringify(routes)};

function notFound() {
  return new Response(ROUTES["/"], {
    status: 404,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/api/health") {
      return Response.json({ ok: true, service: "gssam-sites-validation" });
    }
    const pathname = url.pathname.endsWith("/") && url.pathname !== "/" ? url.pathname.slice(0, -1) : url.pathname;
    const html = ROUTES[pathname];
    if (!html) return notFound();
    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=300",
      },
    });
  },
};
`;

await mkdir(distServer, { recursive: true });
await writeFile(join(dist, "package.json"), `${JSON.stringify({ type: "module" })}\n`);
await writeFile(join(distServer, "index.js"), worker);
console.log("Built dist/server/index.js for Sites validation hosting.");
