import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X, ZoomIn } from "lucide-react";
import { Link } from "react-router-dom";

// --- DUMMY DATA FOTO (Ganti nanti dengan data aslimu) ---
// --- CURATED AESTHETIC PHOTOS ---
const photos = [
  { 
    id: 1, 
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1974&auto=format&fit=crop", 
    title: "Eternal Vows", 
    category: "Wedding" 
  },
  { 
    id: 2, 
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop", 
    title: "Raw Portrait", 
    category: "Editorial" 
  },
  { 
    id: 3, 
    src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop", 
    title: "The Crowd", 
    category: "Event" 
  },
  { 
    id: 4, 
    src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1887&auto=format&fit=crop", 
    title: "Urban Solitude", 
    category: "Street" 
  },
  { 
    id: 5, 
    src: "https://images.unsplash.com/photo-1511285560982-1351cdeb9821?q=80&w=2070&auto=format&fit=crop", 
    title: "Seaside Love", 
    category: "Wedding" 
  },
  { 
    id: 6, 
    src: "https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=1000&auto=format&fit=crop", 
    title: "Minimalist Geometry", 
    category: "Architecture" 
  },
  { 
    id: 7, 
    src: "https://images.unsplash.com/photo-1555685812-4b943f3fb616?q=80&w=2070&auto=format&fit=crop", 
    title: "Neon Nights", 
    category: "Cyberpunk" 
  },
  { 
    id: 8, 
    src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop", 
    title: "Timeless Piece", 
    category: "Product" 
  },
  { 
    id: 9, 
    src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop", 
    title: "Sonic Depth", 
    category: "Commercial" 
  },
  { 
    id: 10, 
    src: "https://images.unsplash.com/photo-1504198458649-3128b932f49e?q=80&w=987&auto=format&fit=crop", 
    title: "Tokyo Rain", 
    category: "Street" 
  },
  { 
    id: 11, 
    src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1000&auto=format&fit=crop", 
    title: "Feminine Strength", 
    category: "Portrait" 
  },
  { 
    id: 12, 
    src: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop", 
    title: "Stage Lights", 
    category: "Music" 
  }
];

export default function Foto() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="bg-neutral-950 min-h-screen text-white pt-24 pb-20 px-4 md:px-8 font-sans">
      
      {/* --- HEADER --- */}
      <div className="max-w-7xl mx-auto mb-16">
  <Link
    to="/portfolio"
    className="mb-10 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
  >
    <ArrowLeft className="w-4 h-4" />
    Back to Portfolio
  </Link>

  <motion.div
    initial={{ opacity: 0, y: 35 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="max-w-3xl"
  >
    <p className="text-gray-500 uppercase tracking-[0.3em] text-sm mb-4">
      Photo Stories
    </p>

    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight mb-6">
      VISUAL <br />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500">
        JOURNAL.
      </span>
    </h1>

    <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
      A collection of still moments, visual details, and stories captured
      through light, composition, and real experience from the field.
    </p>
  </motion.div>
</div>

      {/* --- MASONRY GRID GALLERY --- */}
      <div className="max-w-7xl mx-auto">
        {/* Tailwind 'columns' utility membuat efek Masonry dengan mudah */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="break-inside-avoid relative group rounded-xl overflow-hidden cursor-pointer bg-gray-900"
              onClick={() => setSelectedImage(photo)}
            >
              <img
                src={photo.src}
                alt={photo.title}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110 filter grayscale group-hover:grayscale-0"
              />
              
              {/* Overlay Hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                <ZoomIn className="text-white mb-2 opacity-80" />
                <h3 className="text-xl font-bold tracking-wider">{photo.title}</h3>
                <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">{photo.category}</span>
              </div>
            </motion.div>
          ))}

        </div>
      </div>

      {/* --- LIGHTBOX (MODAL) --- */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)} // Tutup jika klik background
          >
            {/* Close Button */}
            <button 
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={40} />
            </button>

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-5xl max-h-[90vh] rounded-lg overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Mencegah tutup jika klik gambar
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="w-full h-full object-contain max-h-[85vh]"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-6 pt-12">
                 <h3 className="text-2xl font-bold text-white">{selectedImage.title}</h3>
                 <p className="text-gray-300 text-sm">{selectedImage.category}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}