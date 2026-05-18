import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Code2,
  Camera,
  Layers3,
  Sparkles,
  Coffee,
  MonitorSmartphone,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function About() {
  return (
    <div className="bg-neutral-950 min-h-screen text-white font-sans selection:bg-white selection:text-black pt-20">
      {/* HEADER TITLE */}
      <section className="px-6 py-20 md:py-32 container mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-5xl"
        >
          <motion.p
            variants={fadeInUp}
            className="text-gray-500 uppercase tracking-[0.3em] text-sm mb-4"
          >
            About
          </motion.p>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-8xl font-bold tracking-tighter leading-tight mb-6"
          >
            BEHIND THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-gray-700">
              WORK.
            </span>
          </motion.h1>

          <motion.div
            variants={fadeInUp}
            className="h-1 w-24 bg-white/20 mb-8"
          />

          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-3xl"
          >
            A short story about the process, perspective, and creative direction
            behind the digital and visual works shown in this portfolio.
          </motion.p>
        </motion.div>
      </section>

      {/* MAIN CONTENT */}
      <section className="container mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* LEFT IMAGE */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="sticky top-32"
            >
              <div className="relative rounded-3xl overflow-hidden group border border-white/10 bg-white/5">
                <div className="absolute inset-0 border border-white/10 z-10 m-3 pointer-events-none rounded-2xl" />

                <img
                  src="/about.jpg"
                  alt="Irawan Ardiantoro"
                  className="w-full h-[560px] md:h-[620px] object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <div className="inline-flex bg-black/50 backdrop-blur-md px-4 py-2 border border-white/10 rounded-full">
                    <p className="text-xs tracking-widest uppercase font-bold text-white">
                      Irawan Ardiantoro
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-8 border-t border-white/10 pt-8">
                <Stat number="Digital" label="Works" />
                <Stat number="Visual" label="Stories" bordered />
                <Stat number="Creative" label="Process" bordered />
              </div>
            </motion.div>
          </div>

          {/* RIGHT NARRATIVE */}
          <div className="lg:col-span-7 space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-3">
                <span className="w-8 h-[1px] bg-white" />
                Process First
              </h2>

              <p className="text-xl md:text-2xl text-gray-400 leading-relaxed font-light">
                “I believe good work is not only about how it looks, but also
                how it feels, how it works, and how every detail connects with
                the bigger story.”
              </p>
            </motion.div>

            <motion.div
              className="text-gray-400 space-y-6 leading-relaxed text-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <p>
                Hi, I’m <strong className="text-white">Irawan</strong>. This
                portfolio is a personal space to collect the works, ideas, and
                visual stories I’ve built through different experiences — from
                digital interfaces to moments captured in the field.
              </p>

              <p>
                I enjoy working on things that combine{" "}
                <span className="text-white underline decoration-white/30 underline-offset-4">
                  structure, visual taste, and real purpose
                </span>
                . For me, a project should not only be functional, but also
                thoughtful, clean, and memorable.
              </p>

              <p>
                Some works begin with code, some begin with a camera, and some
                begin with a simple idea. What connects them is the same process:
                observing, shaping, refining, and turning details into something
                that feels complete.
              </p>
            </motion.div>

            {/* WHAT I VALUE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
              <ServiceCard
                icon={<MonitorSmartphone className="w-6 h-6" />}
                title="Digital Experience"
                desc="Interfaces, websites, and digital layouts designed to feel clean, useful, and easy to explore."
              />

              <ServiceCard
                icon={<Camera className="w-6 h-6" />}
                title="Visual Story"
                desc="Photo and video works shaped through composition, atmosphere, and real moments."
              />

              <ServiceCard
                icon={<Layers3 className="w-6 h-6" />}
                title="Structured Process"
                desc="Every project is built with attention to flow, detail, consistency, and long-term usability."
              />

              <ServiceCard
                icon={<Sparkles className="w-6 h-6" />}
                title="Creative Direction"
                desc="Turning raw ideas into a more polished digital or visual direction with a clear identity."
              />
            </div>

            <div className="pt-10">
              <a
                href="/contact"
                className="inline-flex items-center gap-4 text-white font-bold text-lg hover:text-gray-300 transition-colors group"
              >
                Start a Conversation
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TOOLS / PROCESS SECTION */}
      <section className="border-t border-white/5 py-20 bg-neutral-900/50">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-sm font-bold tracking-[0.3em] text-gray-500 uppercase mb-4">
                Tools & Direction
              </p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-5">
                Built with the right mix of logic and visual taste.
              </h2>
              <p className="text-gray-400 leading-relaxed text-lg">
                I use different tools depending on the project — from web
                technologies and interface design to visual editing and field
                production. The goal stays the same: create work that looks good,
                works well, and feels intentional.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ToolCard icon={<Code2 />} label="Code" />
              <ToolCard icon={<MonitorSmartphone />} label="Interface" />
              <ToolCard icon={<Camera />} label="Visual" />
              <ToolCard icon={<Coffee />} label="Process" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ number, label, bordered = false }) {
  return (
    <div className={`text-center ${bordered ? "border-l border-white/10" : ""}`}>
      <h3 className="text-xl md:text-2xl font-bold">{number}</h3>
      <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
        {label}
      </p>
    </div>
  );
}

function ServiceCard({ icon, title, desc }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-white/20 transition-all"
    >
      <div className="text-gray-300 mb-4">{icon}</div>
      <h3 className="text-white text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function ToolCard({ icon, label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 flex items-center gap-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white">
        {React.cloneElement(icon, { className: "w-5 h-5" })}
      </div>
      <span className="font-semibold text-white">{label}</span>
    </div>
  );
}