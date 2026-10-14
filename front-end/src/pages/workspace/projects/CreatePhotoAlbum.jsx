import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Camera, Images, Loader2,
  Save, UploadCloud, X
} from "lucide-react";
import { apiRequest, API_BASE_URL } from "../../../lib/api";
import { getToken } from "../../../lib/auth";

const API_PUBLIC = (
  import.meta.env.VITE_PUBLIC_API_BASE_URL ||
  "https://portfolio-api.ambulancegema.com"
).replace(/\/+$/, "");

const TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

const fieldStyle =
  "w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-white/40";

function Preview({ file, alt }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!file || !url) return null;

  return (
    <img
      src={url}
      alt={alt}
      className="aspect-video w-full rounded-xl object-cover"
    />
  );
}

async function uploadFile(file, token) {
  const body = new FormData();
  body.append("image", file);

  const response = await fetch(`${API_BASE_URL}/api/uploads/projects`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body,
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Image upload failed");
  }

  const path = result.data?.path;

  if (
    typeof path !== "string" ||
    !path.startsWith("/uploads/projects/")
  ) {
    throw new Error("Invalid uploaded image path");
  }

  return `${API_PUBLIC}${path}`;
}

export default function CreatePhotoAlbum() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    slug: "",
    photoCategory: "Wedding",
    year: "2026",
    status: "draft",
    shortDescription: "",
    description: "",
    tags: "",
    sortOrder: "0",
  });

  const [coverFile, setCoverFile] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [createdId, setCreatedId] = useState(null);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateFiles = (files) => {
    for (const file of files) {
      if (!TYPES.includes(file.type)) {
        throw new Error(`${file.name}: JPG, PNG, or WebP only.`);
      }

      if (file.size > MAX_SIZE) {
        throw new Error(`${file.name}: Maximum size is 5 MB.`);
      }
    }
  };

  const handleCover = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      validateFiles([file]);
      setCoverFile(file);
      setError("");
    } catch (err) {
      setError(err.message);
    }

    event.target.value = "";
  };

  const handlePhotos = (event) => {
    const selected = Array.from(event.target.files || []);

    try {
      if (photos.length + selected.length > 20) {
        throw new Error("Maximum 20 gallery photos per album.");
      }

      validateFiles(selected);
      setPhotos((prev) => [...prev, ...selected]);
      setError("");
    } catch (err) {
      setError(err.message);
    }

    event.target.value = "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving || createdId) return;

    setError("");

    if (!coverFile && photos.length === 0) {
      setError("Please select at least one photo or cover.");
      return;
    }

    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    setSaving(true);

    let albumId = null;

    try {
      const tags = [
        form.photoCategory,
        ...form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      ].filter(
        (tag, index, all) =>
          all.findIndex(
            (item) => item.toLowerCase() === tag.toLowerCase()
          ) === index
      );

      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        category: "photo",
        year: form.year,
        status: "draft",
        shortDescription: form.shortDescription,
        description: form.description,
        coverImage: "",
        externalUrl: "",
        videoEmbed: "",
        seoTitle: form.title,
        seoDescription: form.shortDescription,
        sortOrder: Number(form.sortOrder) || 0,
        tags,
      };

      setProgress("Creating album draft...");

      const created = await apiRequest("/api/projects", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      albumId = created.data?.id;

      if (!albumId) {
        throw new Error("Album ID was not returned.");
      }

      setCreatedId(albumId);

      let coverUrl = "";

      if (coverFile) {
        setProgress("Uploading album cover...");
        coverUrl = await uploadFile(coverFile, token);
      }

      for (let index = 0; index < photos.length; index++) {
        const file = photos[index];

        setProgress(
          `Uploading gallery photo ${index + 1} of ${photos.length}...`
        );

        const imageUrl = await uploadFile(file, token);

        await apiRequest(`/api/projects/${albumId}/images`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            imageUrl,
            caption: "",
            sortOrder: index + 1,
            imageType: "gallery",
          }),
        });

        if (!coverUrl && index === 0) {
          coverUrl = imageUrl;
        }
      }

      setProgress("Saving album details...");

      await apiRequest(`/api/projects/${albumId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...payload,
          coverImage: coverUrl,
          status: form.status,
        }),
      });

      setProgress("Album created successfully.");

      navigate("/projects/foto", {
        replace: true,
      });
    } catch (err) {
      setError(
        albumId
          ? `Album draft #${albumId} was created, but setup could not finish: ${err.message}. Open Edit to complete it.`
          : err.message || "Failed to create album."
      );

      setProgress("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="px-6 py-10 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/projects/foto"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to Photo Albums
        </Link>

        <div className="mb-10">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gray-500">
            Workspace / Projects / Foto
          </p>

          <h1 className="text-3xl font-bold md:text-5xl">
            Create Photo Album.
          </h1>

          <p className="mt-4 text-gray-400">
            Create an album and upload your photos in one step.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8"
        >
          {error && (
            <div role="alert" className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-200">
              {error}
            </div>
          )}

          {createdId && (
            <Link
              to={`/projects/${createdId}/edit`}
              className="mb-6 inline-flex rounded-full border border-white/20 px-5 py-3 text-sm text-white hover:bg-white/10"
            >
              Open Saved Album Draft #{createdId}
            </Link>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Album Title">
              <input
                required
                name="title"
                value={form.title}
                onChange={updateField}
                placeholder="Wedding Photography"
                className={fieldStyle}
              />
            </Field>

            <Field label="Slug">
              <input
                name="slug"
                value={form.slug}
                onChange={updateField}
                placeholder="Auto-generated if empty"
                className={fieldStyle}
              />
            </Field>

            <Field label="Photo Category">
              <select
                name="photoCategory"
                value={form.photoCategory}
                onChange={updateField}
                className={fieldStyle}
              >
                {[
                  "Wedding",
                  "Prewedding",
                  "Engagement",
                  "Portrait",
                  "Event",
                  "Product",
                  "Landscape",
                  "Street",
                  "Corporate",
                ].map((category) => (
                  <option
                    key={category}
                    value={category}
                    className="bg-neutral-900 text-white"
                  >
                    {category}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Year">
              <input
                name="year"
                value={form.year}
                onChange={updateField}
                className={fieldStyle}
              />
            </Field>

            <Field label="Status">
              <select
                name="status"
                value={form.status}
                onChange={updateField}
                className={fieldStyle}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </Field>

            <Field label="Sort Order">
              <input
                type="number"
                name="sortOrder"
                value={form.sortOrder}
                onChange={updateField}
                className={fieldStyle}
              />
            </Field>

            <Field label="Tags">
              <input
                name="tags"
                value={form.tags}
                onChange={updateField}
                placeholder="Wedding, Photography, Cinematic"
                className={fieldStyle}
              />
            </Field>

            <div className="md:col-span-2">
              <Field label="Short Description">
                <textarea
                  name="shortDescription"
                  rows={3}
                  value={form.shortDescription}
                  onChange={updateField}
                  className={fieldStyle}
                />
              </Field>
            </div>

            <div className="md:col-span-2">
              <Field label="Description">
                <textarea
                  name="description"
                  rows={4}
                  value={form.description}
                  onChange={updateField}
                  className={fieldStyle}
                />
              </Field>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-8">
            <div className="mb-6 flex items-center gap-3">
              <Camera size={23} />
              <h2 className="text-2xl font-bold">
                Album Cover
              </h2>
            </div>

            <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-white/20 p-6 hover:bg-white/5">
              <UploadCloud size={22} />
              Select Cover Photo
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleCover}
                disabled={saving || Boolean(createdId)}
              />
            </label>

            {coverFile && (
              <div className="mt-5 max-w-md">
                <Preview file={coverFile} alt="Album cover" />
                <button
                  type="button"
                  disabled={saving || Boolean(createdId)}
                  onClick={() => setCoverFile(null)}
                  className="mt-3 text-sm text-red-300"
                >
                  Remove Cover
                </button>
              </div>
            )}
          </div>

          <div className="mt-10 border-t border-white/10 pt-8">
            <div className="mb-6 flex items-center gap-3">
              <Images size={24} />
              <div>
                <h2 className="text-2xl font-bold">
                  Album Gallery
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                  Maximum 20 photos, 5 MB each.
                </p>
              </div>
            </div>

            <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/20 p-6 hover:bg-white/5">
              <UploadCloud size={28} />
              <span>Select Multiple Photos</span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handlePhotos}
                disabled={saving || Boolean(createdId)}
              />
            </label>

            {photos.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {photos.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="relative rounded-xl border border-white/10 bg-black/20 p-2"
                  >
                    <Preview file={file} alt={file.name} />

                    <p className="mt-2 truncate text-xs text-gray-400">
                      {file.name}
                    </p>

                    <button
                      type="button"
                      disabled={saving || Boolean(createdId)}
                      onClick={() =>
                        setPhotos((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
                      className="absolute right-3 top-3 rounded-full bg-black/70 p-1.5"
                      aria-label={`Remove photo ${index + 1}`}
                    >
                      <X size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {progress && (
            <div role="status" className="mt-8 rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-gray-300">
              {saving && (
                <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
              )}
              {progress}
            </div>
          )}

          <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-8 sm:flex-row sm:justify-end">
            <Link
              to="/projects/foto"
              className="rounded-full border border-white/10 px-6 py-3 text-center hover:bg-white/10"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving || Boolean(createdId)}
              className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-6 py-3 font-semibold text-black disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Save size={20} />
              )}
              {saving ? "Creating Album..." : "Create Photo Album"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm text-gray-400">
        {label}
      </label>
      {children}
    </div>
  );
}
