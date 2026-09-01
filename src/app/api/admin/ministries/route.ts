import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { storePublicUpload } from "@/lib/uploads";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Your session expired. Please sign in again, then save." },
      { status: 401 },
    );
  }

  const formData = await request.formData();
  const id = String(formData.get("id") || "").trim();
  const name = String(formData.get("name") || "").trim();
  if (!name) {
    return NextResponse.json({ error: "Please enter a ministry name." }, { status: 400 });
  }

  const existing = id ? await db.ministry.findUnique({ where: { id } }) : null;
  let imageUrl = existing?.imageUrl || "";
  const file = formData.get("file");
  if (file instanceof File && file.size > 0) {
    const stored = await storePublicUpload(file);
    if ("error" in stored) {
      return NextResponse.json({ error: stored.error }, { status: 400 });
    }
    imageUrl = stored.url;
  }

  const data = {
    name,
    slug: String(formData.get("slug") || "").trim() || slugify(name),
    summary: String(formData.get("summary") || "").trim(),
    body: String(formData.get("body") || ""),
    imageUrl,
    sortOrder: Number(formData.get("sortOrder") || 0),
  };

  const saved = existing
    ? await db.ministry.update({ where: { id: existing.id }, data })
    : await db.ministry.create({ data });

  revalidatePath("/ministries");
  revalidatePath("/");
  revalidatePath("/admin/ministries");
  return NextResponse.json({ ok: true, id: saved.id });
}
