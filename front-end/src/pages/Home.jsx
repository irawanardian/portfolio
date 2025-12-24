import React from "react";
import { motion } from "framer-motion";
import { Play, ArrowRight, Instagram, Mail, ChevronDown } from "lucide-react";

// Variasi animasi untuk framer-motion
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

export default function Home() {
  return (
    <div className="bg-neutral-950 text-white min-h-screen font-sans selection:bg-white selection:text-black">
      
      {/* --- HERO SECTION --- */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image/Video */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071&auto=format&fit=crop"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-60 scale-105 animate-pulse-slow" 
            // Note: Nanti ganti <img> ini dengan <video autoPlay muted loop> source file kamu
          />
          {/* Overlay Gradient Elegan */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
        </div>

        {/* Content */}
        <motion.div 
          className="relative z-10 text-center px-4 max-w-5xl"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="mb-6 flex justify-center">
            <span className="px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-sm tracking-widest uppercase text-gray-300">
              Videography Portfolio
            </span>
          </motion.div>
          
          <motion.h1 
            variants={fadeInUp} 
            className="text-5xl md:text-8xl font-bold tracking-tighter leading-tight mb-6"
          >
            CAPTURING THE <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">UNSEEN MOMENTS.</span>
          </motion.h1>

          <motion.p 
            variants={fadeInUp} 
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 font-light"
          >
            Bukan sekadar merekam gambar. Saya merangkai emosi, cahaya, dan suara menjadi sebuah mahakarya visual yang abadi.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <a 
              href="/portfolio" 
              className="group relative px-8 py-4 bg-white text-black font-semibold rounded-full overflow-hidden transition-all hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                Lihat Karya <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
            <a 
              href="/contact" 
              className="px-8 py-4 border border-white/20 rounded-full hover:bg-white/10 transition-all text-gray-300 hover:text-white"
            >
              Hubungi Saya
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 z-10 animate-bounce"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <ChevronDown className="w-8 h-8 text-white/50" />
        </motion.div>
      </section>

      {/* --- SERVICES / PHILOSOPHY (Grid Bento Style) --- */}
      <section className="py-24 px-6 md:px-12 bg-neutral-950">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Artistry in Motion</h2>
            <div className="h-1 w-20 bg-white/20"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="group p-8 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-500">
              <div className="h-12 w-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Play className="text-blue-400 fill-current" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Cinematic Editing</h3>
              <p className="text-gray-400 leading-relaxed">
                Color grading yang dalam, sound design yang imersif, dan potongan gambar yang bercerita.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group p-8 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-500">
              <div className="h-12 w-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Instagram className="text-purple-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Social Media Content</h3>
              <p className="text-gray-400 leading-relaxed">
                Konten vertikal (Reels/TikTok) high-quality yang didesain untuk viral dan engagement tinggi.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group p-8 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-500">
              <div className="h-12 w-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Mail className="text-emerald-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Commercials</h3>
              <p className="text-gray-400 leading-relaxed">
                Video iklan produk yang menonjolkan nilai brand Anda dengan estetika premium.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURED WORKS (Parallax / Large Cards) --- */}
      <section className="py-20 bg-neutral-900">
        <div className="container mx-auto px-6">
           <motion.h2 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             className="text-4xl md:text-6xl font-bold mb-16 text-center tracking-tighter"
           >
             SELECTED WORKS
           </motion.h2>

           <div className="space-y-24">
             {/* Project 1 - Left */}
             <PortfolioItem 
               img="https://images.unsplash.com/photo-1511285560982-1351cdeb9821?q=80&w=2070"
               category="WEDDING FILM"
               title="The Union of A & B"
               year="2024"
               align="left"
             />
             
             {/* Project 2 - Right */}
             <PortfolioItem 
               img="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070"
               category="CORPORATE EVENT"
               title="Tech Summit Jakarta"
               year="2023"
               align="right"
             />

             {/* Project 3 - Left */}
             <PortfolioItem 
               img="https://images.unsplash.com/photo-1558507652-2d9626c4e67a?q=80&w=1974"
               category="PRODUCT COMMERCIAL"
               title="Nike - Run The City"
               year="2024"
               align="left"
             />
           </div>

           <div className="text-center mt-20">
             <a href="/portfolio" className="inline-block border-b border-white pb-1 text-xl hover:text-gray-400 transition-colors">
               Lihat Semua Project
             </a>
           </div>
        </div>
      </section>

      {/* --- CTA SECTION (Minimalist) --- */}
      <section className="py-32 px-6 bg-neutral-950 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 text-white">
            LET'S CREATE <br /> SOMETHING <span className="italic font-serif text-gray-400">ICONIC.</span>
          </h2>
          <a 
            href="mailto:contact@email.com"
            className="inline-flex items-center gap-3 bg-white text-black px-10 py-5 rounded-full text-lg font-bold hover:bg-gray-200 transition-all transform hover:-translate-y-1"
          >
            Mulai Konsultasi <ArrowRight />
          </a>
        </motion.div>
      </section>

      {/* Footer Simple */}
      <footer className="border-t border-white/10 py-8 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} YourName Visuals. All rights reserved.</p>
      </footer>
    </div>
  );
}

// Komponen Kecil untuk Item Portfolio agar kodingan rapi
function PortfolioItem({ img, category, title, year, align }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className={`flex flex-col md:flex-row gap-8 md:gap-16 items-center ${align === 'right' ? 'md:flex-row-reverse' : ''}`}
    >
      {/* Image Side */}
      <div className="w-full md:w-3/5 overflow-hidden rounded-xl">
        <img 
          src={img} 
          alt={title} 
          className="w-full h-[400px] md:h-[500px] object-cover hover:scale-110 transition-transform duration-700 ease-in-out cursor-pointer grayscale hover:grayscale-0"
        />
      </div>

      {/* Text Side */}
      <div className="w-full md:w-2/5 space-y-4">
        <div className="flex items-center gap-4 text-sm tracking-widest text-gray-400 uppercase">
          <span>{category}</span>
          <span className="w-8 h-[1px] bg-gray-600"></span>
          <span>{year}</span>
        </div>
        <h3 className="text-4xl md:text-5xl font-bold leading-tight">{title}</h3>
        <p className="text-gray-400">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Visual storytelling that moves audience.</p>
        <button className="text-white border-b border-transparent hover:border-white transition-all pb-1 uppercase text-sm tracking-wider mt-4">
          View Case Study
        </button>
      </div>
    </motion.div>
  );
}