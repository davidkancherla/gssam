import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { adminError, adminResult } from "@/lib/form-response";
import { storePublicBuffer, takeUploadedFile } from "@/lib/uploads";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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

  let imageUrl = existing.imageUrl;
  const uploaded = await takeUploadedFile(formData);
  if (!uploaded.ok && "error" in uploaded) {
    return adminError(request, `/admin/pages?slug=${encodeURIComponent(slug)}`, uploaded.error);
  }
  if (uploaded.ok) {
    const stored = await storePublicBuffer(uploaded.buffer, uploaded.name, uploaded.file.type);
    if ("error" in stored) {
      return adminError(request, `/admin/pages?slug=${encodeURIComponent(slug)}`, stored.error);
    }
    imageUrl = stored.url;
    if (slug === "home") {
      await db.galleryImage.updateMany({
        where: { placement: "hero" },
        data: { url: imageUrl },
      });
    }
  } else {
    const galleryUrl = String(formData.get("galleryUrl") || "").trim();
    if (galleryUrl.startsWith("/")) {
      imageUrl = galleryUrl;
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
  });
}
