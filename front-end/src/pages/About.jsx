import React from "react";
import { motion } from "framer-motion";
import { Camera, Film, Award, Coffee, ArrowRight } from "lucide-react";

// Variabel Animasi (Sama dengan Home agar konsisten)
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function About() {
  return (
    <div className="bg-neutral-950 min-h-screen text-white font-sans selection:bg-white selection:text-black pt-20">
      
      {/* --- HEADER TITLE --- */}
      <section className="px-6 py-20 md:py-32 container mx-auto">
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={stagger}
          className="max-w-4xl"
        >
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-8xl font-bold tracking-tighter mb-6">
            THE MAN BEHIND <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-700">THE LENS.</span>
          </motion.h1>
          <motion.div variants={fadeInUp} className="h-1 w-24 bg-white/20 mb-8"></motion.div>
        </motion.div>
      </section>

      {/* --- MAIN CONTENT (Split Layout) --- */}
      <section className="container mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* LEFT: IMAGE (Sticky effect) */}
          <div className="lg:col-span-5 relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="sticky top-32"
            >
              <div className="relative rounded-sm overflow-hidden group">
                {/* Frame Border Effect */}
                <div className="absolute inset-0 border border-white/10 z-10 m-2 pointer-events-none"></div>
                
                <img
                  src="/about.jpg" // Pastikan ada foto profil yang keren di public folder
                  alt="Irawan Profile"
                  className="w-full h-[600px] object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out"
                />
                
                {/* Signature / Name Overlay */}
                <div className="absolute bottom-6 left-6 z-20 bg-black/50 backdrop-blur-md px-4 py-2 border border-white/10">
                  <p className="text-sm tracking-widest uppercase font-bold text-white">Irawan Visuals</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mt-8 border-t border-white/10 pt-8">
                <div className="text-center">
                  <h3 className="text-3xl font-bold">5+</h3>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Years</p>
                </div>
                <div className="text-center border-l border-white/10">
                  <h3 className="text-3xl font-bold">100+</h3>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Projects</p>
                </div>
                <div className="text-center border-l border-white/10">
                  <h3 className="text-3xl font-bold">∞</h3>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Coffees</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: NARRATIVE */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Intro */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-3">
                <span className="w-8 h-[1px] bg-white"></span> Storyteller First
              </h2>
              <p className="text-xl md:text-2xl text-gray-400 leading-relaxed font-light">
                "Saya percaya bahwa setiap frame harus memiliki jiwa. Bukan sekadar dokumentasi, tapi sebuah interpretasi visual yang membangkitkan emosi."
              </p>
            </motion.div>

            {/* Biography */}
            <motion.div 
              className="text-gray-400 space-y-6 leading-relaxed text-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <p>
                Hai, saya <strong className="text-white">Irawan</strong>. Perjalanan saya dimulai dari sekadar hobi menangkap momen jalanan, yang kemudian berkembang menjadi obsesi terhadap cahaya, komposisi, dan narasi.
              </p>
              <p>
                Sebagai seorang <span className="text-white underline decoration-blue-500/50 underline-offset-4">Photographer & Videographer</span>, saya tidak hanya menekan tombol shutter. Saya mengamati, merasakan, dan kemudian merangkum momen tersebut agar abadi.
              </p>
              <p>
                Spesialisasi saya mencakup <em>Wedding Cinematic, Corporate Branding,</em> hingga <em>Creative Commercials</em>. Pendekatan saya selalu personal: Saya ingin mengenal Anda, memahami visi Anda, dan menerjemahkannya ke dalam bahasa visual yang elegan.
              </p>
            </motion.div>

            {/* What I Do (Grid Kecil) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
               <ServiceCard 
                 icon={<Camera className="w-6 h-6" />}
                 title="Photography"
                 desc="Editorial, Portrait, Event Documentation dengan sentuhan artistik."
               />
               <ServiceCard 
                 icon={<Film className="w-6 h-6" />}
                 title="Videography"
                 desc="Cinematic Storytelling, Grading warna yang dalam, dan sound design imersif."
               />
               <ServiceCard 
                 icon={<Award className="w-6 h-6" />}
                 title="Creative Direction"
                 desc="Membantu Anda menyusun konsep visual dari nol hingga eksekusi final."
               />
               <ServiceCard 
                 icon={<Coffee className="w-6 h-6" />}
                 title="Post-Production"
                 desc="Editing detail tinggi menggunakan software standar industri."
               />
            </div>

            {/* CTA Button */}
            <div className="pt-10">
              <a 
                href="/contact" 
                className="inline-flex items-center gap-4 text-white font-bold text-lg hover:text-gray-300 transition-colors group"
              >
                Mari Bicarakan Project Anda <ArrowRight className="group-hover:translate-x-2 transition-transform"/>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* --- GEAR SECTION (Optional: Menambah kesan pro) --- */}
      <section className="border-t border-white/5 py-20 bg-neutral-900/50">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm font-bold tracking-widest text-gray-500 uppercase mb-8">Selected Gear & Tools</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Ganti teks ini dengan Logo SVG jika mau, atau biarkan teks minimalis */}
             <span className="text-xl font-bold font-serif">SONY Alpha</span>
             <span className="text-xl font-bold font-serif">DJI Drones</span>
             <span className="text-xl font-bold font-serif">Adobe Creative Cloud</span>
             <span className="text-xl font-bold font-serif">DaVinci Resolve</span>
          </div>
        </div>
      </section>

    </div>
  );
}

// Komponen Kecil untuk Service Card
function ServiceCard({ icon, title, desc }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white/5 p-6 rounded-xl border border-white/5 hover:border-white/20 transition-all"
    >
      <div className="text-gray-300 mb-4">{icon}</div>
      <h3 className="text-white text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
    </motion.div>
  )
}