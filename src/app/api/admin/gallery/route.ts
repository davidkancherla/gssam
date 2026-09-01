import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { adminError, adminResult } from "@/lib/form-response";
import { storePublicBuffer, takeUploadedFile } from "@/lib/uploads";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function placementOf(value: FormDataEntryValue | null) {
  const placement = String(value || "");
  if (placement === "hero" || placement === "home") return placement;
  return "gallery";
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return adminError(request, "/login", "Please sign in as an admin to upload a photo.", 401);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return adminError(request, "/admin/gallery", "The photo was too large to read. Please keep photos under 8 MB.", 413);
  }

  const uploaded = await takeUploadedFile(formData);
  if (!uploaded.ok) {
    return adminError(
      request,
      "/admin/gallery",
      "error" in uploaded ? uploaded.error : "Please choose a photo to upload.",
    );
  }

  const stored = await storePublicBuffer(uploaded.buffer, uploaded.name, uploaded.file.type);
  if ("error" in stored) {
    return adminError(request, "/admin/gallery", stored.error);
  }

  const placement = placementOf(formData.get("placement"));
  if (placement === "hero") {
    await db.galleryImage.updateMany({
      where: { placement: "hero" },
      data: { placement: "gallery" },
    });
  }

  const photo = await db.galleryImage.create({
    data: {
      title:
        String(formData.get("title") || "").trim() ||
        uploaded.name.replace(/\.[^.]+$/, "") ||
        "Congregation photo",
      caption: String(formData.get("caption") || "").trim(),
      album: String(formData.get("album") || "").trim() || "Congregation",
      placement,
      url: stored.url,
    },
  });

  revalidatePath("/gallery");
  revalidatePath("/");
  revalidatePath("/admin/gallery");
  return adminResult(request, "/admin/gallery?saved=1", {
    ok: true,
    id: photo.id,
    url: photo.url,
  });
}
