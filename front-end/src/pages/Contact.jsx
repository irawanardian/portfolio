import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, ArrowRight, Send, Instagram, Linkedin, Youtube } from "lucide-react";

export default function Contact() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    service: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logika kirim form di sini (misal ke EmailJS atau Formspree)
    alert("Terima kasih! Pesan Anda telah terkirim (Simulasi).");
  };

  return (
    <div className="bg-neutral-950 min-h-screen text-white pt-24 pb-20 px-6 font-sans selection:bg-white selection:text-black">
      
      {/* --- HEADER --- */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto mb-20 md:mb-32"
      >
        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-6">
          LET'S START <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-700">A PROJECT.</span>
        </h1>
        <div className="h-1 w-24 bg-white/20"></div>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
        
        {/* --- LEFT COLUMN: INFO & SOCIALS --- */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-12">
            Punya ide visual yang ingin diwujudkan? Atau sekadar ingin menyapa? 
            Saya selalu terbuka untuk diskusi proyek baru, kolaborasi kreatif, 
            atau sekadar ngopi bareng.
          </p>

          <div className="space-y-8">
            <ContactItem icon={<Mail />} label="Email" value="hello@yourvisuals.com" href="mailto:hello@yourvisuals.com" />
            <ContactItem icon={<Phone />} label="Phone/WhatsApp" value="+62 812 3456 7890" href="https://wa.me/6281234567890" />
            <ContactItem icon={<MapPin />} label="Studio" value="Jakarta Selatan, Indonesia" />
          </div>

          {/* Social Icons */}
          <div className="mt-16 flex gap-6">
            <SocialButton icon={<Instagram />} href="#" />
            <SocialButton icon={<Youtube />} href="#" />
            <SocialButton icon={<Linkedin />} href="#" />
          </div>
        </motion.div>

        {/* --- RIGHT COLUMN: THE FORM --- */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-neutral-900/30 p-8 md:p-12 rounded-3xl border border-white/5"
        >
          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* Input Name */}
            <div className="relative group">
              <input
                type="text"
                name="name"
                id="name"
                value={formState.name}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-gray-700 py-4 text-xl text-white focus:outline-none focus:border-white transition-colors peer placeholder-transparent"
                placeholder="Nama Anda"
                required
              />
              <label 
                htmlFor="name" 
                className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-4 peer-focus:-top-3.5 peer-focus:text-white peer-focus:text-sm"
              >
                Siapa Nama Anda?
              </label>
            </div>

            {/* Input Email */}
            <div className="relative group">
              <input
                type="email"
                name="email"
                id="email"
                value={formState.email}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-gray-700 py-4 text-xl text-white focus:outline-none focus:border-white transition-colors peer placeholder-transparent"
                placeholder="Email Anda"
                required
              />
              <label 
                htmlFor="email" 
                className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-4 peer-focus:-top-3.5 peer-focus:text-white peer-focus:text-sm"
              >
                Email Address
              </label>
            </div>

            {/* Input Service (Dropdown Style but Minimalist) */}
            <div className="relative group">
              <select
                name="service"
                id="service"
                value={formState.service}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-gray-700 py-4 text-xl text-white focus:outline-none focus:border-white transition-colors appearance-none cursor-pointer"
              >
                <option value="" disabled className="bg-neutral-900 text-gray-500">Pilih Jenis Project</option>
                <option value="wedding" className="bg-neutral-900">Wedding / Prewedding</option>
                <option value="commercial" className="bg-neutral-900">Commercial / Brand</option>
                <option value="event" className="bg-neutral-900">Event Documentation</option>
                <option value="other" className="bg-neutral-900">Lainnya</option>
              </select>
              <label className="absolute left-0 -top-3.5 text-gray-500 text-sm">
                Apa yang bisa saya bantu?
              </label>
            </div>

            {/* Input Message */}
            <div className="relative group">
              <textarea
                name="message"
                id="message"
                rows="4"
                value={formState.message}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-gray-700 py-4 text-xl text-white focus:outline-none focus:border-white transition-colors peer placeholder-transparent resize-none"
                placeholder="Ceritakan tentang project Anda"
                required
              ></textarea>
              <label 
                htmlFor="message" 
                className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-4 peer-focus:-top-3.5 peer-focus:text-white peer-focus:text-sm"
              >
                Ceritakan Detail Project Anda
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="group w-full bg-white text-black py-5 rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:bg-gray-200 transition-all transform hover:-translate-y-1"
            >
              Kirim Pesan 
              <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>

          </form>
        </motion.div>

      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function ContactItem({ icon, label, value, href }) {
  const content = (
    <div className="flex items-center gap-6 group cursor-pointer">
      <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:border-white transition-all">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-lg md:text-xl font-medium text-white group-hover:text-gray-300 transition-colors">{value}</p>
      </div>
    </div>
  );

  return href ? <a href={href} target="_blank" rel="noopener noreferrer">{content}</a> : content;
}

function SocialButton({ icon, href }) {
  return (
    <a 
      href={href} 
      className="w-14 h-14 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-110"
    >
      {icon}
    </a>
  );
}