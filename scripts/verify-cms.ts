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

  console.log("Admin page save, gallery upload, and one-click logout look good.");
}

main()
  .catch((error) => {
    console.error(error.message || error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
