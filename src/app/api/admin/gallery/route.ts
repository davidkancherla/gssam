import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { storePublicUpload } from "@/lib/uploads";
import { revalidatePath } from "next/cache";

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
    return NextResponse.json(
      { error: "Please sign in as an admin to upload a photo." },
      { status: 401 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "The photo was too large to read. Please keep photos under 8 MB." },
      { status: 413 },
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Please choose a photo to upload." }, { status: 400 });
  }

  const stored = await storePublicUpload(file);
  if ("error" in stored) {
    return NextResponse.json({ error: stored.error }, { status: 400 });
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
        file.name.replace(/\.[^.]+$/, "") ||
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

  return NextResponse.json({ ok: true, id: photo.id, url: photo.url });
}
