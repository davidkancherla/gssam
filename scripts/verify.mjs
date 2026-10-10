import { randomUUID } from "node:crypto";
import { mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { PrismaClient } from "@prisma/client";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SESSION_COOKIE = "gssam_session";
const EXAMPLE_SECRET = "change-this-to-a-long-random-string-before-production";
const DEV_FALLBACK_SECRET = "gssam-local-dev-secret-not-for-production";

function loadEnv() {
  try {
    const text = readFileSync(join(ROOT, ".env"), "utf8");
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq);
      let value = trimmed.slice(eq + 1);
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // .env is optional when the caller already exported vars
  }
}

loadEnv();

/** Must match secretKey() in src/lib/session.ts for a non-production server. */
function secretBytes() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret === EXAMPLE_SECRET) {
    return new TextEncoder().encode(secret || DEV_FALLBACK_SECRET);
  }
  return new TextEncoder().encode(secret);
}

async function signUser(user) {
  return new SignJWT({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("14d")
    .sign(secretBytes());
}

async function fetchRaw(path, cookie) {
  return fetch(`${BASE}${path}`, {
    redirect: "manual",
    headers: cookie ? { cookie: `${SESSION_COOKIE}=${cookie}` } : undefined,
  });
}

async function fetchText(path, cookie) {
  const res = await fetchRaw(path, cookie);
  const text = await res.text();
  return { status: res.status, location: res.headers.get("location"), text };
}

async function mustContain(path, snippets, cookie) {
  const { status, text } = await fetchText(path, cookie);
  if (status !== 200) {
    throw new Error(`${path} returned ${status}`);
  }
  for (const snippet of snippets) {
    if (!text.includes(snippet)) {
      throw new Error(`${path} is missing: ${snippet}`);
    }
  }
  return text;
}

function mustNotContain(path, text, snippets) {
  for (const snippet of snippets) {
    if (text.includes(snippet)) {
      throw new Error(`${path} leaked private data: ${snippet}`);
    }
  }
}

async function mustRedirect(path, dest, cookie) {
  const { status, location } = await fetchText(path, cookie);
  if (![301, 302, 303, 307, 308].includes(status) || !location?.includes(dest)) {
    throw new Error(`${path} should redirect to ${dest}, got ${status} ${location}`);
  }
}

function formatMoney(cents) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

/** Mirror of churchWideCardTotals in src/lib/finance.ts. */
function churchWideCardTotals(entries) {
  let income = 0;
  let expenses = 0;
  for (const entry of entries) {
    const householdIncomeOrExpense =
      (entry.kind === "INCOME" || entry.kind === "EXPENSE") &&
      (entry.scope === "MEMBER" || entry.memberId != null);
    if (householdIncomeOrExpense) continue;
    if (entry.memberId != null) continue;
    if (entry.scope !== "CHURCH") continue;
    if (entry.kind === "EXPENSE") expenses += entry.amountCents;
    else income += entry.amountCents;
  }
  return { income, expenses };
}

function churchWideAttr(html, name) {
  const match = html.match(
    new RegExp(`data-church-wide="${name}"[\\s\\S]*?>\\s*([^<]+)`),
  );
  if (!match) {
    throw new Error(`/admin/finance is missing data-church-wide="${name}"`);
  }
  return match[1].replace(/&amp;/g, "&").trim();
}

const TINY_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

async function logoutChecks() {
  const res = await fetchRaw("/api/logout");
  if (![301, 302, 303, 307, 308].includes(res.status) || !res.headers.get("location")?.includes("/")) {
    throw new Error(`/api/logout should redirect home, got ${res.status}`);
  }
  const setCookie = res.headers.get("set-cookie") || "";
  for (const part of [`${SESSION_COOKIE}=`, "Path=/", "Max-Age=0", "SameSite=Lax", "HttpOnly"]) {
    if (!setCookie.includes(part)) {
      throw new Error(`/api/logout must expire gssam_session with matching attributes; missing ${part} in "${setCookie}"`);
    }
  }
  const sessionTs = readFileSync(join(ROOT, "src/lib/session.ts"), "utf8");
  const authActions = readFileSync(join(ROOT, "src/app/actions/auth.ts"), "utf8");
  if (!sessionTs.includes('path: "/"') || !sessionTs.includes('sameSite: "lax"') || !sessionTs.includes("httpOnly: true")) {
    throw new Error("sessionCookieBase must keep path=/, sameSite=lax, httpOnly for set and clear.");
  }
  if (!authActions.includes("expireSessionCookie") || authActions.includes("jar.delete(SESSION_COOKIE)")) {
    throw new Error("logoutAction must expire gssam_session with matching attributes, not a bare delete.");
  }
}

async function portalChecks() {
  const db = new PrismaClient();
  try {
    const users = await db.user.findMany({ orderBy: { email: "asc" } });
    const admin = users.find((user) => user.email === "admin@gssam.demo");
    const member = users.find((user) => user.email === "member@gssam.demo");
    const member2 = users.find((user) => user.email === "member2@gssam.demo");
    if (!admin || !member || !member2) {
      throw new Error("Demo users are missing. Run npm run setup.");
    }
    if (admin.role !== "ADMIN" || member.role !== "MEMBER" || member2.role !== "MEMBER") {
      throw new Error("Demo user roles are wrong.");
    }
    if (!(await bcrypt.compare("GSSAM-Admin-2026", admin.passwordHash))) {
      throw new Error("Admin demo password does not match the seeded hash.");
    }
    if (!(await bcrypt.compare("GSSAM-Member-2026", member.passwordHash))) {
      throw new Error("Member demo password does not match the seeded hash.");
    }
    if (!(await bcrypt.compare("GSSAM-Member-2026", member2.passwordHash))) {
      throw new Error("Second member demo password does not match the seeded hash.");
    }

    const adminToken = await signUser(admin);
    const memberToken = await signUser(member);
    const member2Token = await signUser(member2);
    // A validly signed JWT whose role claim says ADMIN for a MEMBER row.
    const forgedAdmin = await signUser({ ...member, role: "ADMIN" });
    // A validly signed JWT for a user that does not exist in the database.
    const ghostAdmin = await signUser({
      id: "ghost-user-id",
      name: "Ghost",
      email: "ghost@example.com",
      role: "ADMIN",
    });

    await mustRedirect("/admin", "/member", memberToken);
    await mustRedirect("/admin/finance", "/member", memberToken);
    await mustRedirect("/admin/gallery", "/member", memberToken);
    await mustRedirect("/admin/members", "/member", memberToken);
    await mustRedirect("/admin", "/member", forgedAdmin);
    await mustRedirect("/admin/finance", "/member", forgedAdmin);
    await mustRedirect("/admin", "/login", ghostAdmin);
    await mustRedirect("/member", "/login", ghostAdmin);
    // A stale JWT must not bounce between /login and the portal layouts.
    await mustContain("/login", ["Sign in"], ghostAdmin);
    await mustRedirect("/login", "/admin", adminToken);
    await mustRedirect("/login", "/member", memberToken);

    const session = await fetchText("/api/session", forgedAdmin);
    if (!session.text.includes('"role":"MEMBER"')) {
      throw new Error(`/api/session should report the database role, got ${session.text}`);
    }

    await mustContain("/admin", ["Admin"], adminToken);
    await mustContain("/admin/pages", ["Edit public pages"], adminToken);
    await mustContain("/admin/events", ["Christmas"], adminToken);
    await mustContain("/admin/gallery", ["Gallery"], adminToken);
    await mustContain("/admin/members", ["Members"], adminToken);
    await mustContain("/admin/weekly", ['step="0.01"'], adminToken);

    const adminFinance = await mustContain(
      "/admin/finance",
      ["Church-wide finance", "Priya Sharma", "Arun Reddy", "household INCOME", 'step="0.01"'],
      adminToken,
    );
    mustNotContain("/admin/finance", adminFinance, ["passwordHash", "$2a$", "$2b$"]);
    const ledger = await db.financeEntry.findMany();
    const churchTotals = churchWideCardTotals(ledger);
    const mixedIncome = ledger
      .filter((entry) => entry.kind !== "EXPENSE")
      .reduce((sum, entry) => sum + entry.amountCents, 0);
    const mixedExpenses = ledger
      .filter((entry) => entry.kind === "EXPENSE")
      .reduce((sum, entry) => sum + entry.amountCents, 0);
    const shownIncome = churchWideAttr(adminFinance, "income");
    const shownExpenses = churchWideAttr(adminFinance, "expenses");
    if (shownIncome !== formatMoney(churchTotals.income)) {
      throw new Error(
        `/admin/finance income card is ${shownIncome}, expected church-wide ${formatMoney(churchTotals.income)} (mixed ledger would be ${formatMoney(mixedIncome)})`,
      );
    }
    if (shownExpenses !== formatMoney(churchTotals.expenses)) {
      throw new Error(
        `/admin/finance expense card is ${shownExpenses}, expected church-wide ${formatMoney(churchTotals.expenses)} (mixed ledger would be ${formatMoney(mixedExpenses)})`,
      );
    }

    const priyaRows = ledger.filter((entry) => entry.memberId === member.id);
    const arunRows = ledger.filter((entry) => entry.memberId === member2.id);
    const money = (rows) => [...new Set(rows.map((row) => formatMoney(row.amountCents)))];
    const priyaOnly = money(priyaRows).filter((amount) => !money(arunRows).includes(amount));
    const arunOnly = money(arunRows).filter((amount) => !money(priyaRows).includes(amount));

    const memberFinance = await mustContain("/member/finance", ["Demo sample data", 'step="0.01"', ...priyaOnly], memberToken);
    mustNotContain("/member/finance", memberFinance, ["Arun Reddy", ...arunOnly, "Utilities"]);

    const member2Finance = await mustContain("/member/finance", arunOnly, member2Token);
    mustNotContain("/member/finance (member2)", member2Finance, ["Priya Sharma", ...priyaOnly, "Utilities"]);

    const memberIncome = await mustContain("/member/income", ['step="0.01"', "Save income"], memberToken);
    mustNotContain("/member/income", memberIncome, ["Arun Reddy", ...arunOnly]);

    const memberWeekly = await mustContain("/member/weekly", ["Congregation offering total"], memberToken);
    mustNotContain("/member/weekly", memberWeekly, ["Arun Reddy", ...arunOnly]);

    const otherHouseholds = [...priyaOnly, ...arunOnly, "Priya Sharma", "Arun Reddy"];
    const adminWeekly = await mustContain("/member/weekly", ["Weekly"], adminToken);
    mustNotContain("/member/weekly as admin", adminWeekly, otherHouseholds);
    const adminAsMember = await mustContain("/member/finance", ["Finance"], adminToken);
    mustNotContain("/member/finance as admin", adminAsMember, otherHouseholds);

    await mustContain("/privacy", ["unnamed congregation offering total", "Other households"]);

    const filename = `${randomUUID()}.png`;
    const uploadPath = join(ROOT, "public", "uploads", filename);
    mkdirSync(dirname(uploadPath), { recursive: true });
    writeFileSync(uploadPath, TINY_PNG);
    try {
      const uploaded = await fetchRaw(`/uploads/${filename}`);
      if (uploaded.status !== 200 || !uploaded.headers.get("content-type")?.includes("image/png")) {
        throw new Error(`Uploaded photo URL /uploads/${filename} returned ${uploaded.status}`);
      }
    } finally {
      unlinkSync(uploadPath);
    }
    const traversal = await fetchText("/uploads/..%2F..%2Fpackage.json");
    if (traversal.status === 200) {
      throw new Error("/uploads must not serve files outside public/uploads");
    }
  } finally {
    await db.$disconnect();
  }
}

async function main() {
  await mustContain("/", [
    "Good Shepherd",
    "Telugu",
    "11:30",
    "1:30",
    "Fremont",
    "One Shepherd",
    "Many Languages",
    "One Family",
    "Welcome Home",
    "Watch Sunday Worship Live",
    "Plan Your Visit",
    "real-bishop-visit.jpg",
    "Pastor Anand Darla's ordination",
  ]);
  await mustContain("/about", ["Triune God", "Lutheran"]);
  await mustContain("/contact", ["4211 Carol Ave", "gssamfremont@gmail.com"]);
  await mustContain("/donate", ["Zelle", "PayPal"]);
  await mustContain("/gallery", ["Gallery"]);
  await mustContain("/messages", [
    "GSSAM",
    "xkEJUf0WZhc",
    "July 26TH",
    "July 19th",
    "NRFAQ8_ncEE",
  ]);
  const messages = await fetchText("/messages");
  if (messages.text.includes("--YvdIrX6Sc") || messages.text.includes("February 11, 2024 — GSSAM worship")) {
    throw new Error("/messages still has the duplicate February 11 sermon");
  }
  if (!messages.text.includes("NRFAQ8_ncEE")) {
    throw new Error("/messages is missing the Feb 11 YouTube message");
  }

  const session = await fetchText("/api/session");
  if (session.status !== 200 || !session.text.includes('"user":null')) {
    throw new Error(`/api/session should return a logged-out user, got ${session.status} ${session.text}`);
  }

  await logoutChecks();
  await mustContain("/events", ["Christmas"]);
  await mustContain("/ministries/mens-fellowship", ["Men"]);
  await mustContain("/privacy", ["Member financial records"]);

  const login = await fetchText("/login");
  if (login.status !== 200) throw new Error(`/login returned ${login.status}`);
  if (!login.text.includes("Sign in")) throw new Error("/login is missing Sign in");
  if (login.text.includes("GSSAM-Admin-2026") || login.text.includes("GSSAM-Member-2026")) {
    throw new Error("/login must not print demo passwords");
  }

  await mustRedirect("/about-us", "/about");
  await mustRedirect("/contact-us", "/contact");
  await mustRedirect("/donation", "/donate");
  await mustRedirect("/give", "/donate");
  await mustRedirect("/sermons", "/messages");
  await mustRedirect("/privacy-policy", "/privacy");

  const admin = await fetchText("/admin");
  if (admin.status !== 307 && admin.status !== 308 && admin.status !== 302) {
    throw new Error(`/admin should redirect when logged out, got ${admin.status}`);
  }
  if (!admin.location?.includes("/login")) {
    throw new Error(`/admin redirect was ${admin.location}`);
  }

  const member = await fetchText("/member");
  if (!member.location?.includes("/login")) {
    throw new Error(`/member should redirect to login when logged out`);
  }

  await portalChecks();

  console.log(
    "Public pages, GSSAM copy, role gates (incl. forged/ghost JWTs), finance privacy, logout cookie, and photo URLs look good.",
  );
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
