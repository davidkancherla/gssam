import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { adminError, adminResult } from "@/lib/form-response";
import {
  WELCOME_LEFT,
  WELCOME_RIGHT,
  setPlacementUrl,
} from "@/lib/gallery-placement";
import { storePublicBuffer, takeUploadedFile } from "@/lib/uploads";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function applyPhotoField(
  formData: FormData,
  fileKey: string,
  galleryKey: string,
): Promise<{ error: string } | { url: string | null }> {
  const uploaded = await takeUploadedFile(formData, fileKey);
  if (!uploaded.ok && "error" in uploaded) {
    return { error: uploaded.error };
  }
  if (uploaded.ok) {
    const stored = await storePublicBuffer(uploaded.buffer, uploaded.name, uploaded.file.type);
    if ("error" in stored) return { error: stored.error };
    return { url: stored.url };
  }
  const galleryUrl = String(formData.get(galleryKey) || "").trim();
  if (galleryUrl.startsWith("/")) return { url: galleryUrl };
  return { url: null as string | null };
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return adminError(request, "/login", "Please sign in as an admin to save.", 401);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return adminError(
      request,
      "/admin/pages",
      "The photo was too large to read. Please keep photos under 8 MB.",
      413,
    );
  }

  const slug = String(formData.get("slug") || "").trim();
  if (!slug) {
    return adminError(request, "/admin/pages", "This page could not be saved.");
  }

  const existing = await db.page.findUnique({ where: { slug } });
  if (!existing) {
    return adminError(request, "/admin/pages", "That page was not found.", 404);
  }

  const hero = await applyPhotoField(formData, "file", "galleryUrl");
  if ("error" in hero) {
    return adminError(request, `/admin/pages?slug=${encodeURIComponent(slug)}`, hero.error);
  }

  let imageUrl = existing.imageUrl;
  if (hero.url) {
    imageUrl = hero.url;
    if (slug === "home") {
      await setPlacementUrl("hero", imageUrl, "Homepage hero");
    }
  }

  let welcomeLeftUrl: string | null = null;
  let welcomeRightUrl: string | null = null;
  if (slug === "home") {
    const left = await applyPhotoField(formData, "welcomeLeftFile", "welcomeLeftGalleryUrl");
    if ("error" in left) {
      return adminError(request, `/admin/pages?slug=${encodeURIComponent(slug)}`, left.error);
    }
    const right = await applyPhotoField(formData, "welcomeRightFile", "welcomeRightGalleryUrl");
    if ("error" in right) {
      return adminError(request, `/admin/pages?slug=${encodeURIComponent(slug)}`, right.error);
    }
    if (left.url) {
      await setPlacementUrl(WELCOME_LEFT, left.url, "Welcome Home left");
      welcomeLeftUrl = left.url;
    }
    if (right.url) {
      await setPlacementUrl(WELCOME_RIGHT, right.url, "Welcome Home right");
      welcomeRightUrl = right.url;
    }
  }

  try {
    await db.page.update({
      where: { slug },
      data: {
        title: String(formData.get("title") || "").trim(),
        excerpt: String(formData.get("excerpt") || "").trim(),
        body: String(formData.get("body") || ""),
        imageUrl,
      },
    });
  } catch {
    return adminError(request, `/admin/pages?slug=${encodeURIComponent(slug)}`, "Could not save this page.");
  }

  const publicPath = slug === "home" ? "/" : `/${slug}`;
  revalidatePath(publicPath);
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/pages");
  return adminResult(request, `/admin/pages?slug=${encodeURIComponent(slug)}&saved=1`, {
    ok: true,
    slug,
    imageUrl,
    welcomeLeftUrl,
    welcomeRightUrl,
  });
}
