import { PrismaClient } from "@prisma/client";
import { readFileSync, existsSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { signSession, SESSION_COOKIE } from "../src/lib/session";
import type { Role } from "../src/lib/session";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const db = new PrismaClient();

const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

function cookieHeader(token: string) {
  return `${SESSION_COOKIE}=${token}`;
}

async function json(path: string, init: RequestInit = {}) {
  const res = await fetch(`${BASE}${path}`, init);
  const text = await res.text();
  let body: unknown = text;
  try {
    body = JSON.parse(text);
  } catch {
    /* keep text */
  }
  return { res, body, text };
}

async function main() {
  const admin = await db.user.findUnique({ where: { email: "admin@gssam.demo" } });
  const member = await db.user.findUnique({ where: { email: "member@gssam.demo" } });
  if (!admin || !member) throw new Error("Seed users are missing");

  const adminToken = await signSession({
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role as Role,
  });
  const memberToken = await signSession({
    id: member.id,
    name: member.name,
    email: member.email,
    role: member.role as Role,
  });

  const original = await db.page.findUnique({ where: { slug: "about" } });
  if (!original) throw new Error("About page is missing");
  const originalContact = await db.page.findUnique({ where: { slug: "contact" } });
  if (!originalContact) throw new Error("Contact page is missing");

  const editor = await fetch(`${BASE}/admin/pages?slug=contact`, {
    headers: { cookie: cookieHeader(adminToken) },
    redirect: "manual",
  });
  const editorHtml = await editor.text();
  if (
    !editorHtml.includes('action="/api/admin/pages"') ||
    !editorHtml.includes('method="post"') ||
    !editorHtml.includes('name="slug"') ||
    !editorHtml.includes('value="contact"')
  ) {
    throw new Error("Contact editor is missing a native POST form that saves without JS");
  }

  const browserSave = await fetch(`${BASE}/api/admin/pages`, {
    method: "POST",
    redirect: "manual",
    headers: {
      cookie: cookieHeader(adminToken),
      accept: "text/html,application/xhtml+xml",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
    },
    body: (() => {
      const data = new FormData();
      data.set("slug", "contact");
      data.set("title", "Contact Us");
      data.set("excerpt", "Browser form persist check");
      data.set("body", "Office hours stay the same.");
      return data;
    })(),
  });
  const browserLocation = browserSave.headers.get("location") || "";
  if (![303, 302, 307, 308].includes(browserSave.status) || !browserLocation.includes("slug=contact")) {
    throw new Error(
      `Browser form save must 303 to the same slug, got ${browserSave.status} ${browserLocation}`,
    );
  }
  const contactRow = await db.page.findUnique({ where: { slug: "contact" } });
  if (contactRow?.excerpt !== "Browser form persist check") {
    throw new Error("Native POST did not persist the Contact excerpt");
  }
  await db.page.update({
    where: { slug: "contact" },
    data: {
      title: originalContact.title,
      excerpt: originalContact.excerpt,
      body: originalContact.body,
    },
  });

  const originalHome = await db.page.findUnique({ where: { slug: "home" } });
  if (!originalHome) throw new Error("Home page is missing");
  const originalHero = await db.galleryImage.findFirst({ where: { placement: "hero" } });
  const homeFileSave = await fetch(`${BASE}/api/admin/pages`, {
    method: "POST",
    redirect: "manual",
    headers: {
      cookie: cookieHeader(adminToken),
      accept: "text/html,application/xhtml+xml",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
    },
    body: (() => {
      const data = new FormData();
      data.set("slug", "home");
      data.set("title", originalHome.title);
      data.set("excerpt", originalHome.excerpt);
      data.set("body", originalHome.body);
      data.set("galleryUrl", "");
      data.set("file", new File([PNG], "qa-home-hero.png", { type: "image/png" }));
      return data;
    })(),
  });
  const homeLocation = homeFileSave.headers.get("location") || "";
  if (![303, 302, 307, 308].includes(homeFileSave.status) || !homeLocation.includes("slug=home")) {
    throw new Error(`Home file save must 303 to slug=home, got ${homeFileSave.status} ${homeLocation}`);
  }
  const homeRow = await db.page.findUnique({ where: { slug: "home" } });
  if (!homeRow?.imageUrl.startsWith("/uploads/")) {
    throw new Error(`Home file upload did not persist an /uploads hero, got ${homeRow?.imageUrl}`);
  }
  const homeFilePath = join(process.cwd(), "public", homeRow.imageUrl);
  if (!existsSync(homeFilePath) || readFileSync(homeFilePath).length < 10) {
    throw new Error(`Home hero was not written to ${homeFilePath}`);
  }
  const publicHome = await (await fetch(`${BASE}/`)).text();
  if (!publicHome.includes(homeRow.imageUrl)) {
    throw new Error("Public homepage hero did not use the uploaded photo");
  }
  const blobSave = await json("/api/admin/pages", {
    method: "POST",
    headers: { cookie: cookieHeader(adminToken) },
    body: (() => {
      const data = new FormData();
      data.set("slug", "home");
      data.set("title", originalHome.title);
      data.set("excerpt", originalHome.excerpt);
      data.set("body", originalHome.body);
      data.set("file", new Blob([PNG], { type: "image/png" }));
      return data;
    })(),
  });
  if ((blobSave.body as { ok?: boolean })?.ok !== true) {
    throw new Error(`Home Blob upload failed: ${blobSave.text}`);
  }
  const homeAfterBlob = await db.page.findUnique({ where: { slug: "home" } });
  if (!homeAfterBlob?.imageUrl.startsWith("/uploads/")) {
    throw new Error("Home Blob upload did not write an /uploads hero");
  }
  const blobPath = join(process.cwd(), "public", homeAfterBlob.imageUrl);
  if (existsSync(homeFilePath) && homeFilePath !== blobPath) unlinkSync(homeFilePath);
  await db.page.update({
    where: { slug: "home" },
    data: { imageUrl: originalHome.imageUrl },
  });
  if (originalHero) {
    await db.galleryImage.update({
      where: { id: originalHero.id },
      data: { url: originalHero.url },
    });
  }
  if (existsSync(blobPath)) unlinkSync(blobPath);

  const homeEditor = await fetch(`${BASE}/admin/pages?slug=home`, {
    headers: { cookie: cookieHeader(adminToken) },
    redirect: "manual",
  });
  const homeEditorHtml = await homeEditor.text();
  if (
    !homeEditorHtml.includes('action="/api/admin/pages"') ||
    !homeEditorHtml.includes('name="welcomeLeftFile"') ||
    !homeEditorHtml.includes('name="welcomeRightFile"') ||
    !homeEditorHtml.includes('name="welcomeLeftGalleryUrl"') ||
    !homeEditorHtml.includes("Welcome Home left photo")
  ) {
    throw new Error("Home editor is missing native POST fields for the Welcome Home photo pair");
  }

  const originalWelcomeLeft = await db.galleryImage.findFirst({ where: { placement: "welcome-left" } });
  const originalWelcomeRight = await db.galleryImage.findFirst({
    where: { placement: "welcome-right" },
  });
  const welcomeSave = await fetch(`${BASE}/api/admin/pages`, {
    method: "POST",
    redirect: "manual",
    headers: {
      cookie: cookieHeader(adminToken),
      accept: "text/html,application/xhtml+xml",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
    },
    body: (() => {
      const data = new FormData();
      data.set("slug", "home");
      data.set("title", originalHome.title);
      data.set("excerpt", originalHome.excerpt);
      data.set("body", originalHome.body);
      data.set("welcomeLeftFile", new File([PNG], "qa-welcome-left.png", { type: "image/png" }));
      data.set("welcomeRightFile", new File([PNG], "qa-welcome-right.png", { type: "image/png" }));
      return data;
    })(),
  });
  const welcomeLocation = welcomeSave.headers.get("location") || "";
  if (![303, 302, 307, 308].includes(welcomeSave.status) || !welcomeLocation.includes("slug=home")) {
    throw new Error(
      `Welcome Home photo save must 303 to slug=home, got ${welcomeSave.status} ${welcomeLocation}`,
    );
  }
  const homeAfterWelcome = await db.page.findUnique({ where: { slug: "home" } });
  if (homeAfterWelcome?.imageUrl !== originalHome.imageUrl) {
    throw new Error("Welcome Home photo save must not replace the homepage hero");
  }
  const welcomeLeftRow = await db.galleryImage.findFirst({ where: { placement: "welcome-left" } });
  const welcomeRightRow = await db.galleryImage.findFirst({ where: { placement: "welcome-right" } });
  if (!welcomeLeftRow?.url.startsWith("/uploads/") || !welcomeRightRow?.url.startsWith("/uploads/")) {
    throw new Error("Welcome Home file upload did not persist /uploads photos");
  }
  const welcomeLeftPath = join(process.cwd(), "public", welcomeLeftRow.url);
  const welcomeRightPath = join(process.cwd(), "public", welcomeRightRow.url);
  if (!existsSync(welcomeLeftPath) || !existsSync(welcomeRightPath)) {
    throw new Error("Welcome Home photos were not written to /uploads");
  }
  const publicWelcome = await (await fetch(`${BASE}/`)).text();
  if (!publicWelcome.includes(welcomeLeftRow.url) || !publicWelcome.includes(welcomeRightRow.url)) {
    throw new Error("Public homepage Welcome Home did not use the uploaded photos");
  }
  if (!publicWelcome.includes("Welcome Home") || !publicWelcome.includes("Many Languages")) {
    throw new Error("Welcome Home photo save dropped the Vite homepage copy");
  }

  const galleryPick = await db.galleryImage.findFirst({
    where: { placement: "gallery", url: { startsWith: "/images/" } },
  });
  if (!galleryPick) throw new Error("No gallery photo available to pick for Welcome Home");
  const welcomePickSave = await json("/api/admin/pages", {
    method: "POST",
    headers: { cookie: cookieHeader(adminToken) },
    body: (() => {
      const data = new FormData();
      data.set("slug", "home");
      data.set("title", originalHome.title);
      data.set("excerpt", originalHome.excerpt);
      data.set("body", originalHome.body);
      data.set("welcomeLeftGalleryUrl", galleryPick.url);
      return data;
    })(),
  });
  if ((welcomePickSave.body as { ok?: boolean })?.ok !== true) {
    throw new Error(`Welcome Home gallery pick failed: ${welcomePickSave.text}`);
  }
  const leftAfterPick = await db.galleryImage.findFirst({ where: { placement: "welcome-left" } });
  if (leftAfterPick?.url !== galleryPick.url) {
    throw new Error("Welcome Home gallery pick did not update the left photo");
  }
  const publicAfterPick = await (await fetch(`${BASE}/`)).text();
  if (!publicAfterPick.includes(galleryPick.url)) {
    throw new Error("Public homepage did not show the gallery-picked Welcome Home photo");
  }

  const restoreWelcome = async (
    original: { id: string; url: string } | null,
    placement: "welcome-left" | "welcome-right",
    uploadedUrl?: string,
  ) => {
    if (original) {
      await db.galleryImage.update({ where: { id: original.id }, data: { url: original.url } });
    } else {
      await db.galleryImage.deleteMany({ where: { placement } });
    }
    if (uploadedUrl && uploadedUrl.startsWith("/uploads/")) {
      const leftover = join(process.cwd(), "public", uploadedUrl);
      if (existsSync(leftover)) unlinkSync(leftover);
    }
  };
  await restoreWelcome(originalWelcomeLeft, "welcome-left", welcomeLeftRow.url);
  await restoreWelcome(originalWelcomeRight, "welcome-right", welcomeRightRow.url);

  const marker = `QA save ${Date.now()}`;

  const save = await json("/api/admin/pages", {
    method: "POST",
    headers: { cookie: cookieHeader(adminToken) },
    body: (() => {
      const data = new FormData();
      data.set("slug", "about");
      data.set("title", original.title);
      data.set("excerpt", original.excerpt);
      data.set("body", `${original.body}\n\n${marker}`);
      return data;
    })(),
  });
  if ((save.body as { ok?: boolean })?.ok !== true) {
    throw new Error(`About save failed: ${save.res.status} ${save.text}`);
  }

  const about = await fetch(`${BASE}/about`);
  const aboutHtml = await about.text();
  if (!aboutHtml.includes(marker)) {
    throw new Error("Public /about did not show the saved page body");
  }

  await json("/api/admin/pages", {
    method: "POST",
    headers: { cookie: cookieHeader(adminToken) },
    body: (() => {
      const data = new FormData();
      data.set("slug", "about");
      data.set("title", original.title);
      data.set("excerpt", original.excerpt);
      data.set("body", original.body);
      return data;
    })(),
  });

  const contact = await db.page.findUnique({ where: { slug: "contact" } });
  if (!contact) throw new Error("Contact page is missing");
  const contactSave = await json("/api/admin/pages", {
    method: "POST",
    headers: { cookie: cookieHeader(adminToken) },
    body: (() => {
      const data = new FormData();
      data.set("slug", "contact");
      data.set("title", contact.title);
      data.set("excerpt", contact.excerpt);
      data.set("body", contact.body);
      return data;
    })(),
  });
  if ((contactSave.body as { slug?: string }).slug !== "contact") {
    throw new Error(`Contact save dropped the slug: ${contactSave.text}`);
  }
  const aboutAfterContact = await db.page.findUnique({ where: { slug: "about" } });
  if (aboutAfterContact?.body !== original.body) {
    throw new Error("Saving Contact overwrote the About page");
  }

  const aboutPhoto = new FormData();
  aboutPhoto.set("slug", "about");
  aboutPhoto.set("title", original.title);
  aboutPhoto.set("excerpt", original.excerpt);
  aboutPhoto.set("body", original.body);
  aboutPhoto.set("file", new File([PNG], "qa-about.png", { type: "image/png" }));
  const photoSave = await json("/api/admin/pages", {
    method: "POST",
    headers: { cookie: cookieHeader(adminToken) },
    body: aboutPhoto,
  });
  if ((photoSave.body as { ok?: boolean })?.ok !== true) {
    throw new Error(`About photo save failed: ${photoSave.text}`);
  }
  const aboutWithPhoto = await db.page.findUnique({ where: { slug: "about" } });
  if (!aboutWithPhoto?.imageUrl.startsWith("/uploads/")) {
    throw new Error("About photo was not stored on the page");
  }
  const aboutAfterPhoto = await (await fetch(`${BASE}/about`)).text();
  if (
    !aboutAfterPhoto.includes(aboutWithPhoto.imageUrl) ||
    !aboutAfterPhoto.includes(original.excerpt.slice(0, 40))
  ) {
    throw new Error("Public /about did not show the saved About excerpt and photo");
  }
  await json("/api/admin/pages", {
    method: "POST",
    headers: { cookie: cookieHeader(adminToken) },
    body: (() => {
      const data = new FormData();
      data.set("slug", "about");
      data.set("title", original.title);
      data.set("excerpt", original.excerpt);
      data.set("body", original.body);
      data.set("galleryUrl", "/images/about.jpg");
      return data;
    })(),
  });
  const leftover = join(process.cwd(), "public", aboutWithPhoto.imageUrl);
  if (existsSync(leftover)) unlinkSync(leftover);

  const uploadData = new FormData();
  uploadData.set("file", new File([PNG], "qa-upload.png", { type: "image/png" }));
  uploadData.set("title", "QA upload photo");
  uploadData.set("album", "Congregation");
  uploadData.set("placement", "gallery");
  const upload = await json("/api/admin/gallery", {
    method: "POST",
    headers: { cookie: cookieHeader(adminToken) },
    body: uploadData,
  });
  const uploaded = upload.body as { ok?: boolean; url?: string; error?: string };
  if (!uploaded.ok || !uploaded.url) {
    throw new Error(`Gallery upload failed: ${upload.res.status} ${upload.text}`);
  }
  const filePath = join(process.cwd(), "public", uploaded.url);
  if (!existsSync(filePath) || readFileSync(filePath).length < 10) {
    throw new Error(`Upload did not write ${filePath}`);
  }
  const gallery = await (await fetch(`${BASE}/gallery`)).text();
  if (!gallery.includes(uploaded.url) || !gallery.includes("QA upload photo")) {
    throw new Error("Public /gallery did not show the uploaded photo");
  }
  await db.galleryImage.deleteMany({ where: { url: uploaded.url } });
  unlinkSync(filePath);

  const ministry = await db.ministry.findFirst({ orderBy: { sortOrder: "asc" } });
  if (!ministry) throw new Error("No ministry to update");
  const ministryData = new FormData();
  ministryData.set("id", ministry.id);
  ministryData.set("name", ministry.name);
  ministryData.set("slug", ministry.slug);
  ministryData.set("summary", ministry.summary);
  ministryData.set("body", ministry.body);
  ministryData.set("sortOrder", String(ministry.sortOrder));
  ministryData.set("file", new File([PNG], "qa-ministry.png", { type: "image/png" }));
  const ministrySave = await json("/api/admin/ministries", {
    method: "POST",
    headers: { cookie: cookieHeader(adminToken) },
    body: ministryData,
  });
  if ((ministrySave.body as { ok?: boolean; id?: string }).id !== ministry.id) {
    throw new Error(`Ministry save failed: ${ministrySave.text}`);
  }
  const updatedMinistry = await db.ministry.findUnique({ where: { id: ministry.id } });
  if (!updatedMinistry?.imageUrl.startsWith("/uploads/")) {
    throw new Error("Ministry photo was not stored");
  }
  const ministryFile = join(process.cwd(), "public", updatedMinistry.imageUrl);
  if (existsSync(ministryFile)) unlinkSync(ministryFile);
  await db.ministry.update({
    where: { id: ministry.id },
    data: { imageUrl: ministry.imageUrl },
  });

  const stillAdmin = await fetch(`${BASE}/admin/pages?slug=about`, {
    headers: { cookie: cookieHeader(adminToken) },
    redirect: "manual",
  });
  if (stillAdmin.status !== 200) {
    throw new Error(`About save dropped the admin session, got ${stillAdmin.status}`);
  }

  function formatMoney(cents: number) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
      cents / 100,
    );
  }
  function churchWideCardTotals(
    entries: { kind: string; scope: string; memberId: string | null; amountCents: number }[],
  ) {
    let income = 0;
    let expenses = 0;
    for (const entry of entries) {
      const privateHousehold =
        (entry.kind === "INCOME" || entry.kind === "EXPENSE") &&
        (entry.scope === "MEMBER" || entry.memberId != null);
      if (privateHousehold || entry.memberId != null || entry.scope !== "CHURCH") continue;
      if (entry.kind === "EXPENSE") expenses += entry.amountCents;
      else income += entry.amountCents;
    }
    return { income, expenses };
  }
  function churchWideAttr(html: string, name: string) {
    const match = html.match(new RegExp(`data-church-wide="${name}"[\\s\\S]*?>\\s*([^<]+)`));
    if (!match) throw new Error(`/admin/finance is missing data-church-wide="${name}"`);
    return match[1].replace(/&amp;/g, "&").trim();
  }

  const member2 = await db.user.findUnique({ where: { email: "member2@gssam.demo" } });
  if (!member2) throw new Error("Second demo member is missing");
  const member2Token = await signSession({
    id: member2.id,
    name: member2.name,
    email: member2.email,
    role: member2.role as Role,
  });

  const adminFinance = await fetch(`${BASE}/admin/finance`, {
    headers: { cookie: cookieHeader(adminToken) },
    redirect: "manual",
  });
  const adminFinanceHtml = await adminFinance.text();
  if (adminFinance.status !== 200) {
    throw new Error(`/admin/finance returned ${adminFinance.status}`);
  }
  const ledger = await db.financeEntry.findMany();
  const churchTotals = churchWideCardTotals(ledger);
  const mixedIncome = ledger
    .filter((entry) => entry.kind !== "EXPENSE")
    .reduce((sum, entry) => sum + entry.amountCents, 0);
  if (churchWideAttr(adminFinanceHtml, "income") !== formatMoney(churchTotals.income)) {
    throw new Error(
      `/admin/finance income card is ${churchWideAttr(adminFinanceHtml, "income")}, expected ${formatMoney(churchTotals.income)}`,
    );
  }
  if (churchWideAttr(adminFinanceHtml, "expenses") !== formatMoney(churchTotals.expenses)) {
    throw new Error(
      `/admin/finance expense card is ${churchWideAttr(adminFinanceHtml, "expenses")}, expected ${formatMoney(churchTotals.expenses)}`,
    );
  }
  if (mixedIncome === churchTotals.income) {
    throw new Error("Seed ledger has no household income to prove church-wide cards exclude it");
  }
  if (adminFinanceHtml.includes(formatMoney(mixedIncome))) {
    throw new Error("Admin finance cards mixed private household income into church-wide totals");
  }

  const memberFinance = await (
    await fetch(`${BASE}/member/finance`, {
      headers: { cookie: cookieHeader(memberToken) },
    })
  ).text();
  if (!memberFinance.includes("$1,200.00") || !memberFinance.includes("$150.00")) {
    throw new Error("Member finance is missing Priya Sharma's demo rows");
  }
  if (memberFinance.includes("Arun Reddy") || memberFinance.includes("$1,850.00") || memberFinance.includes("Utilities")) {
    throw new Error("Member finance leaked another household");
  }

  const member2Finance = await (
    await fetch(`${BASE}/member/finance`, {
      headers: { cookie: cookieHeader(member2Token) },
    })
  ).text();
  if (!member2Finance.includes("$1,850.00") || !member2Finance.includes("$200.00")) {
    throw new Error("Second member finance is missing Arun Reddy's demo rows");
  }
  if (member2Finance.includes("Priya Sharma") || member2Finance.includes("$1,200.00")) {
    throw new Error("Second member finance leaked Priya Sharma's household");
  }

  const memberIncome = await (
    await fetch(`${BASE}/member/income`, {
      headers: { cookie: cookieHeader(memberToken) },
    })
  ).text();
  if (
    !memberIncome.includes('action="/api/member/income"') ||
    !memberIncome.includes('method="post"') ||
    !memberIncome.includes("Save income") ||
    !memberIncome.includes('step="0.01"')
  ) {
    throw new Error("Income page must POST on this page so Save income does not leave Income");
  }
  if (memberIncome.includes("Arun Reddy") || memberIncome.includes("$1,850.00")) {
    throw new Error("Member income leaked another household");
  }

  const incomeSave = await fetch(`${BASE}/api/member/income`, {
    method: "POST",
    redirect: "manual",
    headers: {
      cookie: cookieHeader(memberToken),
      accept: "text/html,application/xhtml+xml",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
    },
    body: (() => {
      const data = new FormData();
      data.set("amount", "12.34");
      data.set("occurredOn", "2026-08-28");
      data.set("category", "QA household income");
      data.set("memo", "DEMO SAMPLE DATA — QA income stay-on-page");
      return data;
    })(),
  });
  const incomeLocation = incomeSave.headers.get("location") || "";
  if (![303, 302, 307, 308].includes(incomeSave.status) || !incomeLocation.includes("/member/income")) {
    throw new Error(`Income save must stay on Income, got ${incomeSave.status} ${incomeLocation}`);
  }
  const qaIncome = await db.financeEntry.findFirst({
    where: { memberId: member.id, memo: "DEMO SAMPLE DATA — QA income stay-on-page" },
  });
  if (!qaIncome || qaIncome.amountCents !== 1234 || qaIncome.kind !== "INCOME" || qaIncome.scope !== "MEMBER") {
    throw new Error("Income save did not write a private household INCOME row");
  }
  await db.financeEntry.delete({ where: { id: qaIncome.id } });

  const adminAsMember = await (
    await fetch(`${BASE}/member/finance`, {
      headers: { cookie: cookieHeader(adminToken) },
    })
  ).text();
  if (
    adminAsMember.includes("Priya Sharma") ||
    adminAsMember.includes("Arun Reddy") ||
    adminAsMember.includes("$1,200.00")
  ) {
    throw new Error("Admin browsing /member/finance must only see the admin household");
  }

  const memberSession = await json("/api/session", {
    headers: { cookie: cookieHeader(memberToken) },
  });
  if ((memberSession.body as { user?: { role?: string } }).user?.role !== "MEMBER") {
    throw new Error("Member session was not recognized before logout");
  }

  const logout = await fetch(`${BASE}/api/logout`, {
    method: "POST",
    redirect: "manual",
    headers: { cookie: cookieHeader(memberToken) },
  });
  if (![303, 302, 307, 308].includes(logout.status)) {
    throw new Error(`Logout did not redirect, got ${logout.status}`);
  }
  const setCookie = logout.headers.getSetCookie?.() || [logout.headers.get("set-cookie") || ""];
  const expired = setCookie.some((value) => {
    const text = value.toLowerCase();
    return (
      text.includes(SESSION_COOKIE.toLowerCase()) &&
      text.includes("path=/") &&
      text.includes("samesite=lax") &&
      text.includes("httponly") &&
      /max-age=0/.test(text)
    );
  });
  if (!expired) {
    throw new Error(`Logout did not expire the session cookie: ${setCookie.join(" | ")}`);
  }
  const location = logout.headers.get("location") || "";
  if (!location.endsWith("/") && location !== `${BASE}/`) {
    throw new Error(`Logout should send members home, got ${location}`);
  }

  console.log("Admin CMS, church-wide finance cards, household isolation, income save, and logout look good.");
}

main()
  .catch((error) => {
    console.error(error.message || error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
