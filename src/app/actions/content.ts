"use server";

import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { extractYoutubeId } from "@/lib/youtube";

function text(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export async function savePage(formData: FormData) {
  await requireAdmin();
  const slug = text(formData, "slug");
  await db.page.update({
    where: { slug },
    data: {
      title: text(formData, "title"),
      excerpt: text(formData, "excerpt"),
      body: String(formData.get("body") || ""),
    },
  });
  revalidatePath("/");
  revalidatePath(`/${slug === "home" ? "" : slug}`);
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/donate");
  revalidatePath("/privacy");
  redirect("/admin/pages?saved=1");
}

export async function saveMinistry(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const name = text(formData, "name");
  const data = {
    name,
    slug: text(formData, "slug") || slugify(name),
    summary: text(formData, "summary"),
    body: String(formData.get("body") || ""),
    imageUrl: text(formData, "imageUrl"),
    sortOrder: Number(formData.get("sortOrder") || 0),
  };
  if (id) {
    await db.ministry.update({ where: { id }, data });
  } else {
    await db.ministry.create({ data });
  }
  revalidatePath("/ministries");
  revalidatePath("/");
  redirect("/admin/ministries?saved=1");
}

export async function deleteMinistry(id: string) {
  await requireAdmin();
  await db.ministry.delete({ where: { id } });
  revalidatePath("/ministries");
  revalidatePath("/");
}

export async function saveEvent(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const title = text(formData, "title");
  const data = {
    title,
    slug: text(formData, "slug") || slugify(title),
    summary: text(formData, "summary"),
    body: String(formData.get("body") || ""),
    location: text(formData, "location") || "4211 Carol Ave, Fremont, CA 94538",
    startsAt: new Date(text(formData, "startsAt")),
    endsAt: text(formData, "endsAt") ? new Date(text(formData, "endsAt")) : null,
    imageUrl: text(formData, "imageUrl"),
    published: formData.get("published") === "on",
  };
  if (id) {
    await db.churchEvent.update({ where: { id }, data });
  } else {
    await db.churchEvent.create({ data });
  }
  revalidatePath("/events");
  revalidatePath("/");
  redirect("/admin/events?saved=1");
}

export async function deleteEvent(id: string) {
  await requireAdmin();
  await db.churchEvent.delete({ where: { id } });
  revalidatePath("/events");
  revalidatePath("/");
}

export async function saveSermon(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const data = {
    title: text(formData, "title"),
    youtubeId: extractYoutubeId(text(formData, "youtubeId")),
    preacher: text(formData, "preacher") || "GSSAM Fremont",
    language: text(formData, "language") || "Telugu, Hindi, Tamil, English",
    preachedAt: new Date(text(formData, "preachedAt")),
    description: text(formData, "description"),
    published: formData.get("published") === "on",
  };
  if (id) {
    await db.sermon.update({ where: { id }, data });
  } else {
    await db.sermon.create({ data });
  }
  revalidatePath("/messages");
  revalidatePath("/");
  redirect("/admin/messages?saved=1");
}

export async function deleteSermon(id: string) {
  await requireAdmin();
  await db.sermon.delete({ where: { id } });
  revalidatePath("/messages");
  revalidatePath("/");
}

export async function saveGalleryMeta(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const placement = normalizePlacement(text(formData, "placement"));
  if (placement === "hero") {
    await db.galleryImage.updateMany({
      where: { placement: "hero", NOT: { id } },
      data: { placement: "gallery" },
    });
  }
  await db.galleryImage.update({
    where: { id },
    data: {
      title: text(formData, "title"),
      caption: text(formData, "caption"),
      album: text(formData, "album") || "Congregation",
      placement,
    },
  });
  revalidatePath("/gallery");
  revalidatePath("/");
  redirect("/admin/gallery?saved=1");
}

export async function uploadGalleryImage(formData: FormData) {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Please choose a photo to upload.");
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error("Please keep photos under 8 MB.");
  }

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.type)) {
    throw new Error("Please upload a JPG, PNG, WEBP, or GIF photo.");
  }

  const extension = extname(file.name).toLowerCase() || ".jpg";
  const filename = `${randomUUID()}${extension}`;
  const dir = join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, filename), Buffer.from(await file.arrayBuffer()));

  const placement = normalizePlacement(text(formData, "placement"));
  if (placement === "hero") {
    await db.galleryImage.updateMany({
      where: { placement: "hero" },
      data: { placement: "gallery" },
    });
  }

  await db.galleryImage.create({
    data: {
      title: text(formData, "title") || file.name.replace(/\.[^.]+$/, ""),
      caption: text(formData, "caption"),
      album: text(formData, "album") || "Congregation",
      placement,
      url: `/uploads/${filename}`,
    },
  });

  revalidatePath("/gallery");
  revalidatePath("/");
  redirect("/admin/gallery?saved=1");
}

export async function deleteGalleryImage(id: string) {
  await requireAdmin();
  const photo = await db.galleryImage.findUnique({ where: { id } });
  if (photo) {
    await db.galleryImage.delete({ where: { id } });
    await removeUploadedFile(photo.url);
  }
  revalidatePath("/gallery");
  revalidatePath("/");
}

function normalizePlacement(value: string) {
  if (value === "hero" || value === "home") return value;
  return "gallery";
}

async function removeUploadedFile(url: string) {
  if (!url.startsWith("/uploads/")) return;
  const uploadsDir = resolve(join(process.cwd(), "public", "uploads"));
  const filePath = resolve(join(process.cwd(), "public", url));
  const relative = filePath.startsWith(uploadsDir);
  if (!relative || filePath === uploadsDir) return;
  await unlink(filePath).catch(() => undefined);
}

export async function saveWeekly(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const data = {
    weekOf: new Date(text(formData, "weekOf")),
    title: text(formData, "title"),
    scripture: text(formData, "scripture"),
    worshipNotes: String(formData.get("worshipNotes") || ""),
    announcements: String(formData.get("announcements") || ""),
    offeringTotalCents: Math.round(Number(formData.get("offeringTotal") || 0) * 100),
    published: formData.get("published") === "on",
  };
  if (id) {
    await db.weeklyBulletin.update({ where: { id }, data });
  } else {
    await db.weeklyBulletin.create({ data });
  }
  revalidatePath("/member/weekly");
  redirect("/admin/weekly?saved=1");
}

export async function deleteWeekly(id: string) {
  await requireAdmin();
  await db.weeklyBulletin.delete({ where: { id } });
  revalidatePath("/member/weekly");
}
