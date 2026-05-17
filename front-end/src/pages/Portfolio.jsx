import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Camera, Code2, PlayCircle } from "lucide-react";

const categories = [
  {
    title: "Digital Works",
    subtitle: "Website, interface, and digital experiments.",
    desc: "A collection of web projects, layouts, and digital ideas crafted with attention to detail, function, and visual balance.",
    to: "/portfolio/digital",
    icon: <Code2 className="w-6 h-6" />,
   label: "Explore Digital",
  },
  {
    title: "Photo Stories",
    subtitle: "Moments, people, and visual details.",
    desc: "Selected photo works captured through composition, light, emotion, and real moments from the field.",
    to: "/portfolio/foto",
    icon: <Camera className="w-6 h-6" />,
    label: "Explore Photos",
  },
  {
    title: "Motion Works",
    subtitle: "Video, cinematic cuts, and storytelling.",
    desc: "Visual stories in motion, from documentation to short-form content, crafted with rhythm, mood, and narrative.",
    to: "/portfolio/video",
    icon: <PlayCircle className="w-6 h-6" />,
    label: "Explore Videos",
  },
];

export default function Portfolio() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white px-6 py-28">
      <section className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mb-16"
        >
          <p className="text-gray-500 uppercase tracking-[0.3em] text-sm mb-4">
            Portfolio
          </p>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight mb-6">
            SELECTED <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500">
              WORKS.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
            A curated collection of digital works, visual stories, and creative
            projects shaped by process, exploration, and real-world experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.12 }}
            >
              <Link
                to={item.to}
                className="group relative block h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.08]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative z-10 flex h-full min-h-[330px] flex-col justify-between">
                  <div>
                    <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition-transform duration-500 group-hover:scale-110">
                      {item.icon}
                    </div>

                    <p className="mb-3 text-sm uppercase tracking-[0.25em] text-gray-500">
                      {item.subtitle}
                    </p>

                    <h2 className="mb-5 text-3xl font-bold tracking-tight">
                      {item.title}
                    </h2>

                    <p className="text-gray-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
                    <span className="text-sm font-medium text-gray-300">
                      {item.label}
                    </span>

                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:translate-x-1">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}