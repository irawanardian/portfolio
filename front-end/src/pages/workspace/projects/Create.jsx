import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { apiRequest } from "../../../lib/api";
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
  year: "2026",
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

export default function CreateProject() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmation = await confirmSwal({
      title: "Create project?",
      text: "This project will be saved to your portfolio workspace.",
      confirmButtonText: "Yes, create",
      cancelButtonText: "Cancel",
    });

    if (!confirmation.isConfirmed) return;

    try {
      setLoading(true);
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
        title: "Creating project...",
        text: "Please wait while your project is being saved.",
      });

      await Promise.all([
        apiRequest("/api/projects", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }),
        wait(1000),
      ]);

      await closeSwal();

      await successSwal({
        title: "Project created",
        text: "Your project has been created successfully.",
      });

      navigate("/projects");
    } catch (error) {
      await closeSwal();

      const message = error.message || "Failed to create project.";
      setErrorMessage(message);

      await errorSwal({
        title: "Create failed",
        text: message,
      });
    } finally {
      setLoading(false);
    }
  };

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
            New Project
          </p>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl xl:text-5xl">
            Create portfolio project.
          </h1>

          <p className="mt-4 max-w-2xl text-gray-400">
            Add a new digital work, photo story, or motion work into your
            portfolio database.
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
              placeholder="leave empty to auto-generate"
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
              <FormField
                label="Cover Image URL"
                name="coverImage"
                value={form.coverImage}
                onChange={handleChange}
                placeholder="https://..."
              />
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

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link
              to="/projects"
              className="inline-flex items-center justify-center rounded-full border border-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:scale-105 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Save Project
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