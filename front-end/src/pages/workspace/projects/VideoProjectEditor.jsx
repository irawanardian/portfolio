import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Loader2, PlayCircle, Save,
  UploadCloud, Youtube,
} from "lucide-react";
import { apiRequest, API_BASE_URL } from "../../../lib/api";
import { getToken } from "../../../lib/auth";
import {
  getYouTubeId,
  getYouTubeEmbed,
  getYouTubeThumbnail,
} from "../../../lib/youtube";

const PUBLIC_API = (
  import.meta.env.VITE_PUBLIC_API_BASE_URL ||
  "https://portfolio-api.ambulancegema.com"
).replace(/\/+$/, "");

const CATEGORIES = [
  "Wedding", "Prewedding", "Engagement", "Event",
  "Product Advertisement", "Live Streaming", "Corporate",
];

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-white/40";

const initialForm = {
  title: "",
  slug: "",
  year: String(new Date().getFullYear()),
  status: "draft",
  sortOrder: "0",
  youtubeUrl: "",
  videoCategory: "",
  tags: "",
  shortDescription: "",
  description: "",
  seoTitle: "",
  seoDescription: "",
  coverMode: "youtube",
  customCover: "",
};

function Field({ label, children, wide = false }) {
  return (
    <div className={wide ? "md:col-span-2" : ""}>
      <label className="mb-2 block text-sm text-gray-400">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function VideoProjectEditor({ mode = "create" }) {
  const isEdit = mode === "edit";
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const videoId = getYouTubeId(form.youtubeUrl);
  const embedUrl = getYouTubeEmbed(form.youtubeUrl);
  const youtubeCover = getYouTubeThumbnail(form.youtubeUrl);

  const coverUrl =
    form.coverMode === "youtube"
      ? youtubeCover
      : form.customCover;

  useEffect(() => {
    if (!isEdit) return;

    let active = true;

    async function load() {
      try {
        const token = getToken();
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await apiRequest(
          `/api/projects/workspace/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!active) return;

        const project = response.data;

        if (project.category !== "video") {
          throw new Error("This project is not a video.");
        }

        const videoUrl =
          project.videoEmbed || project.externalUrl || "";

        const projectTags = Array.isArray(project.tags)
          ? project.tags
          : [];

        const videoCategory =
          projectTags.find((tag) =>
            CATEGORIES.some(
              (category) =>
                category.toLowerCase() === tag.toLowerCase()
            )
          ) || "";

        const otherTags = projectTags.filter(
          (tag) =>
            !CATEGORIES.some(
              (category) =>
                category.toLowerCase() === tag.toLowerCase()
            )
        );

        const automaticCover =
          getYouTubeThumbnail(videoUrl);

        const storedCover = project.coverImage || "";

        const isAutomatic =
          !storedCover ||
          storedCover === automaticCover;

        setForm({
          title: project.title || "",
          slug: project.slug || "",
          year: String(project.year || ""),
          status: project.status || "draft",
          sortOrder: String(project.sortOrder ?? 0),
          youtubeUrl: videoUrl,
          videoCategory,
          tags: otherTags.join(", "),
          shortDescription: project.shortDescription || "",
          description: project.description || "",
          seoTitle: project.seo?.title || "",
          seoDescription: project.seo?.description || "",
          coverMode: isAutomatic ? "youtube" : "custom",
          customCover: isAutomatic ? "" : storedCover,
        });
      } catch (err) {
        if (active) {
          setError(err.message || "Failed to load video.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [id, isEdit, navigate]);

  function change(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function uploadCover(event) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || uploading || saving) return;

    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      setError("Cover harus JPG, PNG, atau WebP, maksimal 5 MB.");
      return;
    }

    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    setUploading(true);
    setError("");
    setNotice("Uploading cover...");

    try {
      const data = new FormData();
      data.append("image", file);

      const response = await fetch(
        `${API_BASE_URL}/api/uploads/projects`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Cover upload failed.");
      }

      const path = result.data?.path;

      if (
        typeof path !== "string" ||
        !/^\/uploads\/projects\/[^/]+$/.test(path)
      ) {
        throw new Error("Invalid uploaded cover path.");
      }

      const url = `${PUBLIC_API}${path}`;

      setForm((previous) => ({
        ...previous,
        coverMode: "custom",
        customCover: url,
      }));

      setNotice("Cover berhasil di-upload. Klik Save untuk menyimpan.");
    } catch (err) {
      setError(err.message || "Upload failed.");
      setNotice("");
    } finally {
      setUploading(false);
    }
  }

  async function save(event) {
    event.preventDefault();

    if (saving || uploading) return;

    if (!form.title.trim()) {
      setError("Video Title wajib diisi.");
      return;
    }

    if (!videoId) {
      setError("Masukkan URL YouTube yang valid.");
      return;
    }

    if (form.coverMode === "custom" && !form.customCover) {
      setError("Upload custom cover terlebih dahulu.");
      return;
    }

    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    const tags = [
      form.videoCategory,
      ...form.tags.split(",").map((tag) => tag.trim()),
    ].filter(Boolean);

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      category: "video",
      year: form.year,
      status: form.status,
      sortOrder: Number(form.sortOrder) || 0,
      videoEmbed: embedUrl,
      externalUrl: `https://www.youtube.com/watch?v=${videoId}`,
      coverImage: coverUrl,
      tags: [...new Set(tags)],
      shortDescription: form.shortDescription,
      description: form.description,
      seoTitle: form.seoTitle,
      seoDescription: form.seoDescription,
    };

    setSaving(true);
    setError("");
    setNotice("");

    try {
      await apiRequest(
        isEdit ? `/api/projects/${id}` : "/api/projects",
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      navigate("/projects/video");
    } catch (err) {
      setError(err.message || "Failed to save video.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-400">
        <Loader2 className="mx-auto h-8 w-8 animate-spin" />
        <p className="mt-3">Loading video...</p>
      </div>
    );
  }

  return (
    <section className="px-6 py-10 lg:px-10 lg:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-5xl"
      >
        <Link
          to="/projects/video"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Video Projects
        </Link>

        <div className="mb-10">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-gray-500">
            {isEdit ? "Edit Video" : "New Video"}
          </p>

          <h1 className="text-3xl font-bold md:text-5xl">
            {isEdit ? "Edit Video Project." : "Create Video Project."}
          </h1>

          <p className="mt-4 text-gray-400">
            YouTube video, preview, thumbnail, dan informasi portfolio.
          </p>
        </div>

        <form
          onSubmit={save}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8"
        >
          {error && (
            <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
              {error}
            </div>
          )}

          {notice && (
            <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-200">
              {notice}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Video Title">
              <input
                required
                name="title"
                value={form.title}
                onChange={change}
                placeholder="Wedding Cinematic"
                className={inputClass}
              />
            </Field>

            <Field label="Slug">
              <input
                name="slug"
                value={form.slug}
                onChange={change}
                placeholder="Auto-generated if empty"
                className={inputClass}
              />
            </Field>

            <Field label="Video Category">
              <select
                name="videoCategory"
                value={form.videoCategory}
                onChange={change}
                className={inputClass}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Year">
              <input
                name="year"
                value={form.year}
                onChange={change}
                className={inputClass}
              />
            </Field>

            <Field label="Status">
              <select
                name="status"
                value={form.status}
                onChange={change}
                className={inputClass}
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
                onChange={change}
                className={inputClass}
              />
            </Field>

            <Field label="YouTube Video URL" wide>
              <input
                name="youtubeUrl"
                value={form.youtubeUrl}
                onChange={change}
                placeholder="https://youtu.be/..."
                className={inputClass}
              />
              <p className="mt-2 text-xs text-gray-500">
                Mendukung YouTube biasa, Shorts, dan youtu.be.
              </p>
            </Field>
          </div>

          <section className="mt-8 border-t border-white/10 pt-8">
            <div className="mb-5 flex items-center gap-3">
              <Youtube className="h-6 w-6" />
              <h2 className="text-2xl font-bold">
                YouTube Preview
              </h2>
            </div>

            {embedUrl ? (
              <div className="aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black">
                <iframe
                  key={embedUrl}
                  src={embedUrl}
                  title="YouTube video preview"
                  className="h-full w-full"
                  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            ) : (
              <div className="flex aspect-video flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/20 bg-black/20 text-gray-500">
                <PlayCircle className="h-12 w-12" />
                <p className="text-sm">
                  Tempel URL YouTube untuk melihat preview.
                </p>
              </div>
            )}
          </section>

          <section className="mt-8 border-t border-white/10 pt-8">
            <h2 className="mb-5 text-2xl font-bold">
              Video Cover
            </h2>

            <div className="mb-5 flex flex-col gap-3 sm:flex-row">
              {[
                ["youtube", "Automatic YouTube Thumbnail"],
                ["custom", "Upload Custom Cover"],
              ].map(([value, label]) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm"
                >
                  <input
                    type="radio"
                    name="coverMode"
                    value={value}
                    checked={form.coverMode === value}
                    onChange={change}
                    className="accent-white"
                  />
                  {label}
                </label>
              ))}
            </div>

            {form.coverMode === "custom" && (
              <label className="mb-5 flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-white/20 p-5 transition hover:bg-white/5">
                {uploading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <UploadCloud className="h-5 w-5" />
                )}
                <span>
                  {uploading
                    ? "Uploading Cover..."
                    : "Choose Cover from Laptop"}
                </span>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={uploading || saving}
                  onChange={uploadCover}
                  className="hidden"
                />
              </label>
            )}

            {coverUrl ? (
              <img
                src={coverUrl}
                alt="Video cover preview"
                className="max-h-96 w-full rounded-2xl border border-white/10 bg-neutral-900 object-contain"
              />
            ) : (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-8 text-center text-sm text-gray-500">
                {form.coverMode === "custom"
                  ? "Upload cover untuk melihat preview."
                  : "Thumbnail YouTube muncul setelah URL valid."}
              </div>
            )}
          </section>

          <div className="mt-8 grid gap-5 border-t border-white/10 pt-8 md:grid-cols-2">
            <Field label="Tags" wide>
              <input
                name="tags"
                value={form.tags}
                onChange={change}
                placeholder="Cinematic, Highlight, Documentary"
                className={inputClass}
              />
            </Field>

            <Field label="Short Description" wide>
              <textarea
                name="shortDescription"
                rows={3}
                value={form.shortDescription}
                onChange={change}
                className={inputClass}
              />
            </Field>

            <Field label="Description" wide>
              <textarea
                name="description"
                rows={5}
                value={form.description}
                onChange={change}
                className={inputClass}
              />
            </Field>

            <Field label="SEO Title" wide>
              <input
                name="seoTitle"
                value={form.seoTitle}
                onChange={change}
                className={inputClass}
              />
            </Field>

            <Field label="SEO Description" wide>
              <textarea
                name="seoDescription"
                rows={3}
                value={form.seoDescription}
                onChange={change}
                className={inputClass}
              />
            </Field>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link
              to="/projects/video"
              className="rounded-full border border-white/10 px-6 py-3 text-center font-semibold text-white hover:bg-white/10"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving || uploading}
              className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-200 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Save className="h-5 w-5" />
              )}

              {saving
                ? "Saving..."
                : isEdit
                  ? "Save Changes"
                  : "Create Video"}
            </button>
          </div>
        </form>
      </motion.div>
    </section>
  );
}
