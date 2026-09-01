import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { adminError, adminResult } from "@/lib/form-response";
import { storePublicBuffer, takeUploadedFile } from "@/lib/uploads";

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
    return adminError(request, "/login", "Please sign in as an admin to save.", 401);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return adminError(
      request,
      "/admin/ministries",
      "The photo was too large to read. Please keep photos under 8 MB.",
      413,
    );
  }
  const id = String(formData.get("id") || "").trim();
  const name = String(formData.get("name") || "").trim();
  if (!name) {
    return adminError(request, "/admin/ministries", "Please enter a ministry name.");
  }

  const existing = id ? await db.ministry.findUnique({ where: { id } }) : null;
  let imageUrl = existing?.imageUrl || "";
  const uploaded = await takeUploadedFile(formData);
  if (!uploaded.ok && "error" in uploaded) {
    return adminError(
      request,
      existing ? `/admin/ministries?id=${existing.id}` : "/admin/ministries",
      uploaded.error,
    );
  }
  if (uploaded.ok) {
    const stored = await storePublicBuffer(uploaded.buffer, uploaded.name, uploaded.file.type);
    if ("error" in stored) {
      return adminError(
        request,
        existing ? `/admin/ministries?id=${existing.id}` : "/admin/ministries",
        stored.error,
      );
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
  return adminResult(request, `/admin/ministries?id=${encodeURIComponent(saved.id)}&saved=1`, {
    ok: true,
    id: saved.id,
  });
}
