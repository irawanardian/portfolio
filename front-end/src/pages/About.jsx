import { motion } from "framer-motion";

export default function About() {
  return (
    <section className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
      <div className="max-w-xl w-full grid md:grid-cols-2 gap-12 items-center mt-12">
        {/* Foto atau Ilustrasi */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="rounded-2xl overflow-hidden shadow-xl"
        >
          <img
            src="/about.jpg" // Ganti dengan path fotomu
            alt="Irawan - Photographer & Videographer"
            className="object-cover w-full h-full"
          />
        </motion.div>

        {/* Deskripsi */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            Tentang Saya
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-4">
            Hai! Saya{" "}
            <span className="font-semibold text-slate-700">Irawan</span>,
            seorang{" "}
            <span className="text-indigo-600 font-medium">photographer</span> &{" "}
            <span className="text-indigo-600 font-medium">videographer</span>{" "}
            yang berfokus pada storytelling visual.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Dengan pengalaman dalam{" "}
            <em>wedding, prewedding, event, dan content creation</em>, saya
            percaya bahwa setiap momen punya cerita yang layak untuk diceritakan
            dengan cara yang estetis dan emosional.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Yuk, kolaborasi bareng untuk bikin karya yang berkesan.{" "}
            <a
              href="/contact"
              className="text-indigo-600 font-medium hover:underline"
            >
              Hubungi saya
            </a>{" "}
            kapan saja!
          </p>
        </motion.div>
      </div>
    </section>
  );
}
