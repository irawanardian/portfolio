import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Edit3,
  FolderKanban,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";

import { apiRequest } from "../../../lib/api";
import { getToken } from "../../../lib/auth";
import {
  confirmSwal,
  loadingSwal,
  successSwal,
  errorSwal,
  closeSwal,
} from "../../../lib/swal";

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const token = getToken();

      const result = await apiRequest("/api/projects/workspace/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProjects(result.data || []);
    } catch (error) {
      setErrorMessage(error.message || "Unable to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDeleteProject = async (project) => {
    const confirmation = await confirmSwal({
      title: "Delete project?",
      text: `"${project.title}" will be permanently deleted. This action cannot be undone.`,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      icon: "warning",
    });

    if (!confirmation.isConfirmed) return;

    try {
      const token = getToken();

      loadingSwal({
        title: "Deleting project...",
        text: "Please wait while this project is being deleted.",
      });

      await Promise.all([
        apiRequest(`/api/projects/${project.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        wait(1000),
      ]);

      await closeSwal();

      await successSwal({
        title: "Project deleted",
        text: "The project has been deleted successfully.",
      });

      await fetchProjects();
    } catch (error) {
      await closeSwal();

      await errorSwal({
        title: "Delete failed",
        text: error.message || "Failed to delete project.",
      });
    }
  };

  const filteredProjects =
  statusFilter === "all"
    ? projects
    : projects.filter((project) => project.status === statusFilter);

  return (
    <section className="px-6 py-10 lg:px-10 lg:py-12">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mb-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between"
      >
        <div>
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-gray-500">
            Projects
          </p>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl xl:text-5xl">
            Manage portfolio projects.
          </h1>

          <p className="mt-4 max-w-2xl text-gray-400">
            View and manage digital works, photo stories, and motion works
            stored in the portfolio database.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex rounded-full border border-white/10 bg-white/[0.04] p-1">
            {[
              { label: "All", value: "all" },
              { label: "Published", value: "published" },
              { label: "Draft", value: "draft" },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setStatusFilter(item.value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  statusFilter === item.value
                    ? "bg-white text-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <Link
            to="/projects/create"
            className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:scale-105 hover:bg-gray-200"
          >
            <Plus className="h-5 w-5" />
            New Project
          </Link>
        </div>
      </motion.div>

      {loading && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-gray-400" />
          <p className="text-gray-400">Loading projects...</p>
        </div>
      )}

      {!loading && errorMessage && (
        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-red-200">
          {errorMessage}
        </div>
      )}

      {!loading && !errorMessage && filteredProjects.length === 0 && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
          <FolderKanban className="mx-auto mb-4 h-10 w-10 text-gray-500" />
          <p className="text-gray-400">
            {statusFilter === "all"
              ? "No projects found."
              : `No ${statusFilter} projects found.`}
          </p>
        </div>
      )}

      {!loading && !errorMessage && filteredProjects.length > 0 && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id || project.slug}
              project={project}
              index={index}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function ProjectCard({ project, index, onDelete }) {
  const tags = Array.isArray(project.tags) ? project.tags : [];

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:bg-white/[0.07]"
    >
      <div className="mb-6 flex items-start justify-between gap-5">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-gray-500">
            {project.category || "Project"}
          </p>

          <h2 className="text-2xl font-bold text-white">{project.title}</h2>

          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-400">
            {project.shortDescription || project.description}
          </p>
        </div>

        <span className="shrink-0 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.2em] text-gray-400">
          {project.status || "draft"}
        </span>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-gray-300"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm text-gray-500">/{project.slug}</span>

        <div className="flex items-center gap-4">
          <Link
            to={`/projects/${project.id}/edit`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-gray-300"
          >
            Edit
            <Edit3 className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={() => onDelete(project)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-red-300 transition hover:text-red-200"
          >
            Delete
            <Trash2 className="h-4 w-4" />
          </button>

          {project.externalUrl && (
            <a
              href={project.externalUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-gray-300"
            >
              Visit
              <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}