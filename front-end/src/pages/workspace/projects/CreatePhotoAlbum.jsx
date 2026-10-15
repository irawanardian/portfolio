import PhotoAlbumFields from "./components/PhotoAlbumFields";
import PhotoAlbumCover from "./components/PhotoAlbumCover";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Camera, CheckCircle2, Loader2,
  Save, UploadCloud
} from "lucide-react";
import { apiRequest, API_BASE_URL } from "../../../lib/api";
import { getToken } from "../../../lib/auth";
import BulkPhotoUpload from "../../../components/workspace/BulkPhotoUpload";

const PUBLIC_API = "https://portfolio-api.ambulancegema.com";
const CATEGORIES = [
  "Wedding", "Prewedding", "Engagement", "Portrait",
  "Event", "Product", "Landscape", "Street", "Corporate"
];
const TYPES = ["image/jpeg", "image/png", "image/webp"];
const fieldStyle =
  "w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-white/40";

function albumPayload(form, coverImage = "", status = "draft") {
  const tags = [form.photoCategory, ...form.tags.split(",")]
    .map((tag) => tag.trim())
    .filter(Boolean)
    .filter((tag, index, items) =>
      items.findIndex((value) =>
        value.toLowerCase() === tag.toLowerCase()
      ) === index
    );

  return {
    title: form.title.trim(),
    slug: form.slug.trim(),
    category: "photo",
    year: form.year,
    status,
    shortDescription: form.shortDescription,
    description: form.description,
    coverImage,
    externalUrl: "",
    videoEmbed: "",
    seoTitle: form.seoTitle?.trim() || "",
    seoDescription: form.seoDescription?.trim() || "",
    sortOrder: Number(form.sortOrder) || 0,
    tags,
  };
}

async function uploadFile(file, token) {
  const body = new FormData();
  body.append("image", file);

  const response = await fetch(
    `${API_BASE_URL}/api/uploads/projects`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body,
    }
  );

  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "Upload failed.");
  }

  const path = result.data?.path;

  if (
    typeof path !== "string" ||
    !/^\/uploads\/projects\/[^/]+$/.test(path)
  ) {
    throw new Error("Invalid uploaded file path.");
  }

  return `${PUBLIC_API}${path}`;
}

export default function CreatePhotoAlbum() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    slug: "",
    photoCategory: "Wedding",
    year: String(new Date().getFullYear()),
    status: "draft",
    shortDescription: "",
    description: "",
    tags: "",
    sortOrder: "0",
    seoTitle: "",
    seoDescription: "",
  });

  const [createdId, setCreatedId] = useState(null);
  const draftPromise = useRef(null);
  const albumIdRef = useRef(null);
  const coverUrlRef = useRef("");
  const firstPhotoRef = useRef("");
  const coverBusyRef = useRef(false);
  const galleryBusyRef = useRef(false);

  const [coverUrl, setCoverUrl] = useState("");
  const [coverUploading, setCoverUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [draftCreating, setDraftCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [photoCount, setPhotoCount] = useState(0);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const busy =
    saving || coverUploading || galleryUploading || draftCreating;

  function updateField(event) {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function ensureDraft() {
    if (albumIdRef.current) return albumIdRef.current;
    if (draftPromise.current) return draftPromise.current;

    if (!form.title.trim()) {
      throw new Error(
        "Isi Album Title terlebih dahulu sebelum memilih foto."
      );
    }

    const token = getToken();

    if (!token) {
      navigate("/login");
      throw new Error("Session expired.");
    }

    setDraftCreating(true);
    setNotice("Preparing album draft...");

    const promise = (async () => {
      const result = await apiRequest("/api/projects", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(albumPayload(form)),
      });

      const id = result.data?.id;

      if (!id) {
        throw new Error("Album draft ID was not returned.");
      }

      albumIdRef.current = id;
      setCreatedId(id);
      setNotice(`Draft #${id} created. Photos upload automatically.`);
      return id;
    })();

    draftPromise.current = promise;

    try {
      return await promise;
    } finally {
      draftPromise.current = null;
      setDraftCreating(false);
    }
  }

  async function handleCover(event) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || coverBusyRef.current) return;

    if (!TYPES.includes(file.type) || file.size > 5 * 1024 * 1024) {
      setError("Cover must be JPG, PNG, or WebP, maximum 5 MB.");
      return;
    }

    coverBusyRef.current = true;
    setCoverUploading(true);
    setError("");
    setNotice("Uploading album cover...");

    try {
      const id = await ensureDraft();

      const token = getToken();
      const url = await uploadFile(file, token);

      await apiRequest(`/api/projects/${id}/cover`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ coverImage: url }),
      });

      coverUrlRef.current = url;
      setCoverUrl(url);
      setNotice("Cover uploaded successfully.");
    } catch (err) {
      setError(err.message || "Cover upload failed.");
    } finally {
      coverBusyRef.current = false;
      setCoverUploading(false);
    }
  }

  function handleImagesAdded(images) {
    setPhotoCount((count) => count + images.length);
    setUploadedPhotos((previous) => [...previous, ...images]);

    if (!firstPhotoRef.current && images[0]?.imageUrl) {
      firstPhotoRef.current = images[0].imageUrl;
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      saving ||
      coverBusyRef.current ||
      galleryBusyRef.current ||
      draftPromise.current
    ) {
      setError("Please wait until uploads are finished.");
      return;
    }

    if (!form.title.trim()) {
      setError("Album Title is required.");
      return;
    }

    if (!coverUrlRef.current && photoCount === 0) {
      setError("Upload at least one cover or gallery photo.");
      return;
    }

    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    setSaving(true);
    setError("");
    setNotice("Saving album information...");

    try {
      const id = await ensureDraft();
      const finalCover =
        coverUrlRef.current || firstPhotoRef.current || "";

      await apiRequest(`/api/projects/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(
          albumPayload(form, finalCover, form.status)
        ),
      });

      navigate("/projects/foto", { replace: true });
    } catch (err) {
      setError(err.message || "Failed to save album.");
      setNotice("");
    } finally {
      setSaving(false);
    }
  }

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
          <h1 className="text-3xl font-bold text-white md:text-5xl">
            Create Photo Album.
          </h1>
          <p className="mt-4 text-gray-400">
            Fill in the title, then select photos to upload instantly.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8"
        >
          {error && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200"
            >
              {error}
            </div>
          )}

          {notice && (
            <div
              role="status"
              className="mb-6 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-gray-300"
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-green-400" />
              )}
              {notice}
            </div>
          )}

          {createdId && (
            <Link
              to={`/projects/${createdId}/edit`}
              className="mb-6 inline-block rounded-full border border-white/20 px-5 py-2 text-sm text-white hover:bg-white/10"
            >
              Open saved draft #{createdId}
            </Link>
          )}

          <PhotoAlbumFields
            form={form}
            photoCategory={form.photoCategory}
            onChange={updateField}
            onCategoryChange={(value) =>
              setForm((prev) => ({ ...prev, photoCategory: value }))
            }
          />

          <PhotoAlbumCover
            coverUrl={coverUrl}
            uploading={coverUploading}
            onSelect={handleCover}
          />

          <section className="mt-8">
            <BulkPhotoUpload
              projectId={createdId}
              ensureProjectId={ensureDraft}
              existingCount={photoCount}
              onImagesAdded={handleImagesAdded}
              onUploadingChange={(value) => {
                galleryBusyRef.current = value;
                setGalleryUploading(value);
              }}
            />

            {uploadedPhotos.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {uploadedPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="overflow-hidden rounded-xl border border-white/10 bg-black/20"
                  >
                    <img
                      src={photo.imageUrl}
                      alt={photo.caption || "Album photo"}
                      loading="lazy"
                      className="aspect-square w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            <p className="mt-3 text-sm text-gray-400">
              {photoCount} gallery photos uploaded.
              All successful uploads are already saved on the server.
            </p>
          </section>

          <div className="mt-10 flex flex-wrap justify-end gap-3 border-t border-white/10 pt-8">
            <Link
              to="/projects/foto"
              className="rounded-full border border-white/10 px-6 py-3 text-white hover:bg-white/10"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Save className="h-5 w-5" />
              )}
              {saving ? "Saving..." : "Save Album"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-gray-400">
        {label}
      </span>
      {children}
    </label>
  );
}
