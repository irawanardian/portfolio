import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, Loader2, Save, Trash2, UploadCloud } from "lucide-react";
import { apiRequest, API_BASE_URL } from "../../../lib/api";
import { getToken } from "../../../lib/auth";
import BulkPhotoUpload from "../../../components/workspace/BulkPhotoUpload";

const PUBLIC_API = (
  import.meta.env.VITE_PUBLIC_API_BASE_URL ||
  "https://portfolio-api.ambulancegema.com"
).replace(/\/+$/, "");

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-white/40";

const emptyForm = {
  title: "", slug: "", category: "digital",
  year: String(new Date().getFullYear()),
  status: "draft", sortOrder: "0",
  externalUrl: "", shortDescription: "",
  description: "", tags: "",
  seoTitle: "", seoDescription: "",
  coverImage: "", videoEmbed: ""
};

function Field({ label, children, wide = false }) {
  return (
    <div className={wide ? "md:col-span-2" : ""}>
      <label className="mb-2 block text-sm text-gray-400">{label}</label>
      {children}
    </div>
  );
}

function payload(form, status = form.status) {
  return {
    ...form,
    category: "digital",
    status,
    title: form.title.trim(),
    slug: form.slug.trim(),
    sortOrder: Number(form.sortOrder) || 0,
    tags: form.tags.split(",").map(t => t.trim()).filter(Boolean)
  };
}

function websiteUrl(value) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

export default function WebProjectEditor({ mode = "create" }) {
  const isEdit = mode === "edit";
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [projectId, setProjectId] = useState(isEdit ? id : null);
  const idRef = useRef(isEdit ? id : null);
  const draftRef = useRef(null);

  const [loading, setLoading] = useState(isEdit);
  const [drafting, setDrafting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [orderDirty, setOrderDirty] = useState(false);
  const [orderSaving, setOrderSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const busy = loading || drafting || saving || coverUploading ||
    galleryUploading || orderSaving || deletingId !== null;

  useEffect(() => {
    if (!isEdit) return;
    let active = true;

    (async () => {
      try {
        const token = getToken();
        if (!token) throw new Error("Please log in again.");

        const result = await apiRequest(
          `/api/projects/workspace/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!active) return;
        const p = result.data;
        if (p.category !== "digital") throw new Error("Not a Web project.");

        setForm({
          title: p.title || "",
          slug: p.slug || "",
          category: "digital",
          year: String(p.year || ""),
          status: p.status || "draft",
          sortOrder: String(p.sortOrder ?? 0),
          externalUrl: p.externalUrl || "",
          shortDescription: p.shortDescription || "",
          description: p.description || "",
          tags: Array.isArray(p.tags) ? p.tags.join(", ") : "",
          seoTitle: p.seo?.title || "",
          seoDescription: p.seo?.description || "",
          coverImage: p.coverImage || "",
          videoEmbed: p.videoEmbed || ""
        });

        setImages(
          Array.isArray(p.images)
            ? [...p.images].sort((a, b) =>
                Number(a.sortOrder || 0) - Number(b.sortOrder || 0)
              )
            : []
        );
      } catch (e) {
        if (active) setError(e.message || "Unable to load project.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => { active = false; };
  }, [id, isEdit]);

  function change(event) {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function ensureDraft() {
    if (idRef.current) return idRef.current;
    if (draftRef.current) return draftRef.current;
    if (!form.title.trim()) {
      throw new Error("Isi Project Title sebelum upload gambar.");
    }

    const token = getToken();
    if (!token) throw new Error("Session expired.");

    setDrafting(true);
    const promise = (async () => {
      const result = await apiRequest("/api/projects", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload(form, "draft"))
      });
      const nextId = result.data?.id;
      if (!nextId) throw new Error("Draft ID tidak tersedia.");
      idRef.current = nextId;
      setProjectId(nextId);
      setNotice(`Draft #${nextId} dibuat. Gambar langsung tersimpan.`);
      return nextId;
    })();

    draftRef.current = promise;
    try {
      return await promise;
    } finally {
      draftRef.current = null;
      setDrafting(false);
    }
  }

  async function uploadCover(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || busy) return;

    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      setError("Cover harus JPG, PNG, atau WebP, maksimal 5 MB.");
      return;
    }

    setCoverUploading(true);
    setError("");
    try {
      const targetId = await ensureDraft();
      const token = getToken();
      const data = new FormData();
      data.append("image", file);

      const response = await fetch(`${API_BASE_URL}/api/uploads/projects`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Cover upload failed.");
      }

      const path = result.data?.path;
      if (
        typeof path !== "string" ||
        !/^\/uploads\/projects\/[^/]+$/.test(path)
      ) {
        throw new Error("Invalid cover path.");
      }

      const url = `${PUBLIC_API}${path}`;

      // Preserve any edited metadata; update only the cover in DB.
      await apiRequest(`/api/projects/${targetId}/cover`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ coverImage: url })
      });

      setForm(prev => ({ ...prev, coverImage: url }));
      setNotice("Cover uploaded and saved.");
    } catch (e) {
      setError(e.message || "Cover upload failed.");
    } finally {
      setCoverUploading(false);
    }
  }

  async function save(event) {
    event.preventDefault();
    if (busy) {
      setError("Tunggu proses upload selesai.");
      return;
    }
    if (!form.title.trim()) {
      setError("Project Title wajib diisi.");
      return;
    }
    if (form.externalUrl.trim() && !websiteUrl(form.externalUrl.trim())) {
      setError("Website URL harus diawali https:// atau http://");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const token = getToken();
      if (!token) throw new Error("Session expired.");

      const existingId = idRef.current;
      const targetId = existingId || await ensureDraft();

      await apiRequest(`/api/projects/${targetId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload(form))
      });

      navigate("/projects/web");
    } catch (e) {
      setError(e.message || "Unable to save project.");
    } finally {
      setSaving(false);
    }
  }

  function moveImage(index, direction) {
    if (busy) return;
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    setImages(prev => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setOrderDirty(true);
  }

  async function saveOrder() {
    if (!projectId || busy || !orderDirty) return;
    setOrderSaving(true);
    setError("");
    try {
      await apiRequest(`/api/projects/${projectId}/images/reorder`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ imageIds: images.map(img => img.id) })
      });
      setOrderDirty(false);
      setNotice("Screenshot order saved.");
    } catch (e) {
      setError(e.message || "Failed to save screenshot order.");
    } finally {
      setOrderSaving(false);
    }
  }

  async function deleteImage(imageId) {
    if (!projectId || busy || !window.confirm("Delete this screenshot?")) return;
    setDeletingId(imageId);
    setError("");
    try {
      await apiRequest(`/api/projects/${projectId}/images/${imageId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setImages(prev => prev.filter(image => image.id !== imageId));
      setOrderDirty(false);
      setNotice("Screenshot deleted.");
    } catch (e) {
      setError(e.message || "Failed to delete screenshot.");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return <div className="p-12 text-gray-400">Loading Web Project...</div>;
  }

  return (
    <section className="px-6 py-10 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-5xl">
        <Link to="/projects/web" className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white">
          <ArrowLeft size={16} /> Back to Web Projects
        </Link>

        <h1 className="mb-3 text-3xl font-bold md:text-5xl">
          {isEdit ? "Edit Web Project." : "Create Web Project."}
        </h1>
        <p className="mb-8 text-gray-400">
          Kelola website, cover, screenshot, dan informasi portfolio.
        </p>

        <form onSubmit={save} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
          {error && <p className="mb-5 rounded-xl bg-red-500/10 p-4 text-sm text-red-300">{error}</p>}
          {notice && <p className="mb-5 rounded-xl bg-white/5 p-4 text-sm text-gray-300">{notice}</p>}

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Project Title">
              <input required name="title" value={form.title} onChange={change} className={inputClass} />
            </Field>
            <Field label="Slug">
              <input name="slug" value={form.slug} onChange={change} className={inputClass} placeholder="Auto-generated if empty" />
            </Field>
            <Field label="Year">
              <input name="year" value={form.year} onChange={change} className={inputClass} />
            </Field>
            <Field label="Status">
              <select name="status" value={form.status} onChange={change} className={inputClass}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </Field>
            <Field label="Sort Order">
              <input type="number" name="sortOrder" value={form.sortOrder} onChange={change} className={inputClass} />
            </Field>
            <Field label="Website URL" wide>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="url"
                  name="externalUrl"
                  value={form.externalUrl}
                  onChange={change}
                  placeholder="https://example.com"
                  className={inputClass}
                />
                {websiteUrl(form.externalUrl) && (
                  <a href={websiteUrl(form.externalUrl)} target="_blank" rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-white/20 px-5 py-3 text-sm text-white hover:bg-white/10">
                    <ExternalLink size={16} /> Visit Website
                  </a>
                )}
              </div>
            </Field>
          </div>

          <section className="mt-10 border-t border-white/10 pt-8">
            <h2 className="mb-5 text-2xl font-bold">Website Cover</h2>
            <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-white/20 p-6 hover:bg-white/5">
              {coverUploading ? <Loader2 className="animate-spin" /> : <UploadCloud />}
              {coverUploading ? "Uploading Cover..." : "Upload Cover from Laptop"}
              <input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy}
                onChange={uploadCover} className="hidden" />
            </label>
            {form.coverImage && (
              <img src={form.coverImage} alt="Website cover"
                className="mt-5 max-h-96 w-full rounded-2xl border border-white/10 bg-neutral-900 object-contain" />
            )}
          </section>

          <section className="mt-10 border-t border-white/10 pt-8">
            <BulkPhotoUpload
              projectId={projectId}
              ensureProjectId={ensureDraft}
              existingCount={images.length}
              onUploadingChange={setGalleryUploading}
              onImagesAdded={added => setImages(prev => [...prev, ...added])}
            />

            {images.length > 0 && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {images.map((image, index) => (
                  <div key={image.id} className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                    <img src={image.imageUrl} alt={`Screenshot ${index + 1}`}
                      className="aspect-video w-full object-cover" />
                    <div className="flex items-center justify-between gap-2 p-3">
                      <span className="text-xs text-gray-400">#{index + 1}</span>
                      <div className="flex gap-2">
                        <button type="button" disabled={busy || index === 0}
                          onClick={() => moveImage(index, -1)}
                          className="rounded-lg border border-white/20 px-2 py-1 disabled:opacity-30">↑</button>
                        <button type="button" disabled={busy || index === images.length - 1}
                          onClick={() => moveImage(index, 1)}
                          className="rounded-lg border border-white/20 px-2 py-1 disabled:opacity-30">↓</button>
                        <button type="button" disabled={busy}
                          onClick={() => deleteImage(image.id)}
                          className="rounded-lg border border-red-500/20 p-2 text-red-300 disabled:opacity-30">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {orderDirty && (
              <button type="button" onClick={saveOrder} disabled={busy}
                className="mt-5 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold hover:bg-white/10">
                Save Screenshot Order
              </button>
            )}
          </section>

          <div className="mt-10 grid gap-5 border-t border-white/10 pt-8 md:grid-cols-2">
            <Field label="Tags" wide>
              <input name="tags" value={form.tags} onChange={change} className={inputClass}
                placeholder="Website, Branding, Responsive" />
            </Field>
            <Field label="Short Description" wide>
              <textarea name="shortDescription" rows={3} value={form.shortDescription} onChange={change} className={inputClass} />
            </Field>
            <Field label="Description" wide>
              <textarea name="description" rows={5} value={form.description} onChange={change} className={inputClass} />
            </Field>
            <Field label="SEO Title" wide>
              <input name="seoTitle" value={form.seoTitle} onChange={change} className={inputClass} />
            </Field>
            <Field label="SEO Description" wide>
              <textarea name="seoDescription" rows={3} value={form.seoDescription} onChange={change} className={inputClass} />
            </Field>
          </div>

          <div className="mt-8 flex flex-col justify-end gap-3 sm:flex-row">
            <Link to="/projects/web" className="rounded-full border border-white/10 px-6 py-3 text-center hover:bg-white/10">Cancel</Link>
            <button type="submit" disabled={busy}
              className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-6 py-3 font-semibold text-black disabled:opacity-50">
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Web Project"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
