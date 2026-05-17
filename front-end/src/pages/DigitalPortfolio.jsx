import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Code2,
  Globe2,
  Layers3,
  MonitorSmartphone,
  Sparkles,
} from "lucide-react";

const projects = [
  {
    title: "DR Network",
    url: "https://drnetwork.id",
    displayUrl: "drnetwork.id",
    category: "Company Website",
    year: "Active",
    desc: "A digital presence for DR Network, built to introduce the brand, services, and online identity through a clean and accessible web experience.",
    tags: ["Website", "Brand", "Responsive"],
    gradient: "from-blue-500/20 via-cyan-500/10 to-transparent",
  },
  {
    title: "Join Network",
    url: "https://joinnetwork.id",
    displayUrl: "joinnetwork.id",
    category: "Digital Platform",
    year: "Active",
    desc: "A web-based platform connected to ISP service needs, designed to support customer access, digital workflow, and operational experience.",
    tags: ["Platform", "ISP", "System"],
    gradient: "from-purple-500/20 via-fuchsia-500/10 to-transparent",
  },
];

export default function DigitalPortfolio() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white px-6 py-28">
      <section className="max-w-7xl mx-auto">
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
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>

          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/10">
            <Code2 className="w-7 h-7 text-blue-300" />
          </div>

          <p className="text-gray-500 uppercase tracking-[0.3em] text-sm mb-4">
            Digital Works
          </p>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight mb-6">
            WEB PROJECTS <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500">
              & DIGITAL SYSTEMS.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-3xl">
            A selected collection of active websites, digital platforms, and web
            experiences shaped through interface design, technical structure,
            and real-world use.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-20">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 md:p-10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard
              icon={<MonitorSmartphone className="w-5 h-5" />}
              title="Responsive Interface"
              desc="Built to work across desktop, tablet, and mobile screens."
            />

            <InfoCard
              icon={<Layers3 className="w-5 h-5" />}
              title="Real Project"
              desc="Not only concepts, but projects used in real digital environments."
            />

            <InfoCard
              icon={<Sparkles className="w-5 h-5" />}
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
  return (
    <motion.article
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.12 }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.08]"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient}`} />
      <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/5 blur-3xl transition-transform duration-700 group-hover:scale-125" />

      <div className="relative z-10 flex min-h-[390px] flex-col justify-between">
        <div>
          <div className="mb-8 flex items-center justify-between">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-black/20 text-white">
              <Globe2 className="w-6 h-6" />
            </div>

            <span className="rounded-full border border-white/10 bg-black/20 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-gray-400">
              {project.year}
            </span>
          </div>

          <p className="mb-3 text-sm uppercase tracking-[0.25em] text-gray-500">
            {project.category}
          </p>

          <h2 className="mb-4 text-4xl md:text-5xl font-bold tracking-tight">
            {project.title}
          </h2>

          <p className="mb-6 text-gray-400 leading-relaxed">
            {project.desc}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
          <span className="text-sm text-gray-400">{project.displayUrl}</span>

          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition-all hover:scale-105 hover:bg-gray-200"
          >
            Visit Website
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.article>
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