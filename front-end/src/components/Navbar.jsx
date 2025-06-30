import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false); // State baru untuk mendeteksi scroll
  const lastScrollY = useRef(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      // Logic untuk menyembunyikan/menampilkan navbar saat scroll
      if (window.scrollY > lastScrollY.current) {
        setIsVisible(false); // Sembunyikan jika scroll ke bawah
      } else {
        setIsVisible(true); // Tampilkan jika scroll ke atas
      }
      lastScrollY.current = window.scrollY;

      // Logic untuk mengubah background navbar saat scroll
      if (window.scrollY > 50) {
        // Angka 50 bisa disesuaikan
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Jalankan sekali saat komponen dimuat untuk mengecek posisi scroll awal
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [menuOpen]);

  // Tentukan background navbar berdasarkan lokasi dan status scroll
  const getNavbarBackgroundClass = () => {
    if (location.pathname === "/") {
      // Di halaman Home
      return isScrolled ? "bg-black backdrop-blur-md" : "bg-transparent";
    } else {
      // Di halaman lain
      return "bg-black backdrop-blur-md";
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full p-5 text-white transition-all duration-300 ${
        // Ubah duration-300 agar background juga transisi
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${getNavbarBackgroundClass()} z-50`}
    >
      <div className="max-w-6xl mx-auto flex items-center relative">
        <Link
          to="/"
          onClick={() => {
            setDropdownOpen(false);
            setMenuOpen(false);
          }}
        >
          <img
            src="/logo-ia.png" // Pastikan path logo benar
            alt="logo"
            className="w-[40px] h-[40px] cursor-pointer"
          />
        </Link>

        {location.pathname !== "/portfolio" && ( // Ini mungkin perlu disesuaikan jika ingin menu selalu terlihat
          <>
            <ul className="hidden md:flex absolute left-1/2 -translate-x-1/2 space-x-6 font-roboto text-base">
              <li>
                <Link
                  to="/"
                  className="hover:text-gray-300"
                  onClick={() => {
                    setDropdownOpen(false);
                    setMenuOpen(false);
                  }}
                >
                  Home
                </Link>
              </li>
              <li className="relative group">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="hover:text-gray-300"
                >
                  Portfolio
                </button>
                {dropdownOpen && (
                  <ul className="absolute top-full left-0 bg-black text-white shadow-lg mt-2 w-32 p-2 space-y-2 rounded-md">
                    {" "}
                    {/* Tambah rounded-md */}
                    <li>
                      <Link
                        to="/portfolio/foto"
                        className="block px-4 py-2 hover:bg-gray-700 rounded-sm" // Tambah rounded-sm
                        onClick={() => setDropdownOpen(false)}
                      >
                        Foto
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/portfolio/video"
                        className="block px-4 py-2 hover:bg-gray-700 rounded-sm"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Video
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-gray-300"
                  onClick={() => {
                    setDropdownOpen(false);
                    setMenuOpen(false);
                  }}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-gray-300"
                  onClick={() => {
                    setDropdownOpen(false);
                    setMenuOpen(false);
                  }}
                >
                  Contact
                </Link>
              </li>
            </ul>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-white text-2xl ml-auto focus:outline-none" // Tambah focus:outline-none
            >
              &#9776; {/* Ikon hamburger */}
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      {menuOpen && location.pathname !== "/portfolio" && (
        <ul className="md:hidden bg-black/90 text-white space-y-4 p-6 absolute w-full left-0 top-16 shadow-lg z-40 animate-fade-in-down">
          {" "}
          {/* Tambah animasi */}
          <li>
            <Link
              to="/"
              className="block hover:bg-gray-700 px-4 py-2 rounded-md" // Tambah styling untuk mobile menu item
              onClick={() => {
                setDropdownOpen(false);
                setMenuOpen(false);
              }}
            >
              Home
            </Link>
          </li>
          <li>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full text-left hover:bg-gray-700 px-4 py-2 rounded-md"
            >
              Portfolio
            </button>
            {dropdownOpen && (
              <ul className="pl-6 space-y-2 mt-2">
                {" "}
                {/* Tambah mt-2 */}
                <li>
                  <Link
                    to="/portfolio/foto"
                    className="block hover:bg-gray-800 px-4 py-2 rounded-md"
                    onClick={() => {
                      setDropdownOpen(false);
                      setMenuOpen(false);
                    }}
                  >
                    Foto
                  </Link>
                </li>
                <li>
                  <Link
                    to="/portfolio/video"
                    className="block hover:bg-gray-800 px-4 py-2 rounded-md"
                    onClick={() => {
                      setDropdownOpen(false);
                      setMenuOpen(false);
                    }}
                  >
                    Video
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <Link
              to="/about"
              className="block hover:bg-gray-700 px-4 py-2 rounded-md"
              onClick={() => {
                setDropdownOpen(false);
                setMenuOpen(false);
              }}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="block hover:bg-gray-700 px-4 py-2 rounded-md"
              onClick={() => {
                setDropdownOpen(false);
                setMenuOpen(false);
              }}
            >
              Contact
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}
