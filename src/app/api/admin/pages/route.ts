import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { storePublicUpload } from "@/lib/uploads";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Your session expired. Please sign in again, then save." },
      { status: 401 },
    );
  }

  const formData = await request.formData();
  const slug = String(formData.get("slug") || "").trim();
  if (!slug) {
    return NextResponse.json(
      { error: "This page could not be saved because the slug was missing." },
      { status: 400 },
    );
  }

  const existing = await db.page.findUnique({ where: { slug } });
  if (!existing) {
    return NextResponse.json({ error: "That page was not found." }, { status: 404 });
  }

  let imageUrl = existing.imageUrl;
  const file = formData.get("file");
  if (file instanceof File && file.size > 0) {
    const stored = await storePublicUpload(file);
    if ("error" in stored) {
      return NextResponse.json({ error: stored.error }, { status: 400 });
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
    return NextResponse.json(
      { error: "Could not save this page. Please try again." },
      { status: 400 },
    );
  }

  const publicPath = slug === "home" ? "/" : `/${slug}`;
  revalidatePath(publicPath);
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/pages");
  return NextResponse.json({ ok: true, slug });
}
