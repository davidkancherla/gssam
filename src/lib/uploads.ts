import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";

const MAX_BYTES = 8 * 1024 * 1024;

const MIME_BY_EXTENSION: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

const EXTENSION_BY_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export function uploadsDirectory() {
  return join(process.cwd(), "public", "uploads");
}

function sniffMime(bytes: Uint8Array): string | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "image/png";
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }
  if (bytes.length >= 6 && bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
    return "image/gif";
  }
  return null;
}

export async function storePublicUpload(file: File): Promise<{ url: string } | { error: string }> {
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please choose a photo to upload." };
  }
  if (file.size > MAX_BYTES) {
    return { error: "Please keep photos under 8 MB." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const sniffed = sniffMime(buffer);
  const fromName = MIME_BY_EXTENSION[extname(file.name).toLowerCase()] || "";
  const mime = sniffed || file.type || fromName;
  const extension = EXTENSION_BY_MIME[mime];
  if (!extension) {
    return { error: "Please upload a JPG, PNG, WEBP, or GIF photo." };
  }

  const filename = `${randomUUID()}${extension}`;
  const dir = uploadsDirectory();
  try {
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, filename), buffer);
  } catch {
    return {
      error: "The photo could not be saved on the server. Please try again.",
    };
  }

  return { url: `/uploads/${filename}` };
}
