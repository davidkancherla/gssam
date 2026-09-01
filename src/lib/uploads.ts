import { extname, join } from "node:path";

export const UPLOAD_DIR = join(process.cwd(), "public", "uploads");

export const IMAGE_MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const SAFE_UPLOAD_NAME = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|jpeg|png|webp|gif)$/i;

export function extensionForImage(file: { name?: string; type?: string }) {
  const fromMime = file.type ? IMAGE_MIME_TO_EXT[file.type] : undefined;
  if (fromMime) return fromMime;
  const ext = extname(file.name || "").toLowerCase();
  if (ext === ".jpeg") return ".jpg";
  if (ext === ".jpg" || ext === ".png" || ext === ".webp" || ext === ".gif") {
    return ext;
  }
  return null;
}

export function isSafeUploadFilename(name: string) {
  return SAFE_UPLOAD_NAME.test(name);
}

export function uploadedBlob(value: FormDataEntryValue | null): Blob | null {
  if (!value || typeof value === "string") return null;
  if (typeof value.arrayBuffer !== "function" || !value.size) return null;
  return value;
}
