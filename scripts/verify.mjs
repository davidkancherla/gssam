import { randomUUID } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
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
    for (const line of text.split("\n")) {
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

async function fetchText(path, cookie) {
  const res = await fetch(`${BASE}${path}`, {
    redirect: "manual",
    headers: cookie ? { cookie: `${SESSION_COOKIE}=${cookie}` } : undefined,
  });
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
}

function mustNotContain(path, text, snippets) {
  for (const snippet of snippets) {
    if (text.includes(snippet)) {
      throw new Error(`${path} leaked private data: ${snippet}`);
    }
  }
}

function assertRedirect(result, path, needle) {
  if (result.status !== 307 && result.status !== 308 && result.status !== 302) {
    throw new Error(`${path} should redirect, got ${result.status}`);
  }
  if (!result.location?.includes(needle)) {
    throw new Error(`${path} redirect was ${result.location}, expected ${needle}`);
  }
}

function formatMoney(cents) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

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

async function main() {
  await mustContain("/", [
    "Good Shepherd",
    "South Asian",
    "Telugu",
    "11:30",
    "Fremont",
  ]);
  await mustContain("/about", ["Triune God", "Lutheran"]);
  await mustContain("/contact", ["4211 Carol Ave", "gssam2005@gmail.com"]);
  await mustContain("/donate", ["PayPal", "Zelle"]);
  await mustContain("/gallery", ["Gallery"]);
  await mustContain("/messages", ["GSSAM"]);
  await mustContain("/events", ["Christmas"]);
  await mustContain("/ministries/mens-fellowship", ["Men"]);
  await mustContain("/login", [
    "admin@gssam.demo",
    "member@gssam.demo",
    "GSSAM-Admin-2026",
    "GSSAM-Member-2026",
  ]);
  await mustContain("/privacy", [
    "Member financial records",
    "unnamed congregation offering total",
    "Other households",
  ]);

  assertRedirect(await fetchText("/admin"), "/admin", "/login");
  assertRedirect(await fetchText("/member"), "/member", "/login");
  assertRedirect(await fetchText("/admin/finance"), "/admin/finance", "/login");
  assertRedirect(await fetchText("/member/income"), "/member/income", "/login");

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
    const forgedAdmin = await signUser({ ...member, role: "ADMIN" });

    assertRedirect(await fetchText("/admin", memberToken), "/admin as member", "/member");
    assertRedirect(
      await fetchText("/admin/finance", memberToken),
      "/admin/finance as member",
      "/member",
    );
    assertRedirect(
      await fetchText("/admin/gallery", memberToken),
      "/admin/gallery as member",
      "/member",
    );
    assertRedirect(
      await fetchText("/admin", forgedAdmin),
      "/admin with forged ADMIN jwt",
      "/member",
    );

    await mustContain("/admin", ["Keep GSSAM", "Photos"], adminToken);
    await mustContain("/admin/pages", ["Edit public pages", "About GSSAM"], adminToken);
    await mustContain("/admin/events", ["Events", "Christmas Worship"], adminToken);
    await mustContain("/admin/messages", ["Messages", "YouTube"], adminToken);
    await mustContain("/admin/gallery", ["Upload photo", "Gallery photos"], adminToken);
    await mustContain(
      "/admin/finance",
      [
        "Church-wide finance",
        "Church-wide income",
        "Priya Sharma",
        "Arun Reddy",
        "Demo sample data",
        "church-wide",
        "household INCOME",
      ],
      adminToken,
    );
    const ledger = await db.financeEntry.findMany();
    const churchTotals = churchWideCardTotals(ledger);
    const mixedIncome = ledger
      .filter((entry) => entry.kind !== "EXPENSE")
      .reduce((sum, entry) => sum + entry.amountCents, 0);
    const mixedExpenses = ledger
      .filter((entry) => entry.kind === "EXPENSE")
      .reduce((sum, entry) => sum + entry.amountCents, 0);
    const adminFinance = await fetchText("/admin/finance", adminToken);
    const shownIncome = churchWideAttr(adminFinance.text, "income");
    const shownExpenses = churchWideAttr(adminFinance.text, "expenses");
    if (shownIncome !== formatMoney(churchTotals.income)) {
      throw new Error(
        `/admin/finance income card is ${shownIncome}, expected ${formatMoney(churchTotals.income)}`,
      );
    }
    if (shownExpenses !== formatMoney(churchTotals.expenses)) {
      throw new Error(
        `/admin/finance expense card is ${shownExpenses}, expected ${formatMoney(churchTotals.expenses)}`,
      );
    }
    const householdIncome = ledger
      .filter(
        (entry) =>
          entry.kind === "INCOME" &&
          (entry.scope === "MEMBER" || entry.memberId != null),
      )
      .reduce((sum, entry) => sum + entry.amountCents, 0);
    const householdExpenses = ledger
      .filter(
        (entry) =>
          entry.kind === "EXPENSE" &&
          (entry.scope === "MEMBER" || entry.memberId != null),
      )
      .reduce((sum, entry) => sum + entry.amountCents, 0);
    if (householdIncome > 0 && mixedIncome === churchTotals.income) {
      throw new Error("Church-wide income still includes household INCOME rows.");
    }
    if (householdExpenses > 0 && mixedExpenses === churchTotals.expenses) {
      throw new Error("Church-wide expenses still include personal EXPENSE rows.");
    }
    const mixedForbidden = [
      "$5,545.00",
      "$5,557.34",
      "$5,668.00",
      "$630.00",
    ];
    if (mixedIncome !== churchTotals.income) mixedForbidden.push(formatMoney(mixedIncome));
    if (mixedExpenses !== churchTotals.expenses) mixedForbidden.push(formatMoney(mixedExpenses));
    mustNotContain(
      "/admin/finance totals",
      adminFinance.text,
      [...new Set(mixedForbidden)].filter(
        (amount) =>
          amount !== formatMoney(churchTotals.income) &&
          amount !== formatMoney(churchTotals.expenses) &&
          amount !== formatMoney(churchTotals.income - churchTotals.expenses),
      ),
    );

    await mustContain("/admin/pages", ["Edit public pages", "Save"], adminToken);

    const memberFinance = await fetchText("/member/finance", memberToken);
    if (memberFinance.status !== 200) {
      throw new Error(`/member/finance returned ${memberFinance.status}`);
    }
    if (!memberFinance.text.includes("Demo sample data")) {
      throw new Error("Member finance is missing the demo data banner.");
    }
    if (!memberFinance.text.includes("$1,200.00") || !memberFinance.text.includes("$150.00")) {
      throw new Error("Member finance is missing Priya Sharma's demo rows.");
    }
    mustNotContain("/member/finance", memberFinance.text, [
      "Arun Reddy",
      "$1,850.00",
      "$200.00",
      "Utilities",
    ]);

    const member2Finance = await fetchText("/member/finance", member2Token);
    if (member2Finance.status !== 200) {
      throw new Error(`/member/finance (member2) returned ${member2Finance.status}`);
    }
    if (!member2Finance.text.includes("$1,850.00") || !member2Finance.text.includes("$200.00")) {
      throw new Error("Second member finance is missing Arun Reddy's demo rows.");
    }
    mustNotContain("/member/finance (member2)", member2Finance.text, [
      "Priya Sharma",
      "$1,200.00",
      "$150.00",
      "Utilities",
    ]);

    const memberIncome = await fetchText("/member/income", memberToken);
    if (memberIncome.status !== 200) {
      throw new Error(`/member/income returned ${memberIncome.status}`);
    }
    mustNotContain("/member/income", memberIncome.text, ["Arun Reddy", "$1,850.00"]);
    if (!memberIncome.text.includes('step="0.01"') || !memberIncome.text.includes("Save income")) {
      throw new Error("Income form should accept cents and save on this page.");
    }
    if (!memberFinance.text.includes('step="0.01"')) {
      throw new Error("Finance amount input should accept cents (step=0.01).");
    }

    const memberWeekly = await fetchText("/member/weekly", memberToken);
    if (memberWeekly.status !== 200) {
      throw new Error(`/member/weekly returned ${memberWeekly.status}`);
    }
    if (!memberWeekly.text.includes("Congregation offering total")) {
      throw new Error("Weekly bulletin should still show unnamed congregation offering totals.");
    }
    mustNotContain("/member/weekly", memberWeekly.text, ["Arun Reddy"]);

    const adminWeekly = await fetchText("/member/weekly", adminToken);
    if (adminWeekly.status !== 200) {
      throw new Error(`/member/weekly as admin returned ${adminWeekly.status}`);
    }
    mustNotContain("/member/weekly as admin", adminWeekly.text, [
      "Priya Sharma",
      "Arun Reddy",
      "$150.00",
      "$200.00",
      "$1,200.00",
      "$1,850.00",
    ]);

    const adminAsMemberFinance = await fetchText("/member/finance", adminToken);
    if (adminAsMemberFinance.status !== 200) {
      throw new Error(`/member/finance as admin returned ${adminAsMemberFinance.status}`);
    }
    mustNotContain("/member/finance as admin", adminAsMemberFinance.text, [
      "Priya Sharma",
      "Arun Reddy",
      "$1,200.00",
      "$1,850.00",
    ]);

    const filename = `${randomUUID()}.png`;
    mkdirSync(join(ROOT, "public", "uploads"), { recursive: true });
    writeFileSync(join(ROOT, "public", "uploads", filename), TINY_PNG);
    const uploaded = await fetchText(`/uploads/${filename}`);
    if (uploaded.status !== 200) {
      throw new Error(`Uploaded photo URL /uploads/${filename} returned ${uploaded.status}`);
    }
    if (!uploaded.text.includes("PNG") && uploaded.text.length < 10) {
      throw new Error("Uploaded photo URL did not return image bytes.");
    }
  } finally {
    await db.$disconnect();
  }

  console.log("Public pages, demo logins, role gates, finance privacy, and photo URLs look good.");
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
