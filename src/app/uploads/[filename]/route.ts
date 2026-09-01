import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { UPLOAD_DIR, isSafeUploadFilename } from "@/lib/uploads";

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ filename: string }> },
) {
  const { filename } = await context.params;
  if (!isSafeUploadFilename(filename)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
        const bytes = await readFile(join(UPLOAD_DIR, filename));
        const ext = filename.split(".").pop()?.toLowerCase() || "jpg";
        return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": MIME[ext] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
