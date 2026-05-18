import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Image as ImageIcon,
  Loader2,
  Plus,
  Save,
  Star,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { apiRequest, API_BASE_URL } from "../../../lib/api";
import { getToken } from "../../../lib/auth";
import {
  confirmSwal,
  loadingSwal,
  successSwal,
  errorSwal,
  closeSwal,
} from "../../../lib/swal";

const initialForm = {
  title: "",
  slug: "",
  category: "digital",
  year: "",
  status: "draft",
  shortDescription: "",
  description: "",
  coverImage: "",
  externalUrl: "",
  videoEmbed: "",
  seoTitle: "",
  seoDescription: "",
  sortOrder: "0",
  tags: "",
};

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [projectImages, setProjectImages] = useState([]);
const [imageForm, setImageForm] = useState({
  imageUrl: "",
  caption: "",
  sortOrder: "0",
  imageType: "gallery",
});
  const [imageSaving, setImageSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const token = getToken();

        if (!token) {
          navigate("/login");
          return;
        }

        const result = await apiRequest(`/api/projects/workspace/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const project = result.data;

        setForm({
          title: project.title || "",
          slug: project.slug || "",
          category: project.category || "digital",
          year: project.year || "",
          status: project.status || "draft",
          shortDescription: project.shortDescription || "",
          description: project.description || "",
          coverImage: project.coverImage || "",
          externalUrl: project.externalUrl || "",
          videoEmbed: project.videoEmbed || "",
          seoTitle: project.seo?.title || "",
          seoDescription: project.seo?.description || "",
          sortOrder: String(project.sortOrder || 0),
          tags: Array.isArray(project.tags) ? project.tags.join(", ") : "",
        });
        setProjectImages(Array.isArray(project.images) ? project.images : []);
      } catch (error) {
        setErrorMessage(error.message || "Failed to load project.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, navigate]);

  const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    const handleImageFormChange = (e) => {
  const { name, value } = e.target;

  setImageForm((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleAddImageByUrl = async () => {
  try {
    setImageSaving(true);

    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    if (!imageForm.imageUrl.trim()) {
      await errorSwal({
        title: "Image URL required",
        text: "Please enter an image URL first.",
      });
      return;
    }

    loadingSwal({
      title: "Adding image...",
      text: "Please wait while the image is being added.",
    });

    const result = await apiRequest(`/api/projects/${id}/images`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
  imageUrl: imageForm.imageUrl.trim(),
  caption: imageForm.caption,
  sortOrder: Number(imageForm.sortOrder) || 0,
  imageType: imageForm.imageType,
}),
    });

    await wait(700);
    await closeSwal();

    setProjectImages((prev) => [...prev, result.data]);

    setImageForm({
  imageUrl: "",
  caption: "",
  sortOrder: "0",
  imageType: "gallery",
});

    await successSwal({
      title: "Image added",
      text: "Project image has been added successfully.",
    });
  } catch (error) {
    await closeSwal();

    await errorSwal({
      title: "Add image failed",
      text: error.message || "Failed to add project image.",
    });
  } finally {
    setImageSaving(false);
  }
};

const handleUploadImage = async (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  try {
    setImageUploading(true);

    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    loadingSwal({
      title: "Uploading image...",
      text: "Please wait while the image is being uploaded.",
    });

    const uploadResponse = await fetch(`${API_BASE_URL}/api/uploads/projects`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const uploadResult = await uploadResponse.json();

    if (!uploadResponse.ok || !uploadResult.success) {
      throw new Error(uploadResult.message || "Upload failed");
    }

    const imageUrl = uploadResult.data.url;

    const result = await apiRequest(`/api/projects/${id}/images`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
  imageUrl,
  caption: "",
  sortOrder: projectImages.length + 1,
  imageType: imageForm.imageType,
}),
    });

    await wait(900);
    await closeSwal();

    setProjectImages((prev) => [...prev, result.data]);

    await successSwal({
      title: "Image uploaded",
      text: "The image has been uploaded and added to this project.",
    });

    e.target.value = "";
  } catch (error) {
    await closeSwal();

    await errorSwal({
      title: "Upload failed",
      text: error.message || "Failed to upload image.",
    });
  } finally {
    setImageUploading(false);
  }
};

const handleUploadCoverImage = async (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  try {
    setCoverUploading(true);

    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    loadingSwal({
      title: "Uploading cover...",
      text: "Please wait while the cover image is being uploaded.",
    });

    const uploadResponse = await fetch(`${API_BASE_URL}/api/uploads/projects`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const uploadResult = await uploadResponse.json();

    if (!uploadResponse.ok || !uploadResult.success) {
      throw new Error(uploadResult.message || "Cover upload failed");
    }

    await wait(900);
    await closeSwal();

    setForm((prev) => ({
      ...prev,
      coverImage: uploadResult.data.url,
    }));

    await successSwal({
      title: "Cover uploaded",
      text: "Cover Image URL has been filled automatically. Don’t forget to save changes.",
    });

    e.target.value = "";
  } catch (error) {
    await closeSwal();

    await errorSwal({
      title: "Upload failed",
      text: error.message || "Failed to upload cover image.",
    });
  } finally {
    setCoverUploading(false);
  }
};

const handleDeleteImage = async (image) => {
  const confirmation = await confirmSwal({
    title: "Delete image?",
    text: "This image will be removed from this project.",
    confirmButtonText: "Yes, delete",
    cancelButtonText: "Cancel",
    icon: "warning",
  });

  if (!confirmation.isConfirmed) return;

  try {
    const token = getToken();

    loadingSwal({
      title: "Deleting image...",
      text: "Please wait while the image is being removed.",
    });

    await Promise.all([
      apiRequest(`/api/projects/${id}/images/${image.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      wait(700),
    ]);

    await closeSwal();

    setProjectImages((prev) => prev.filter((item) => item.id !== image.id));

    await successSwal({
      title: "Image deleted",
      text: "The image has been removed from this project.",
    });
  } catch (error) {
    await closeSwal();

    await errorSwal({
      title: "Delete failed",
      text: error.message || "Failed to delete image.",
    });
  }
};

const handleUseAsCover = (imageUrl) => {
  setForm((prev) => ({
    ...prev,
    coverImage: imageUrl,
  }));
};

    const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmation = await confirmSwal({
        title: "Save changes?",
        text: "This project will be updated with the latest data.",
        confirmButtonText: "Yes, save",
        cancelButtonText: "Cancel",
    });

    if (!confirmation.isConfirmed) return;

    try {
        setSaving(true);
        setErrorMessage("");

        const token = getToken();

        if (!token) {
        navigate("/login");
        return;
        }

        const payload = {
        title: form.title,
        slug: form.slug,
        category: form.category,
        year: form.year,
        status: form.status,
        shortDescription: form.shortDescription,
        description: form.description,
        coverImage: form.coverImage,
        externalUrl: form.externalUrl,
        videoEmbed: form.videoEmbed,
        seoTitle: form.seoTitle,
        seoDescription: form.seoDescription,
        sortOrder: Number(form.sortOrder) || 0,
        tags: form.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        };

        loadingSwal({
  title: "Saving project...",
  text: "Please wait while your changes are being saved.",
});

await Promise.all([
  apiRequest(`/api/projects/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  }),
  wait(1000),
]);

await closeSwal();

        await successSwal({
        title: "Project updated",
        text: "Your project has been updated successfully.",
        });

        navigate("/projects");
    } catch (error) {
        await closeSwal();

        const message = error.message || "Failed to update project.";
        setErrorMessage(message);

        await errorSwal({
        title: "Update failed",
        text: message,
        });
    } finally {
        setSaving(false);
    }
    };

  if (loading) {
    return (
      <section className="px-6 py-10 lg:px-10 lg:py-12">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-gray-400" />
          <p className="text-gray-400">Loading project...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-10 lg:px-10 lg:py-12">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-5xl"
      >
        <Link
          to="/projects"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        <div className="mb-10">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-gray-500">
            Edit Project
          </p>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl xl:text-5xl">
            Update portfolio project.
          </h1>

          <p className="mt-4 max-w-2xl text-gray-400">
            Edit project details, status, SEO data, and portfolio metadata.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8"
        >
          {errorMessage && (
            <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormField
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Project title"
              required
            />

            <FormField
              label="Slug"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="project-slug"
            />

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-white outline-none transition focus:border-white/40"
              >
                <option className="bg-neutral-900" value="digital">
                  Digital
                </option>
                <option className="bg-neutral-900" value="photo">
                  Photo
                </option>
                <option className="bg-neutral-900" value="video">
                  Video
                </option>
              </select>
            </div>

            <FormField
              label="Year"
              name="year"
              value={form.year}
              onChange={handleChange}
              placeholder="2026"
            />

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-white outline-none transition focus:border-white/40"
              >
                <option className="bg-neutral-900" value="draft">
                  Draft
                </option>
                <option className="bg-neutral-900" value="published">
                  Published
                </option>
              </select>
            </div>

            <FormField
              label="Sort Order"
              name="sortOrder"
              type="number"
              value={form.sortOrder}
              onChange={handleChange}
              placeholder="0"
            />

            <FormField
              label="External URL"
              name="externalUrl"
              value={form.externalUrl}
              onChange={handleChange}
              placeholder="https://example.com"
            />

            <FormField
              label="Video Embed URL"
              name="videoEmbed"
              value={form.videoEmbed}
              onChange={handleChange}
              placeholder="YouTube / Drive embed URL"
            />

            <div className="md:col-span-2">
  <label className="mb-2 block text-sm text-gray-400">
    Cover Image URL
  </label>

  <div className="flex flex-col gap-3 lg:flex-row">
    <input
      name="coverImage"
      value={form.coverImage}
      onChange={handleChange}
      placeholder="https://..."
      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-white outline-none transition placeholder:text-gray-600 focus:border-white/40"
    />

    <label className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-3 rounded-2xl border border-white/10 px-5 py-4 font-semibold text-white transition hover:bg-white/10">
      {coverUploading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Uploading...
        </>
      ) : (
        <>
          <UploadCloud className="h-5 w-5" />
          Upload Cover
        </>
      )}

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleUploadCoverImage}
        disabled={coverUploading}
      />
    </label>
  </div>

  <p className="mt-2 text-xs text-gray-500">
    Used as the main project thumbnail and public card cover.
  </p>

  {form.coverImage && (
    <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-neutral-900">
      <img
        src={form.coverImage}
        alt="Cover preview"
        className="aspect-video w-full object-cover"
      />
    </div>
  )}
</div>

            <div className="md:col-span-2">
              <FormField
                label="Tags"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="Website, Brand, Responsive"
              />
            </div>

            <div className="md:col-span-2">
              <TextAreaField
                label="Short Description"
                name="shortDescription"
                value={form.shortDescription}
                onChange={handleChange}
                placeholder="Short summary for project cards"
                rows={3}
              />
            </div>

            <div className="md:col-span-2">
              <TextAreaField
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Longer project description"
                rows={6}
              />
            </div>

            <div className="md:col-span-2">
              <FormField
                label="SEO Title"
                name="seoTitle"
                value={form.seoTitle}
                onChange={handleChange}
                placeholder="SEO title, optional"
              />
            </div>

            <div className="md:col-span-2">
              <TextAreaField
                label="SEO Description"
                name="seoDescription"
                value={form.seoDescription}
                onChange={handleChange}
                placeholder="SEO description, optional"
                rows={3}
              />
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-8">
                <div className="mb-6">
                    <p className="mb-2 text-sm uppercase tracking-[0.3em] text-gray-500">
                    Project Gallery
                    </p>
                    <h2 className="text-2xl font-bold text-white">Cover & Gallery Images.</h2>
                    <p className="mt-2 text-sm text-gray-400">
                    Add images by URL or upload files. You can use any image as the main cover.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    <div className="md:col-span-2">
  <FormField
    label="Image URL"
    name="imageUrl"
    value={imageForm.imageUrl}
    onChange={handleImageFormChange}
    placeholder="https://... or uploaded image URL"
  />
</div>

<FormField
  label="Sort Order"
  name="sortOrder"
  type="number"
  value={imageForm.sortOrder}
  onChange={handleImageFormChange}
  placeholder="0"
/>

<div>
  <label className="mb-2 block text-sm text-gray-400">
    Image Type
  </label>
  <select
    name="imageType"
    value={imageForm.imageType}
    onChange={handleImageFormChange}
    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-white outline-none transition focus:border-white/40"
  >
    <option className="bg-neutral-900" value="gallery">
      Gallery
    </option>
    <option className="bg-neutral-900" value="cover_slider">
      Cover Slider
    </option>
  </select>
</div>

<div className="md:col-span-2">
  <FormField
    label="Caption"
    name="caption"
    value={imageForm.caption}
    onChange={handleImageFormChange}
    placeholder="Optional caption"
  />
</div>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <button
                    type="button"
                    onClick={handleAddImageByUrl}
                    disabled={imageSaving}
                    className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:scale-105 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                    {imageSaving ? (
                        <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Adding...
                        </>
                    ) : (
                        <>
                        <Plus className="h-5 w-5" />
                        Add Image URL
                        </>
                    )}
                    </button>

                    <label className="inline-flex cursor-pointer items-center justify-center gap-3 rounded-full border border-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
                    {imageUploading ? (
                        <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Uploading...
                        </>
                    ) : (
                        <>
                        <UploadCloud className="h-5 w-5" />
                        Upload Image
                        </>
                    )}

                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleUploadImage}
                        disabled={imageUploading}
                    />
                    </label>
                </div>

                {projectImages.length === 0 ? (
                    <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-8 text-center">
                    <ImageIcon className="mx-auto mb-3 h-10 w-10 text-gray-500" />
                    <p className="text-sm text-gray-400">No Project Gallery yet.</p>
                    </div>
                ) : (
                    <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {projectImages.map((image) => (
                        <div
                        key={image.id}
                        className="overflow-hidden rounded-3xl border border-white/10 bg-black/20"
                        >
                        <div className="aspect-video overflow-hidden bg-neutral-900">
                            <img
                            src={image.imageUrl}
                            alt={image.caption || "Project image"}
                            className="h-full w-full object-cover"
                            />
                        </div>

                        <div className="p-4">
                         <div className="mb-3 flex items-start justify-between gap-3">
                            <p className="line-clamp-2 text-sm text-gray-400">
                                {image.caption || image.imageUrl}
                            </p>

                            <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-gray-400">
                                {image.imageType === "cover_slider" ? "Cover" : "Gallery"}
                            </span>
                         </div>

                            <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => handleUseAsCover(image.imageUrl)}
                                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
                            >
                                <Star className="h-4 w-4" />
                                Set as Cover URL
                            </button>

                            <button
                                type="button"
                                onClick={() => handleDeleteImage(image)}
                                className="inline-flex items-center gap-2 rounded-full border border-red-500/20 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/10"
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete
                            </button>
                            </div>
                        </div>
                        </div>
                    ))}
                    </div>
                )}
                </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link
              to="/projects"
              className="inline-flex items-center justify-center rounded-full border border-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:scale-105 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </section>
  );
}

function FormField({ label, ...props }) {
  return (
    <div>
      <label className="mb-2 block text-sm text-gray-400">{label}</label>
      <input
        {...props}
        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-white outline-none transition placeholder:text-gray-600 focus:border-white/40"
      />
    </div>
  );
}

function TextAreaField({ label, ...props }) {
  return (
    <div>
      <label className="mb-2 block text-sm text-gray-400">{label}</label>
      <textarea
        {...props}
        className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-white outline-none transition placeholder:text-gray-600 focus:border-white/40"
      />
    </div>
  );
}