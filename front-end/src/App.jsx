import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Video from "./pages/Video"; // Import halaman Video
import About from "./pages/About";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";
import Foto from "./pages/Foto";
import DigitalPortfolio from "./pages/DigitalPortfolio";

export default function App() {
  const location = useLocation();

  return (
    <div>
      {/* Kirim pathname ke Navbar */}
      <Navbar pathname={location.pathname} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio/digital" element={<DigitalPortfolio />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/portfolio/foto" element={<Foto />} />
        {""}
        <Route path="/portfolio/video" element={<Video />} />{" "}
        {/* Tambah Route Video */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      <Footer />
    </div>
  );
}
