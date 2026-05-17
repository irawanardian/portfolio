import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Code2,
  Camera,
  Sparkles,
  MonitorSmartphone,
  PlayCircle,
  Mail,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

export default function Home() {
  return (
    <div className="bg-neutral-950 text-white min-h-screen font-sans selection:bg-white selection:text-black">
      {/* --- HERO SECTION --- */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=2065&auto=format&fit=crop"
            alt="Digital Creative Background"
            className="w-full h-full object-cover opacity-50 scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,10,10,0.75)_75%)]" />
        </div>

        <motion.div
          className="relative z-10 text-center px-4 max-w-6xl"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="mb-6 flex justify-center">
            <span className="px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-xs md:text-sm tracking-widest uppercase text-gray-300">
              Selected Works • Digital & Visual Portfolio
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-8xl font-bold tracking-tighter leading-tight mb-6"
          >
            CRAFTING DIGITAL <br />
<span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500">
  & VISUAL STORIES.
</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10 font-light leading-relaxed"
          >
           A curated space for works, projects, and visual stories born from creative process, digital exploration, and real-world experience.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col md:flex-row gap-4 justify-center items-center"
          >
            <a
              href="/portfolio"
              className="group relative px-8 py-4 bg-white text-black font-semibold rounded-full overflow-hidden transition-all hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                View Projects{" "}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>

            <a
              href="/contact"
              className="px-8 py-4 border border-white/20 rounded-full hover:bg-white/10 transition-all text-gray-300 hover:text-white"
            >
              Contact Me
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 z-10 animate-bounce"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <ChevronDown className="w-8 h-8 text-white/50" />
        </motion.div>
      </section>

      {/* --- WHAT I DO --- */}
      <section className="py-24 px-6 md:px-12 bg-neutral-950">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <p className="text-gray-500 uppercase tracking-[0.3em] text-sm mb-4">
              What I Do
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
              Code, Visual, and Digital Craft.
            </h2>
            <div className="h-1 w-20 bg-white/20"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SkillCard
              icon={<Code2 className="text-blue-400" />}
              iconBg="bg-blue-500/20"
              title="Web Development"
              desc="Membangun website, landing page, dashboard, dan aplikasi berbasis web dengan tampilan modern, responsif, dan mudah digunakan."
            />

            <SkillCard
              icon={<Camera className="text-purple-400" />}
              iconBg="bg-purple-500/20"
              title="Photo & Video"
              desc="Membuat visual untuk event, produk, brand, wedding, dokumentasi, dan kebutuhan konten digital dengan pendekatan storytelling."
            />

            <SkillCard
              icon={<Sparkles className="text-emerald-400" />}
              iconBg="bg-emerald-500/20"
              title="Creative Digital Solution"
              desc="Menggabungkan website, konten visual, automation, dan ide kreatif menjadi solusi digital yang terlihat profesional dan bekerja dengan baik."
            />
          </div>
        </div>
      </section>

      {/* --- FEATURED PROJECTS --- */}
      <section className="py-20 bg-neutral-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-gray-500 uppercase tracking-[0.3em] text-sm mb-4">
              Featured Projects
            </p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">
              SELECTED WORKS
            </h2>
          </motion.div>

          <div className="space-y-24">
            <PortfolioItem
              img="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop"
              category="WEB DEVELOPMENT"
              title="Modern Web Interface"
              year="2026"
              align="left"
              desc="Membangun tampilan web yang cepat, responsif, dan punya karakter visual kuat untuk kebutuhan personal maupun bisnis."
              icon={<MonitorSmartphone className="w-5 h-5" />}
            />

            <PortfolioItem
              img="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071&auto=format&fit=crop"
              category="PHOTO / VIDEO"
              title="Visual Storytelling"
              year="2025"
              align="right"
              desc="Mengabadikan momen, suasana, dan cerita melalui foto serta video dengan tone visual yang cinematic dan emosional."
              icon={<Camera className="w-5 h-5" />}
            />

            <PortfolioItem
              img="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2069&auto=format&fit=crop"
              category="DIGITAL SOLUTION"
              title="Creative Tech Project"
              year="2026"
              align="left"
              desc="Menggabungkan sistem, visual, dan workflow digital untuk membantu project tampil lebih profesional dan lebih mudah dikelola."
              icon={<PlayCircle className="w-5 h-5" />}
            />
          </div>

          <div className="text-center mt-20">
            <a
              href="/portfolio"
              className="inline-block border-b border-white pb-1 text-xl hover:text-gray-400 transition-colors"
            >
              Lihat Semua Project
            </a>
          </div>
        </div>
      </section>

      {/* --- ABOUT SHORT --- */}
      <section className="py-28 px-6 bg-neutral-950">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-gray-500 uppercase tracking-[0.3em] text-sm mb-4">
              Behind The Work
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Saya percaya karya digital harus indah dilihat dan nyaman
              digunakan.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-gray-400 text-lg leading-relaxed space-y-5"
          >
            <p>
              Sebagai programmer, saya fokus membangun struktur, fungsi, dan
              pengalaman pengguna yang rapi. Sebagai kreator multimedia, saya
              memperhatikan rasa visual, komposisi, warna, dan cerita.
            </p>
            <p>
              Kombinasi keduanya membuat setiap project bukan hanya berjalan,
              tapi juga punya identitas yang kuat.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-32 px-6 bg-neutral-900 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 text-white">
            LET'S BUILD <br /> SOMETHING{" "}
            <span className="italic font-serif text-gray-400">
              USEFUL & BEAUTIFUL.
            </span>
          </h2>

          <a
            href="mailto:contact@email.com"
            className="inline-flex items-center gap-3 bg-white text-black px-10 py-5 rounded-full text-lg font-bold hover:bg-gray-200 transition-all transform hover:-translate-y-1"
          >
            Mulai Diskusi <ArrowRight />
          </a>
        </motion.div>
      </section>
    </div>
  );
}

function SkillCard({ icon, iconBg, title, desc }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="group p-8 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-500"
    >
      <div
        className={`h-12 w-12 ${iconBg} rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>

      <h3 className="text-2xl font-semibold mb-3">{title}</h3>

      <p className="text-gray-400 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function PortfolioItem({ img, category, title, year, align, desc, icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className={`flex flex-col md:flex-row gap-8 md:gap-16 items-center ${
        align === "right" ? "md:flex-row-reverse" : ""
      }`}
    >
      <div className="w-full md:w-3/5 overflow-hidden rounded-xl border border-white/10 bg-white/5">
        <img
          src={img}
          alt={title}
          className="w-full h-[400px] md:h-[500px] object-cover hover:scale-110 transition-transform duration-700 ease-in-out cursor-pointer grayscale hover:grayscale-0"
        />
      </div>

      <div className="w-full md:w-2/5 space-y-4">
        <div className="flex items-center gap-4 text-sm tracking-widest text-gray-400 uppercase">
          <span className="flex items-center gap-2">
            {icon}
            {category}
          </span>
          <span className="w-8 h-[1px] bg-gray-600"></span>
          <span>{year}</span>
        </div>

        <h3 className="text-4xl md:text-5xl font-bold leading-tight">
          {title}
        </h3>

        <p className="text-gray-400 leading-relaxed">{desc}</p>

        <button className="text-white border-b border-transparent hover:border-white transition-all pb-1 uppercase text-sm tracking-wider mt-4">
          View Project
        </button>
      </div>
    </motion.div>
  );
}