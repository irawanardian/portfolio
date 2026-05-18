import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Eye,
  Globe2,
  Image as ImageIcon,
  Layers3,
  Loader2,
  PlayCircle,
  Target,
  Trophy,
} from "lucide-react";
import { apiRequest } from "../lib/api";

export default function DigitalProjectDetail() {
  const { slug } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const result = await apiRequest(`/api/projects/${slug}`);
        setProject(result.data);
      } catch (error) {
        setErrorMessage("Unable to load this project right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  if (loading) {
    return <LoadingState />;
  }

  if (errorMessage || !project) {
    return <ErrorState message={errorMessage || "Project not found."} />;
  }

  const tags = Array.isArray(project.tags) ? project.tags : [];

  const galleryImages = Array.isArray(project.images)
    ? project.images.filter((image) => image.imageType !== "cover_slider")
    : [];

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-28 text-white">
      <section className="mx-auto max-w-7xl">
        <Link
          to="/portfolio/digital"
          className="mb-10 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Digital Works
        </Link>

        <HeroSection project={project} tags={tags} />

        <CaseStudySection project={project} tags={tags} />

        {project.videoEmbed && <ProjectVideo project={project} />}

        <ProjectGallery images={galleryImages} projectTitle={project.title} />
      </section>
    </main>
  );
}

function HeroSection({ project, tags }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="grid grid-cols-1 gap-10 lg:grid-cols-12"
    >
      <div className="lg:col-span-7">
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/10">
          <Globe2 className="h-7 w-7 text-blue-300" />
        </div>

        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-gray-500">
          {project.category || "Digital Project"}
        </p>

        <h1 className="mb-6 text-5xl font-bold tracking-tighter md:text-7xl">
          {project.title}
        </h1>

        <p className="max-w-3xl text-lg leading-relaxed text-gray-400">
          {project.description || project.shortDescription}
        </p>

        {tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-4">
          {project.externalUrl && (
            <a
              href={project.externalUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:scale-105 hover:bg-gray-200"
            >
              Visit Website
              <ArrowUpRight className="h-4 w-4" />
            </a>
          )}

          <Link
            to="/contact"
            className="inline-flex items-center gap-3 rounded-full border border-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Discuss Similar Project
          </Link>
        </div>
      </div>

      <aside className="lg:col-span-5">
        <ProjectSummaryCard project={project} />
      </aside>
    </motion.div>
  );
}

function ProjectSummaryCard({ project }) {
  return (
    <div className="sticky top-28 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      {project.coverImage ? (
        <div className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-neutral-900">
          <img
            src={project.coverImage}
            alt={project.title}
            className="aspect-video w-full object-cover"
          />
        </div>
      ) : (
        <div className="mb-6 flex aspect-video items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-gray-500">
          <ImageIcon className="h-8 w-8" />
        </div>
      )}

      <div className="space-y-4">
        <MetaItem
          icon={<Calendar className="h-5 w-5" />}
          label="Year"
          value={project.year || "Active"}
        />

        <MetaItem
          icon={<Eye className="h-5 w-5" />}
          label="Views"
          value={String(project.viewCount || 0)}
        />

        <MetaItem
          icon={<Globe2 className="h-5 w-5" />}
          label="Slug"
          value={`/${project.slug}`}
        />
      </div>
    </div>
  );
}

function CaseStudySection({ project, tags }) {
  const objectiveText =
    project.shortDescription ||
    "The objective of this project is to build a digital experience that is clear, useful, and aligned with the project identity.";

  const resultText =
    "The result is a digital project that can present information more clearly, improve online presence, and support a more structured user experience.";

  return (
    <section className="mt-20">
      <div className="mb-10">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gray-500">
          Case Study
        </p>

        <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
          Project breakdown.
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <CaseStudyCard
          icon={<Target className="h-6 w-6" />}
          label="Objective"
          title="Purpose & direction"
          desc={objectiveText}
        />

        <CaseStudyCard
          icon={<Layers3 className="h-6 w-6" />}
          label="Tech Stack"
          title="Tools & approach"
          customContent={
            tags.length > 0 ? (
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
            ) : (
              <p className="text-gray-400">
                Tech stack details will be added soon.
              </p>
            )
          }
        />

        <CaseStudyCard
          icon={<Trophy className="h-6 w-6" />}
          label="Result"
          title="Outcome"
          desc={resultText}
        />
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-emerald-300">
          <CheckCircle2 className="h-6 w-6" />
        </div>

        <p className="mb-3 text-sm uppercase tracking-[0.25em] text-gray-500">
          Summary
        </p>

        <h3 className="mb-4 text-2xl font-bold">Built for real-world use.</h3>

        <p className="max-w-4xl leading-relaxed text-gray-400">
          {project.description ||
            "This project is part of a growing digital portfolio focused on clean interfaces, useful workflows, and visual presentation that can support real operational needs."}
        </p>
      </div>
    </section>
  );
}

function CaseStudyCard({ icon, label, title, desc, customContent }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65 }}
      className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8"
    >
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
        {icon}
      </div>

      <p className="mb-3 text-sm uppercase tracking-[0.25em] text-gray-500">
        {label}
      </p>

      <h3 className="mb-4 text-2xl font-bold">{title}</h3>

      {customContent || <p className="leading-relaxed text-gray-400">{desc}</p>}
    </motion.article>
  );
}

function ProjectVideo({ project }) {
  return (
    <section className="mt-20">
      <div className="mb-6 flex items-center gap-3">
        <PlayCircle className="h-6 w-6 text-gray-400" />
        <h2 className="text-3xl font-bold">Project Video</h2>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-black">
        <iframe
          src={project.videoEmbed}
          title={`${project.title} video`}
          className="aspect-video w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </section>
  );
}

function ProjectGallery({ images, projectTitle }) {
  return (
    <section className="mt-20">
      <div className="mb-6">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gray-500">
          Gallery
        </p>

        <h2 className="text-3xl font-bold">Project Images</h2>
      </div>

      {images.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
          <ImageIcon className="mx-auto mb-4 h-10 w-10 text-gray-500" />
          <p className="text-gray-400">Gallery images will be added soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {images.map((image) => (
            <figure
              key={image.id || image.imageUrl}
              className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]"
            >
              <img
                src={image.imageUrl}
                alt={image.caption || projectTitle}
                className="aspect-video w-full object-cover"
              />

              {image.caption && (
                <figcaption className="p-5 text-sm text-gray-400">
                  {image.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}

function LoadingState() {
  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-28 text-white">
      <div className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
        <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-gray-400" />
        <p className="text-gray-400">Loading project...</p>
      </div>
    </main>
  );
}

function ErrorState({ message }) {
  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-28 text-white">
      <div className="mx-auto max-w-7xl rounded-3xl border border-red-500/20 bg-red-500/10 p-10 text-center">
        <p className="text-red-200">{message}</p>

        <Link
          to="/portfolio/digital"
          className="mt-6 inline-flex items-center gap-2 text-sm text-white hover:text-gray-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Digital Works
        </Link>
      </div>
    </main>
  );
}

function MetaItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-gray-300">
        {icon}
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
          {label}
        </p>
        <p className="mt-1 text-sm font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}