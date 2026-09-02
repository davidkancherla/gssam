"use server";

import { unlink } from "node:fs/promises";
import { join, resolve } from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminUser, requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { demoteOtherUniquePlacements, normalizeGalleryPlacement } from "@/lib/gallery-placement";
import { storePublicBuffer, takeUploadedFile } from "@/lib/uploads";
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
  const admin = await getAdminUser();
  if (!admin) redirect("/login");

  const slug = text(formData, "slug");
  if (!slug) redirect("/admin/pages?error=This+page+could+not+be+saved.");

  const existing = await db.page.findUnique({ where: { slug } });
  if (!existing) redirect("/admin/pages?error=That+page+was+not+found.");

  let imageUrl = existing.imageUrl;
  const uploaded = await takeUploadedFile(formData);
  if (!uploaded.ok && "error" in uploaded) {
    redirect(`/admin/pages?slug=${encodeURIComponent(slug)}&error=${encodeURIComponent(uploaded.error)}`);
  }
  if (uploaded.ok) {
    const stored = await storePublicBuffer(uploaded.buffer, uploaded.name, uploaded.file.type);
    if ("error" in stored) {
      redirect(`/admin/pages?slug=${encodeURIComponent(slug)}&error=${encodeURIComponent(stored.error)}`);
    } else {
      imageUrl = stored.url;
      if (slug === "home") {
        await db.galleryImage.updateMany({
          where: { placement: "hero" },
          data: { url: imageUrl },
        });
      }
    }
  } else {
    const galleryUrl = text(formData, "galleryUrl");
    if (galleryUrl.startsWith("/")) imageUrl = galleryUrl;
  }

  await db.page.update({
    where: { slug },
    data: {
      title: text(formData, "title"),
      excerpt: text(formData, "excerpt"),
      body: String(formData.get("body") || ""),
      imageUrl,
    },
  });

  const publicPath = slug === "home" ? "/" : `/${slug}`;
  revalidatePath(publicPath);
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/pages");
  redirect(`/admin/pages?slug=${encodeURIComponent(slug)}&saved=1`);
}

export async function saveMinistry(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const name = text(formData, "name");
  const existing = id ? await db.ministry.findUnique({ where: { id } }) : null;
  let imageUrl = existing?.imageUrl || text(formData, "imageUrl");
  const uploaded = await takeUploadedFile(formData);
  if (!uploaded.ok && "error" in uploaded) {
    redirect(
      existing
        ? `/admin/ministries?id=${existing.id}&error=${encodeURIComponent(uploaded.error)}`
        : `/admin/ministries?error=${encodeURIComponent(uploaded.error)}`,
    );
  }
  if (uploaded.ok) {
    const stored = await storePublicBuffer(uploaded.buffer, uploaded.name, uploaded.file.type);
    if ("error" in stored) {
      redirect(
        existing
          ? `/admin/ministries?id=${existing.id}&error=${encodeURIComponent(stored.error)}`
          : `/admin/ministries?error=${encodeURIComponent(stored.error)}`,
      );
    } else {
      imageUrl = stored.url;
    }
  }
  const data = {
    name,
    slug: text(formData, "slug") || slugify(name),
    summary: text(formData, "summary"),
    body: String(formData.get("body") || ""),
    imageUrl,
    sortOrder: Number(formData.get("sortOrder") || 0),
  };
  const saved = existing
    ? await db.ministry.update({ where: { id: existing.id }, data })
    : await db.ministry.create({ data });
  revalidatePath("/ministries");
  revalidatePath("/");
  redirect(`/admin/ministries?saved=1&id=${saved.id}`);
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
    language: text(formData, "language") || "Telugu, Hindi, English",
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
  const placement = normalizeGalleryPlacement(text(formData, "placement"));
  await demoteOtherUniquePlacements(placement, id);
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

export type UploadGalleryState = { ok?: boolean; error?: string } | null;

export async function uploadGalleryImage(
  _prev: UploadGalleryState,
  formData: FormData,
): Promise<NonNullable<UploadGalleryState>> {
  const admin = await getAdminUser();
  if (!admin) {
    return { error: "Your session expired. Please sign in again, then upload." };
  }

  const uploaded = await takeUploadedFile(formData);
  if (!uploaded.ok) {
    return { error: "error" in uploaded ? uploaded.error : "Please choose a photo to upload." };
  }

  const stored = await storePublicBuffer(uploaded.buffer, uploaded.name, uploaded.file.type);
  if ("error" in stored) {
    return { error: stored.error };
  }

  const placement = normalizeGalleryPlacement(text(formData, "placement"));
  await demoteOtherUniquePlacements(placement);

  await db.galleryImage.create({
    data: {
      title: text(formData, "title") || uploaded.name.replace(/\.[^.]+$/, "") || "Congregation photo",
      caption: text(formData, "caption"),
      album: text(formData, "album") || "Congregation",
      placement,
      url: stored.url,
    },
  });

  revalidatePath("/gallery");
  revalidatePath("/");
  revalidatePath("/admin/gallery");
  return { ok: true };
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
