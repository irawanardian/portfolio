import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Monitor,
  Camera,
  Clapperboard,
} from "lucide-react";

const categories = [
  {
    title: "Project Web",
    description:
      "Manage websites, applications, dashboards, and digital projects.",
    path: "/projects/web",
    icon: Monitor,
    number: "01",
  },
  {
    title: "Foto",
    description:
      "Manage photography albums, visual stories, and photo galleries.",
    path: "/projects/foto",
    icon: Camera,
    number: "02",
  },
  {
    title: "Video",
    description:
      "Manage cinematic films, motion works, and video projects.",
    path: "/projects/video",
    icon: Clapperboard,
    number: "03",
  },
];

export default function ProjectCategories() {
  return (
    <section className="px-6 py-10 lg:px-10 lg:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-gray-500">
          Workspace / Projects
        </p>

        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
          Manage Your Projects.
        </h1>

        <p className="mt-4 max-w-2xl text-gray-400">
          Select a category to manage your portfolio.
          Each category has its own workspace.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category, index) => {
          const Icon = category.icon;

          return (
            <motion.div
              key={category.path}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: index * 0.1,
              }}
            >
              <Link
                to={category.path}
                className="group relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.08]"
              >
                <div className="flex items-start justify-between">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition group-hover:bg-white group-hover:text-black">
                    <Icon className="h-8 w-8" />
                  </div>

                  <span className="text-sm tracking-widest text-gray-600">
                    {category.number}
                  </span>
                </div>

                <div>
                  <h2 className="mb-3 text-3xl font-bold tracking-tight">
                    {category.title}
                  </h2>

                  <p className="mb-8 text-sm leading-relaxed text-gray-400">
                    {category.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-white/10 pt-5">
                    <span className="text-sm font-semibold">
                      Manage Projects
                    </span>

                    <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
