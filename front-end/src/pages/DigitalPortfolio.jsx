import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Code2,
  Globe2,
  Layers3,
  Loader2,
  MonitorSmartphone,
  Sparkles,
} from "lucide-react";
import { apiRequest } from "../lib/api";

export default function DigitalPortfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const result = await apiRequest("/api/projects");

        const digitalProjects = (result.data || []).filter(
          (project) => project.category === "digital"
        );

        setProjects(digitalProjects);
      } catch (error) {
        setErrorMessage(
          "Unable to load digital projects right now. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-28 text-white">
      <section className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <Link
            to="/portfolio"
            className="mb-10 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Portfolio
          </Link>

          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/10">
            <Code2 className="h-7 w-7 text-blue-300" />
          </div>

          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-gray-500">
            Digital Works
          </p>

          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tighter md:text-7xl">
            WEB PROJECTS <br />
            <span className="bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
              & DIGITAL SYSTEMS.
            </span>
          </h1>

          <p className="max-w-3xl text-lg leading-relaxed text-gray-400 md:text-xl">
            A selected collection of active websites, digital platforms, and web
            experiences shaped through interface design, technical structure,
            and real-world use.
          </p>
        </motion.div>

        {loading && <LoadingState />}

        {!loading && errorMessage && <ErrorState message={errorMessage} />}

        {!loading && !errorMessage && projects.length === 0 && <EmptyState />}

        {!loading && !errorMessage && projects.length > 0 && (
          <div className="mb-20 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.slug || project.id}
                project={project}
                index={index}
              />
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 md:p-10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            <InfoCard
              icon={<MonitorSmartphone className="h-5 w-5" />}
              title="Responsive Interface"
              desc="Built to work across desktop, tablet, and mobile screens."
            />

            <InfoCard
              icon={<Layers3 className="h-5 w-5" />}
              title="Real Project"
              desc="Not only concepts, but projects used in real digital environments."
            />

            <InfoCard
              icon={<Sparkles className="h-5 w-5" />}
              title="More Coming"
              desc="More case studies, screenshots, and project stories will be added soon."
            />
          </div>
        </motion.div>
      </section>
    </main>
  );
}

function ProjectCard({ project, index }) {
  const tags = Array.isArray(project.tags) ? project.tags : [];

  return (
    <motion.article
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.12 }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.08] md:p-8"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-transparent" />
      <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/5 blur-3xl transition-transform duration-700 group-hover:scale-125" />

      <div className="relative z-10 flex h-full flex-col">
        {project.coverImage && (
          <div className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-neutral-900">
            <img
              src={project.coverImage}
              alt={project.title}
              className="aspect-video w-full object-cover transition duration-700 group-hover:scale-105"
            />
          </div>
        )}

        <div className="flex min-h-[390px] flex-1 flex-col justify-between">
          <div>
            <div className="mb-8 flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-black/20 text-white">
                <Globe2 className="h-6 w-6" />
              </div>

              <span className="rounded-full border border-white/10 bg-black/20 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-gray-400">
                {project.year || "Active"}
              </span>
            </div>

            <p className="mb-3 text-sm uppercase tracking-[0.25em] text-gray-500">
              {project.category || "Digital Project"}
            </p>

            <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              {project.title}
            </h2>

            <p className="mb-6 line-clamp-2 leading-relaxed text-gray-400">
              {project.shortDescription || project.description}
            </p>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <span className="break-all text-sm text-gray-400">
              {project.externalUrl
                ? project.externalUrl.replace("https://", "")
                : project.slug}
            </span>

            <div className="flex flex-wrap gap-3">
              <Link
                to={`/portfolio/digital/${project.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
              >
                View Details
              </Link>

              {project.externalUrl && (
                <a
                  href={project.externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition-all hover:scale-105 hover:bg-gray-200"
                >
                  Visit Website
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function LoadingState() {
  return (
    <div className="mb-20 rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
      <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-gray-400" />
      <p className="text-gray-400">Loading digital projects...</p>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="mb-20 rounded-3xl border border-red-500/20 bg-red-500/10 p-10 text-center">
      <p className="text-red-200">{message}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mb-20 rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
      <p className="text-gray-400">No digital projects found.</p>
    </div>
  );
}

function InfoCard({ icon, title, desc }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
        {icon}
      </div>

      <h3 className="mb-2 font-semibold text-white">{title}</h3>

      <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
    </div>
  );
}