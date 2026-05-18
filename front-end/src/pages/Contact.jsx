import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  Instagram,
  Linkedin,
  Github,
  MessageCircle,
  Sparkles,
} from "lucide-react";

const contactLinks = [
  {
    icon: <Mail />,
    label: "Email",
    value: "irawanardiantoro06@gmail.com",
    href: "mailto:irawanardiantoro06@gmail.com",
  },
  {
    icon: <MapPin />,
    label: "Location",
    value: "Indonesia",
  },
];

const socialLinks = [
  {
    icon: <Github />,
    label: "GitHub",
    href: "https://github.com/irawanardian",
  },
  {
    icon: <Linkedin />,
    label: "LinkedIn",
    href: "https://linkedin.com/in/irawan-ardiantoro",
  },
];

export default function Contact() {
  return (
    <main className="bg-neutral-950 min-h-screen text-white pt-24 pb-20 px-6 font-sans selection:bg-white selection:text-black">
      <section className="max-w-7xl mx-auto">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20 md:mb-28"
        >
          <p className="text-gray-500 uppercase tracking-[0.3em] text-sm mb-4">
            Contact
          </p>

          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-tight mb-6">
            LET&apos;S START <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-gray-700">
              A CONVERSATION.
            </span>
          </h1>

          <div className="h-1 w-24 bg-white/20 mb-8" />

          <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-3xl">
            Have an idea, project, collaboration, or just want to say hello?
            Reach me directly through the contact links below.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* LEFT MAIN CTA */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-7"
          >
            <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 md:p-12">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
              <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />

              <div className="relative z-10 flex min-h-[480px] flex-col justify-between">
                <div>
                  <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/10">
                    <MessageCircle className="w-7 h-7 text-blue-300" />
                  </div>

                  <p className="text-gray-500 uppercase tracking-[0.3em] text-sm mb-4">
                    Direct Message
                  </p>

                  <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight mb-6">
                    Got something <br />
                    in mind?
                  </h2>

                  <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
                    Whether it&apos;s a digital work, visual story, creative
                    collaboration, or a simple discussion, I&apos;m open to talk
                    and explore what can be created.
                  </p>
                </div>

                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <a
                    href="mailto:irawanardiantoro06@gmail.com"
                    className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 font-bold text-black transition-all hover:scale-105 hover:bg-gray-200"
                  >
                    Send Email
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT CONTACT INFO */}
          <motion.div
            initial={{ opacity: 0, x: 35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
              <div className="mb-8 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-gray-400" />
                <h2 className="text-xl font-bold">Contact Details</h2>
              </div>

              <div className="space-y-7">
                {contactLinks.map((item) => (
                  <ContactItem key={item.label} {...item} />
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
              <p className="text-gray-500 uppercase tracking-[0.3em] text-sm mb-6">
                Social
              </p>

              <div className="flex gap-4">
                {socialLinks.map((item) => (
                  <SocialButton key={item.label} {...item} />
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
              <p className="text-gray-500 uppercase tracking-[0.3em] text-sm mb-4">
                Response
              </p>
              <p className="text-gray-400 leading-relaxed">
                I usually respond as soon as possible. For project discussions,
                please include a short context so the conversation can start
                clearly.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function ContactItem({ icon, label, value, href }) {
  const content = (
    <div className="group flex items-center gap-5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 text-gray-400 transition-all group-hover:border-white/30 group-hover:text-white">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="mb-1 text-xs uppercase tracking-widest text-gray-500">
          {label}
        </p>
        <p className="break-words text-base md:text-lg font-medium text-white transition-colors group-hover:text-gray-300">
          {value}
        </p>
      </div>
    </div>
  );

  if (!href) return content;

  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  );
}

function SocialButton({ icon, label, href }) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-neutral-900 text-white transition-all duration-300 hover:scale-110 hover:bg-white hover:text-black"
    >
      {icon}
    </a>
  );
}