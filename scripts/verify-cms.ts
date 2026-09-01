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

  const memberSession = await json("/api/session", {
    headers: { cookie: cookieHeader(memberToken) },
  });
  if ((memberSession.body as { user?: { role?: string } }).user?.role !== "MEMBER") {
    throw new Error("Member session was not recognized before logout");
  }

  const logout = await fetch(`${BASE}/api/logout`, {
    method: "GET",
    redirect: "manual",
    headers: { cookie: cookieHeader(memberToken) },
  });
  if (![303, 302, 307, 308].includes(logout.status)) {
    throw new Error(`Logout did not redirect, got ${logout.status}`);
  }
  const setCookie = logout.headers.getSetCookie?.() || [logout.headers.get("set-cookie") || ""];
  const expired = setCookie.some(
    (value) =>
      value.includes(SESSION_COOKIE) &&
      (/max-age=0/i.test(value) || /expires=thu, 01 jan 1970/i.test(value)),
  );
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
