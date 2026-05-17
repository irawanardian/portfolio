import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, PlayCircle } from "lucide-react";
import VideoCard from "../components/VideoCard"; 
import { videos } from "../assets/data/videos"; 

export default function Video() {
  const categories = [
    "All", // Saya tambahkan opsi "All" agar user bisa lihat semua
    "Wedding",
    "Prewedding",
    "Engagement",
    "Event",
    "Product Advertisement",
    "Live Streaming",
    "Corporate",
  ];

  const [selectedCategory, setSelectedCategory] = useState("All"); // Default All
  const [currentPage, setCurrentPage] = useState(1);
  const [videosPerPage, setVideosPerPage] = useState(9); // Ganti ke 9 (grid 3x3) agar lebih rapi

  // --- Logic Filtering & Pagination ---
  const filteredVideos = selectedCategory === "All" 
    ? videos 
    : videos.filter((video) => video.category === selectedCategory);

  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);
  const startIndex = (currentPage - 1) * videosPerPage;
  const currentVideos = filteredVideos.slice(startIndex, startIndex + videosPerPage);

  // Reset page ke 1 setiap kali ganti kategori
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Responsiveness
  useEffect(() => {
    const updateVideosPerPage = () => {
      // Mobile: 4, Tablet: 6, Desktop: 9
      if (window.innerWidth < 768) setVideosPerPage(4);
      else if (window.innerWidth < 1024) setVideosPerPage(6);
      else setVideosPerPage(9);
    };
    updateVideosPerPage();
    window.addEventListener("resize", updateVideosPerPage);
    return () => window.removeEventListener("resize", updateVideosPerPage);
  }, []);

  return (
    <div className="bg-neutral-950 min-h-screen text-white font-sans pt-24 pb-20 px-6">
      
      {/* --- HEADER SECTION --- */}
      <div className="max-w-7xl mx-auto mb-12">
        {/* Breadcrumb / Back */}
        <Link 
          to="/portfolio" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm uppercase tracking-widest font-medium">Back to Portfolio</span>
        </Link>

        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-gray-500 uppercase tracking-[0.3em] text-sm mb-4">
  Motion Works
</p>

<h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight mb-6">
  CINEMATIC <br />
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500">
    STORIES.
  </span>
</h1>

<p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-3xl">
  A collection of motion works, visual stories, and moving moments shaped
  through rhythm, atmosphere, and real experience from the field.
</p>
        </motion.div>
      </div>

      {/* --- FILTER CATEGORIES (Scrollable Pills) --- */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex overflow-x-auto pb-4 gap-3 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                selectedCategory === cat
                  ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                  : "bg-transparent text-gray-400 border-white/10 hover:border-white hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* --- VIDEO GRID --- */}
      <div className="max-w-7xl mx-auto">
        <motion.div 
          layout // Magic prop dari Framer Motion untuk animasi layout otomatis
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]"
        >
          <AnimatePresence mode="popLayout">
            {currentVideos.length > 0 ? (
              currentVideos.map((video, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={`${video.id || index}-${selectedCategory}`} // Pastikan key unik
                >
                  {/* Wrapper agar VideoCard terlihat premium (Glow effect saat hover) */}
                  <div className="group relative rounded-xl overflow-hidden bg-neutral-900 border border-white/5 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/20">
                    {/* Kita render VideoCard asli di sini */}
                    <VideoCard video={video} />
                    
                    {/* (Optional) Overlay Play Button jika VideoCard belum punya */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center">
                            <PlayCircle className="text-white w-8 h-8 fill-white/20" />
                        </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500"
              >
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <PlayCircle size={32} className="opacity-50" />
                </div>
                <p>No video found in this category.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* --- PAGINATION (Minimalist) --- */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-20">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`relative px-4 py-2 text-lg font-medium transition-colors ${
                  currentPage === page ? "text-white" : "text-gray-600 hover:text-gray-300"
                }`}
              >
                {page}
                {currentPage === page && (
                  <motion.div 
                    layoutId="pagination-underline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-white" 
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}