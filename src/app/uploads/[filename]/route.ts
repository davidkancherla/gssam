import { readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  isSafeUploadFilename,
  mimeForUploadFilename,
  uploadsDirectory,
} from "@/lib/uploads";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Serve volunteer photos from public/uploads. `next start` only serves public/
 * files that existed at build time, so photos uploaded later need this route.
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ filename: string }> },
) {
  const { filename } = await context.params;
  if (!isSafeUploadFilename(filename)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const bytes = await readFile(join(uploadsDirectory(), filename));
    return new Response(new Uint8Array(bytes), {
      headers: {
        "Content-Type": mimeForUploadFilename(filename),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
