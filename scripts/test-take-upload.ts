import { takeUploadedFile } from "../src/lib/uploads";

const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAA1BCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

async function main() {
  const asFile = new FormData();
  asFile.set("file", new File([PNG], "hero.png", { type: "image/png" }));
  const fromFile = await takeUploadedFile(asFile);
  if (!fromFile.ok || fromFile.buffer.length < 10) {
    throw new Error("takeUploadedFile missed a File");
  }

  const asBlob = new FormData();
  asBlob.set("file", new Blob([PNG], { type: "image/png" }));
  const fromBlob = await takeUploadedFile(asBlob);
  if (!fromBlob.ok || fromBlob.buffer.length < 10) {
    throw new Error("takeUploadedFile missed a Blob that is not a File");
  }

  const empty = new FormData();
  empty.set("file", new File([], ""));
  const fromEmpty = await takeUploadedFile(empty);
  if (fromEmpty.ok || !("empty" in fromEmpty)) {
    throw new Error("empty file input should be treated as no upload");
  }

  const namedEmpty = new FormData();
  namedEmpty.set("file", new File([], "photo.jpg"));
  const fromNamedEmpty = await takeUploadedFile(namedEmpty);
  if (fromNamedEmpty.ok || !("error" in fromNamedEmpty)) {
    throw new Error("named empty file should be an error, not a silent skip");
  }

  console.log("takeUploadedFile handles File, Blob, and empty inputs.");
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
