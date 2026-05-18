import { ArrowUpRight, Mail, Instagram, Github, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = [
  { label: "Home", to: "/" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const socialLinks = [
  {
    label: "Email",
    href: "mailto:irawanardiantoro06@gmail.com",
    icon: <Mail className="w-4 h-4" />,
  },
  {
    label: "GitHub",
    href: "https://github.com/irawanardian",
    icon: <Github className="w-4 h-4" />,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/irawan-ardiantoro",
    icon: <Linkedin className="w-4 h-4" />,
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-neutral-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_35%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-end">
          {/* Brand */}
          <div className="md:col-span-6">
            <Link
              to="/"
              className="inline-block text-3xl font-bold tracking-tighter text-white"
            >
              IRAWAN ARDIANTORO<span className="text-gray-500">.</span>
            </Link>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-500">
              A personal space for digital works, visual stories, and creative
              explorations shaped through process and real-world experience.
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-gray-600">
              Explore
            </p>

            <div className="flex flex-col gap-3">
              {footerLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="group inline-flex w-fit items-center gap-2 text-sm text-gray-400 transition hover:text-white"
                >
                  {item.label}
                  <ArrowUpRight className="h-3 w-3 opacity-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div className="md:col-span-3">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-gray-600">
              Connect
            </p>

            <div className="flex flex-wrap gap-3">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-gray-400 transition-all hover:-translate-y-1 hover:bg-white hover:text-black"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-gray-600 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} Irawan Ardiantoro. All rights reserved.
          </p>

          <p className="text-gray-500">
            Code, visuals, and stories — crafted with intention.
          </p>
        </div>
      </div>
    </footer>
  );
}