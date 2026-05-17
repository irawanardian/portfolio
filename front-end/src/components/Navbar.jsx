import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";

const portfolioLinks = [
  {
    to: "/portfolio",
    label: "Overview",
    desc: "All categories",
  },
  {
    to: "/portfolio/digital",
    label: "Digital Works",
    desc: "Web & systems",
  },
  {
    to: "/portfolio/foto",
    label: "Photo Stories",
    desc: "Still visuals",
  },
  {
    to: "/portfolio/video",
    label: "Motion Works",
    desc: "Video stories",
  },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobilePortfolioOpen, setMobilePortfolioOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setIsScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobilePortfolioOpen(false);
  }, [location]);

  const isPortfolioActive = location.pathname.startsWith("/portfolio");

  return (
    <>
      <motion.nav
        initial={{ y: 0 }}
        animate={{
          y: isVisible ? 0 : -100,
          backgroundColor:
            isScrolled || mobileMenuOpen
              ? "rgba(10, 10, 10, 0.82)"
              : "transparent",
          backdropFilter:
            isScrolled || mobileMenuOpen ? "blur(14px)" : "blur(0px)",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 w-full z-50 border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* LOGO */}
          <Link
            to="/"
            className="text-2xl font-bold tracking-tighter text-white z-50"
          >
            IRAWAN<span className="text-gray-500">.</span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" active={location.pathname === "/"}>
              Home
            </NavLink>

            <div className="relative group h-full flex items-center">
              <Link
                to="/portfolio"
                className={`flex items-center gap-1 text-sm font-medium transition-colors relative ${
                  isPortfolioActive ? "text-white" : "text-gray-300 hover:text-white"
                }`}
              >
                Portfolio <ChevronDown className="w-4 h-4" />

                <span
                  className={`absolute -bottom-1 left-0 h-[1px] bg-white transition-all duration-300 ${
                    isPortfolioActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>

              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 overflow-hidden">
                {portfolioLinks.map((item) => {
                  const active = location.pathname === item.to;

                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`block px-6 py-4 transition-colors border-b border-white/5 last:border-b-0 ${
                        active
                          ? "bg-white/10 text-white"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className="block text-sm font-semibold">
                        {item.label}
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        {item.desc}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <NavLink to="/about" active={location.pathname === "/about"}>
              About
            </NavLink>

            <Link
              to="/contact"
              className="px-6 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-200 transition-transform hover:scale-105"
            >
              Let's Talk
            </Link>
          </div>

          {/* MOBILE HAMBURGER */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white z-50 p-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </motion.nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-neutral-950 flex flex-col items-center justify-center space-y-8 md:hidden px-6"
          >
            <MobileLink to="/" onClick={() => setMobileMenuOpen(false)}>
              Home
            </MobileLink>

            <div className="flex flex-col items-center w-full">
              <button
                onClick={() => setMobilePortfolioOpen(!mobilePortfolioOpen)}
                className="text-4xl font-bold text-white flex items-center gap-2 mb-4 tracking-tight"
              >
                Portfolio
                <motion.div animate={{ rotate: mobilePortfolioOpen ? 180 : 0 }}>
                  <ChevronDown className="w-7 h-7" />
                </motion.div>
              </button>

              <AnimatePresence>
                {mobilePortfolioOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden flex flex-col items-center gap-4 text-xl text-gray-500"
                  >
                    {portfolioLinks.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`hover:text-white transition-colors ${
                          location.pathname === item.to
                            ? "text-white"
                            : "text-gray-500"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <MobileLink to="/about" onClick={() => setMobileMenuOpen(false)}>
              About
            </MobileLink>

            <MobileLink to="/contact" onClick={() => setMobileMenuOpen(false)}>
              Contact
            </MobileLink>

            <div className="absolute bottom-10 text-gray-600 text-xs tracking-widest uppercase">
              © {new Date().getFullYear()} Irawan Ardiantoro
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ to, children, active = false }) {
  return (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors relative group ${
        active ? "text-white" : "text-gray-300 hover:text-white"
      }`}
    >
      {children}
      <span
        className={`absolute -bottom-1 left-0 h-[1px] bg-white transition-all duration-300 ${
          active ? "w-full" : "w-0 group-hover:w-full"
        }`}
      />
    </Link>
  );
}

function MobileLink({ to, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="text-4xl font-bold text-white hover:text-gray-400 transition-colors tracking-tight"
    >
      {children}
    </Link>
  );
}