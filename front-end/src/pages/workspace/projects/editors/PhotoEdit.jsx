import PhotoAlbumFields from "../components/PhotoAlbumFields";
import PhotoAlbumCover from "../components/PhotoAlbumCover";
import PhotoCaptionEditor from "../../../../components/workspace/PhotoCaptionEditor";
import BulkPhotoUpload from "../../../../components/workspace/BulkPhotoUpload";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Image as ImageIcon,
  Loader2,
  Save,
  Star,
  Trash2,
} from "lucide-react";
import { apiRequest, API_BASE_URL } from "../../../../lib/api";
import { getToken } from "../../../../lib/auth";
import {
  confirmSwal,
  loadingSwal,
  successSwal,
  errorSwal,
  closeSwal,
} from "../../../../lib/swal";

const PHOTO_CATEGORIES = ["Wedding", "Prewedding", "Engagement", "Portrait", "Event", "Product", "Landscape", "Street", "Corporate"];

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
  const projectsBackUrl =
    form.category === "photo"
      ? "/projects/foto"
      : form.category === "video"
        ? "/projects/video"
        : "/projects/web";


  const [projectImages, setProjectImages] = useState([]);
  const [orderDirty, setOrderDirty] = useState(false);
  const [orderSaving, setOrderSaving] = useState(false);
  const [draggedImageId, setDraggedImageId] = useState(null);

  const [coverUploading, setCoverUploading] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);

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
        setProjectImages(
          Array.isArray(project.images)
            ? [...project.images].sort(
                (a, b) =>
                  Number(a.sortOrder || 0) -
                    Number(b.sortOrder || 0) ||
                  Number(a.id) - Number(b.id)
              )
            : []
        );
        setOrderDirty(false);
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

    const uploadedPath = uploadResult.data?.path;

    if (
      typeof uploadedPath !== "string" ||
      !uploadedPath.startsWith("/uploads/projects/")
    ) {
      throw new Error("Invalid cover path returned by server");
    }

    const uploadedCover =
      `https://portfolio-api.ambulancegema.com${uploadedPath}`;

    await apiRequest(`/api/projects/${id}/cover`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ coverImage: uploadedCover }),
    });

    setForm((prev) => ({
      ...prev,
      coverImage: uploadedCover,
    }));

    await successSwal({
      title: "Cover saved",
      text: "Album cover uploaded and saved automatically.",
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


const reorderPhotos = (sourceId, targetId) => {
  if (sourceId === targetId || orderSaving) return;

  setProjectImages((previous) => {
    const items = [...previous];
    const from = items.findIndex((item) => item.id === sourceId);
    const to = items.findIndex((item) => item.id === targetId);

    if (from < 0 || to < 0) return previous;

    const [moved] = items.splice(from, 1);
    items.splice(to, 0, moved);
    return items;
  });

  setOrderDirty(true);
};

const movePhoto = (imageId, direction) => {
  if (orderSaving) return;

  setProjectImages((previous) => {
    const items = [...previous];
    const from = items.findIndex((item) => item.id === imageId);
    const to = from + direction;

    if (from < 0 || to < 0 || to >= items.length) {
      return previous;
    }

    [items[from], items[to]] = [items[to], items[from]];
    return items;
  });

  setOrderDirty(true);
};

const handleSavePhotoOrder = async () => {
  if (!orderDirty || orderSaving) return;

  setOrderSaving(true);

  try {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    await apiRequest(`/api/projects/${id}/images/reorder`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        imageIds: projectImages.map((image) => image.id),
      }),
    });

    setProjectImages((previous) =>
      previous.map((image, index) => ({
        ...image,
        sortOrder: index + 1,
      }))
    );

    setOrderDirty(false);

    await successSwal({
      title: "Photo order saved",
      text: "Your gallery order has been updated.",
    });
  } catch (error) {
    await errorSwal({
      title: "Unable to save order",
      text: error.message || "Please try again.",
    });
  } finally {
    setOrderSaving(false);
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

const handleUseAsCover = async (imageUrl) => {
  if (coverUploading || saving) return;

  setCoverUploading(true);

  try {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    await apiRequest(`/api/projects/${id}/cover`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ coverImage: imageUrl }),
    });

    setForm((prev) => ({
      ...prev,
      coverImage: imageUrl,
    }));

    await successSwal({
      title: "Cover updated",
      text: "Gallery photo is now the album cover.",
    });
  } catch (error) {
    await errorSwal({
      title: "Unable to update cover",
      text: error.message || "Please try again.",
    });
  } finally {
    setCoverUploading(false);
  }
};

    const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving || photoUploading || coverUploading) {
      setErrorMessage("Wait until uploads finish before saving.");
      return;
    }

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

        navigate(projectsBackUrl);
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
          to={projectsBackUrl}
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
            Edit Photo Album.
          </h1>

          <p className="mt-4 max-w-2xl text-gray-400">
            Manage album information, cover, gallery photos, and captions.
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

          <PhotoAlbumFields
            form={form}
            photoCategory={
              form.tags
                .split(",")
                .map((tag) => tag.trim())
                .find((tag) =>
                  PHOTO_CATEGORIES.some(
                    (category) =>
                      category.toLowerCase() === tag.toLowerCase()
                  )
                ) || ""
            }
            onChange={handleChange}
            onCategoryChange={(value) => {
              setForm((prev) => {
                const otherTags = prev.tags
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(
                    (tag) =>
                      tag &&
                      !PHOTO_CATEGORIES.some(
                        (category) =>
                          category.toLowerCase() === tag.toLowerCase()
                      )
                  );

                return {
                  ...prev,
                  tags: [value, ...otherTags].filter(Boolean).join(", "),
                };
              });
            }}
          />

          <PhotoAlbumCover
            coverUrl={form.coverImage}
            uploading={coverUploading}
            onSelect={handleUploadCoverImage}
          />

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


                {form.category === "photo" && (
                  <BulkPhotoUpload
                    projectId={id}
                    existingCount={projectImages.length}
                    onUploadingChange={setPhotoUploading}
                    onImagesAdded={(images) =>
                      setProjectImages((prev) => [...prev, ...images])
                    }
                  />
                )}

                {form.category === "photo" &&
                  projectImages.length > 1 && (
                    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-5">
                      <div>
                        <h3 className="font-semibold text-white">
                          Arrange Photo Order
                        </h3>
                        <p className="mt-1 text-sm text-gray-400">
                          Drag photos or use the arrow buttons.
                        </p>
                        {orderDirty && (
                          <p className="mt-2 text-xs text-amber-300">
                            Unsaved order changes
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={handleSavePhotoOrder}
                        disabled={!orderDirty || orderSaving}
                        className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {orderSaving ? "Saving..." : "Save Photo Order"}
                      </button>
                    </div>
                  )}

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
                        draggable={form.category === "photo" && !orderSaving}
                        onDragStart={(event) => {
                          if (form.category !== "photo") return;
                          setDraggedImageId(image.id);
                          event.dataTransfer.effectAllowed = "move";
                        }}
                        onDragOver={(event) => {
                          if (form.category === "photo") {
                            event.preventDefault();
                          }
                        }}
                        onDrop={(event) => {
                          if (form.category !== "photo") return;
                          event.preventDefault();
                          if (draggedImageId !== null) {
                            reorderPhotos(draggedImageId, image.id);
                          }
                          setDraggedImageId(null);
                        }}
                        onDragEnd={() => setDraggedImageId(null)}
                        className={`overflow-hidden rounded-3xl border border-white/10 bg-black/20 ${
                          form.category === "photo"
                            ? "cursor-grab active:cursor-grabbing"
                            : ""
                        }`}
                        >
                        <div className="aspect-video overflow-hidden bg-neutral-900">
                            <img
                            src={image.imageUrl}
                            alt={image.caption || "Project image"}
                            className="h-full w-full object-cover"
                            />
                        </div>

                        <div className="p-4">
                          {form.category === "photo" && (
                            <PhotoCaptionEditor
                              projectId={id}
                              image={image}
                              onSaved={(imageId, caption) => {
                                setProjectImages((previous) =>
                                  previous.map((item) =>
                                    item.id === imageId
                                      ? { ...item, caption }
                                      : item
                                  )
                                );
                              }}
                            />
                          )}
                         <div className="mb-3 flex items-start justify-between gap-3">
                            <p className="line-clamp-2 text-sm text-gray-400">
                                {image.caption || image.imageUrl}
                            </p>

                            <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-gray-400">
                                {image.imageType === "cover_slider" ? "Cover" : "Gallery"}
                            </span>
                         </div>

                            {form.category === "photo" && (
                              <div className="mb-3 flex items-center gap-3">
                                <span className="text-xs text-gray-400">
                                  Position {projectImages.findIndex(
                                    (item) => item.id === image.id
                                  ) + 1}
                                </span>
                                <button
                                  type="button"
                                  disabled={orderSaving || projectImages[0]?.id === image.id}
                                  onClick={() => movePhoto(image.id, -1)}
                                  className="rounded-full border border-white/20 px-3 py-1 text-xs disabled:opacity-30"
                                  aria-label="Move image earlier"
                                >
                                  ↑
                                </button>
                                <button
                                  type="button"
                                  disabled={orderSaving || projectImages[projectImages.length - 1]?.id === image.id}
                                  onClick={() => movePhoto(image.id, 1)}
                                  className="rounded-full border border-white/20 px-3 py-1 text-xs disabled:opacity-30"
                                  aria-label="Move image later"
                                >
                                  ↓
                                </button>
                              </div>
                            )}

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
              to={projectsBackUrl}
              className="inline-flex items-center justify-center rounded-full border border-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving || photoUploading || coverUploading}
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
