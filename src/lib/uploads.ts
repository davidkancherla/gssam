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

function isBlobLike(value: unknown): value is Blob {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Blob).arrayBuffer === "function"
  );
}

export type TakenUpload =
  | { ok: true; file: File; buffer: Buffer; name: string }
  | { ok: false; empty: true }
  | { ok: false; error: string };

/**
 * Read a file field from a native browser POST. Do not use `instanceof File`
 * or `file.size` alone — Next/undici sometimes hands over a Blob-like part
 * (or size 0) even when Chrome attached a real photo.
 */
export async function takeUploadedFile(formData: FormData, key = "file"): Promise<TakenUpload> {
  for (const value of formData.getAll(key)) {
    if (typeof value === "string") {
      if (value.trim()) {
        return {
          ok: false,
          error: "The photo did not upload. Please choose a JPG or PNG and save again.",
        };
      }
      continue;
    }
    if (!isBlobLike(value)) continue;

    const name =
      "name" in value && typeof (value as File).name === "string" ? (value as File).name : "";
    let buffer: Buffer;
    try {
      buffer = Buffer.from(await value.arrayBuffer());
    } catch {
      return {
        ok: false,
        error: "The photo could not be read. Please try a smaller JPG or PNG.",
      };
    }

    if (buffer.length === 0) {
      if (name) {
        return {
          ok: false,
          error:
            "The photo was empty after upload. Please choose the file again (JPG or PNG under 8 MB).",
        };
      }
      continue;
    }

    const type = value.type || "";
    const file =
      value instanceof File
        ? value
        : new File([Uint8Array.from(buffer)], name || "photo.jpg", { type });
    return { ok: true, file, buffer, name: name || file.name };
  }
  return { ok: false, empty: true };
}

export async function storePublicBuffer(
  buffer: Buffer,
  name = "",
  type = "",
): Promise<{ url: string } | { error: string }> {
  if (!buffer.length) {
    return { error: "Please choose a photo to upload." };
  }
  if (buffer.length > MAX_BYTES) {
    return { error: "Please keep photos under 8 MB." };
  }

  const sniffed = sniffMime(buffer);
  const fromName = MIME_BY_EXTENSION[extname(name).toLowerCase()] || "";
  const mime = sniffed || type || fromName;
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

export async function storePublicUpload(file: File | Blob): Promise<{ url: string } | { error: string }> {
  if (!isBlobLike(file)) {
    return { error: "Please choose a photo to upload." };
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const name = "name" in file && typeof file.name === "string" ? file.name : "";
  return storePublicBuffer(buffer, name, file.type || "");
}
