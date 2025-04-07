import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY.current) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
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
        <Link
          to="/"
          onClick={() => {
            setDropdownOpen(false);
            setMenuOpen(false);
          }}
        >
          <img
            src="/logo-ia.png"
            alt="logo"
            className="w-[40px] h-[40px] cursor-pointer"
          />
        </Link>

        {location.pathname !== "/portfolio" && (
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
                  <ul className="absolute top-full left-0 bg-black text-white shadow-lg mt-2 w-32 p-2 space-y-2">
                    <li>
                      <Link
                        to="/portfolio/foto"
                        className="block px-4 py-2 hover:bg-gray-700"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Foto
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/portfolio/video"
                        className="block px-4 py-2 hover:bg-gray-700"
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
              className="md:hidden text-white text-2xl ml-auto"
            >
              &#9776;
            </button>
          </>
        )}
      </div>

      {menuOpen && location.pathname !== "/portfolio" && (
        <ul className="md:hidden bg-black/90 text-white space-y-4 p-6 absolute w-full left-0 top-16 shadow-lg z-50">
          <li>
            <Link
              to="/"
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
              className="w-full text-left"
            >
              Portfolio
            </button>
            {dropdownOpen && (
              <ul className="pl-4 space-y-2">
                <li>
                  <Link
                    to="/portfolio/foto"
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
