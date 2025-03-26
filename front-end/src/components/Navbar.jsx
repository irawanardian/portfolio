import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const location = useLocation(); // Dapatkan lokasi halaman saat ini

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY.current) {
        setIsVisible(false); // Scroll ke bawah, navbar hilang
      } else {
        setIsVisible(true); // Scroll ke atas, navbar muncul
      }
      lastScrollY.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [menuOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full p-5 text-white transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${window.scrollY > 50 ? "bg-black backdrop-blur-md" : "bg-black"} z-50`}
    >
      <div className="max-w-6xl mx-auto flex items-center relative">
        {/* Logo */}
        <Link to="/">
          <img
            src="/logo-ia.png"
            alt="logo"
            className="w-[40px] h-[40px] cursor-pointer"
          />
        </Link>

        {/* Kalau halaman bukan "/portfolio", tampilkan menu */}
        {location.pathname !== "/portfolio" && (
          <>
            {/* Desktop Menu */}
            <ul className="hidden md:flex absolute left-1/2 -translate-x-1/2 space-x-6 font-roboto text-base">
              <li>
                <Link to="/" className="hover:text-gray-300">
                  home
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-gray-300">
                  portfolio
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gray-300">
                  about
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gray-300">
                  contact
                </Link>
              </li>
            </ul>

            {/* Hamburger Menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-white text-2xl ml-auto"
            >
              &#9776;
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      {menuOpen && location.pathname !== "/portfolio" && (
        <ul className="md:hidden bg-black/90 text-white space-y-4 p-6 absolute w-full left-0 top-16 shadow-lg z-50">
          <li>
            <Link to="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/portfolio" onClick={() => setMenuOpen(false)}>
              Portfolio
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={() => setMenuOpen(false)}>
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>
              Contact
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}
