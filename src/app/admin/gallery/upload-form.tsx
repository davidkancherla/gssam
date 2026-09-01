import { Field } from "@/components/ui";

export function GalleryUploadForm() {
  return (
    <form
      action="/api/admin/gallery"
      method="post"
      encType="multipart/form-data"
      className="card grid gap-4 p-6 sm:grid-cols-2"
    >
      <Field label="Photo" name="file">
        <input className="input" name="file" type="file" accept="image/*" required />
      </Field>
      <Field label="Title" name="title" />
      <Field label="Album" name="album" defaultValue="Congregation" />
      <label className="text-sm">
        <span className="mb-1 block font-medium text-shepherd">Show on</span>
        <select className="input" name="placement" defaultValue="gallery">
          <option value="gallery">Gallery only</option>
          <option value="home">Homepage gallery</option>
          <option value="hero">Homepage hero</option>
        </select>
      </label>
      <Field label="Caption" name="caption" />
      <div className="sm:col-span-2">
        <button className="btn btn-dark" type="submit">
          Upload photo
        </button>
      </div>
    </form>
  );
}
