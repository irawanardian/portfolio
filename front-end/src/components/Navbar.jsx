import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobilePortfolioOpen, setMobilePortfolioOpen] = useState(false); // Khusus accordion mobile

  const location = useLocation();

  // --- Logic Scroll & Hide/Show ---
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Logic Hide/Show Navbar
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // Scroll ke bawah -> Hide
      } else {
        setIsVisible(true); // Scroll ke atas -> Show
      }

      // Logic Background Hitam/Transparan
      if (currentScrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // --- Logic Disable Body Scroll saat Menu Buka ---
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [mobileMenuOpen]);

  // --- Close menu saat pindah halaman ---
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <motion.nav
        initial={{ y: 0 }}
        animate={{ 
          y: isVisible ? 0 : -100,
          backgroundColor: isScrolled || mobileMenuOpen ? "rgba(10, 10, 10, 0.8)" : "transparent",
          backdropFilter: isScrolled || mobileMenuOpen ? "blur(12px)" : "blur(0px)"
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 w-full z-50 border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* 1. LOGO */}
          <Link to="/" className="text-2xl font-bold tracking-tighter text-white z-50">
             {/* Ganti dengan <img src...> jika ada logo image */}
             VISUALS<span className="text-gray-500">.</span>
          </Link>

          {/* 2. DESKTOP MENU (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/">Home</NavLink>
            
            {/* Dropdown Desktop */}
            <div className="relative group h-full flex items-center">
              <button className="flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Portfolio <ChevronDown className="w-4 h-4" />
              </button>
              
              {/* Dropdown Content */}
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 bg-neutral-900 border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 overflow-hidden">
                <Link to="/portfolio/foto" className="block px-6 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                  Photography
                </Link>
                <Link to="/portfolio/video" className="block px-6 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                  Videography
                </Link>
              </div>
            </div>

            <NavLink to="/about">About</NavLink>
            <Link 
              to="/contact" 
              className="px-6 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-200 transition-transform hover:scale-105"
            >
              Let's Talk
            </Link>
          </div>

          {/* 3. MOBILE HAMBURGER BUTTON */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden text-white z-50 p-2"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </motion.nav>

      {/* 4. MOBILE FULL SCREEN MENU OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }} // Masuk dari atas
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }} // Keluar ke atas
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} // Bezier curve smooth
            className="fixed inset-0 z-40 bg-neutral-950 flex flex-col items-center justify-center space-y-8 md:hidden"
          >
            <MobileLink to="/" onClick={() => setMobileMenuOpen(false)}>Home</MobileLink>
            
            {/* Mobile Portfolio Accordion */}
            <div className="flex flex-col items-center">
              <button 
                onClick={() => setMobilePortfolioOpen(!mobilePortfolioOpen)}
                className="text-3xl font-bold text-white/80 flex items-center gap-2 mb-4"
              >
                Portfolio 
                <motion.div animate={{ rotate: mobilePortfolioOpen ? 180 : 0 }}>
                  <ChevronDown className="w-6 h-6" />
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
                    <Link to="/portfolio/foto" onClick={() => setMobileMenuOpen(false)} className="hover:text-white">Photography</Link>
                    <Link to="/portfolio/video" onClick={() => setMobileMenuOpen(false)} className="hover:text-white">Videography</Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <MobileLink to="/about" onClick={() => setMobileMenuOpen(false)}>About</MobileLink>
            <MobileLink to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</MobileLink>
            
            <div className="absolute bottom-10 text-gray-600 text-xs tracking-widest uppercase">
              &copy; 2024 Your Visuals
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// --- Sub-Components untuk kerapihan ---

function NavLink({ to, children }) {
  return (
    <Link 
      to={to} 
      className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
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