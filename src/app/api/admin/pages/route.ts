import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { adminError, adminResult } from "@/lib/form-response";
import { storePublicUpload } from "@/lib/uploads";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return adminError(request, "/login", "Please sign in as an admin to save.", 401);
  }

  const formData = await request.formData();
  const slug = String(formData.get("slug") || "").trim();
  if (!slug) {
    return adminError(request, "/admin/pages", "This page could not be saved.");
  }

  const existing = await db.page.findUnique({ where: { slug } });
  if (!existing) {
    return adminError(request, "/admin/pages", "That page was not found.", 404);
  }

  let imageUrl = existing.imageUrl;
  const file = formData.get("file");
  if (file instanceof File && file.size > 0) {
    const stored = await storePublicUpload(file);
    if ("error" in stored) {
      return adminError(request, `/admin/pages?slug=${encodeURIComponent(slug)}`, stored.error);
    }
    imageUrl = stored.url;
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
  });
}
