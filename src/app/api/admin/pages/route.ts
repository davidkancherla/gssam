import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";

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

  try {
    await db.page.update({
      where: { slug },
      data: {
        title: String(formData.get("title") || "").trim(),
        excerpt: String(formData.get("excerpt") || "").trim(),
        body: String(formData.get("body") || ""),
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
  revalidatePath("/admin/pages");
  return NextResponse.json({ ok: true, slug });
}
