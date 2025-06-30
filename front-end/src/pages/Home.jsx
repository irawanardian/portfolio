// src/components/Home.jsx atau src/pages/Home.jsx
import React from "react";

// Asumsi Anda memiliki styling global atau file CSS yang mendukung kelas-kelas ini.
// Contoh jika Anda menggunakan Tailwind CSS, kelas-kelas ini akan berfungsi.
// Jika tidak, Anda perlu mendefinisikan CSS kustom untuk kelas-kelas seperti
// 'animate-fade-in-up', 'delay-200', 'group-hover:scale-105', dll.

export default function Home() {
  return (
    <div className="home-container overflow-hidden">
      {" "}
      {/* overflow-hidden untuk mencegah scrollbar horizontal dari animasi/parallax */}
      {/* Video Hero Banner dengan Overlay & Tagline Kuat */}
      <section className="relative w-full h-screen flex items-center justify-center text-center overflow-hidden">
        {/* Latar Belakang Gambar Hero */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center z-0 parallax-bg"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg')",
          }} // Ganti dengan path gambar Anda
        ></div>
        {/* Lapisan Overlay untuk Efek Visual & Tone */}
        <div className="absolute inset-0 z-0 bg-black opacity-40"></div>{" "}
        {/* Lapisan gelap untuk kontras */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>{" "}
        {/* Gradien gelap dari bawah */}
        <div className="absolute inset-0 z-0 film-grain-overlay"></div>{" "}
        {/* Efek film grain (dari CSS sebelumnya) */}
        {/* Konten Teks dan Tombol CTA */}
        <div className="relative z-10 flex flex-col justify-center items-center p-4">
          <h1 className="text-white text-5xl md:text-7xl font-extrabold leading-tight mb-4 drop-shadow-lg animate-fade-in-up">
            ABADI BERSAMA VISUAL. <br /> KISAH ANDA, KARYA SAYA.
          </h1>
          <p className="text-gray-200 text-lg md:text-xl max-w-3xl mx-auto mb-10 drop-shadow-md animate-fade-in-up delay-200">
            Sebagai videographer, saya mengubah momen berharga dan ide-ide
            brilian menjadi narasi visual yang powerful dan tak terlupakan.
          </p>
          <a
            href="/portfolio" // Pastikan path ini benar
            className="inline-block bg-white text-black py-4 px-12 rounded-full text-xl font-bold uppercase tracking-wider hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg animate-fade-in-up delay-400"
          >
            Jelajahi Portofolio
          </a>
        </div>
      </section>
      {/* Section Perkenalan Singkat dengan Penekanan */}
      <section className="container mx-auto my-20 px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 animate-slide-in-right">
          Mengapa Memilih Saya?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-10">
          <div className="p-6 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in delay-200">
            <h3 className="text-2xl font-semibold mb-3 text-blue-700">
              Kualitas Sinematik
            </h3>
            <p className="text-gray-700">
              Setiap frame dibuat dengan perhatian detail, menghadirkan estetika
              visual yang menawan dan profesional.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in delay-400">
            <h3 className="text-2xl font-semibold mb-3 text-blue-700">
              Penceritaan Emosional
            </h3>
            <p className="text-gray-700">
              Saya fokus pada narasi yang kuat, memastikan video Anda tidak
              hanya dilihat, tetapi juga dirasakan.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in delay-600">
            <h3 className="text-2xl font-semibold mb-3 text-blue-700">
              Fleksibilitas & Inovasi
            </h3>
            <p className="text-gray-700">
              Mampu beradaptasi dengan berbagai proyek, dari personal hingga
              korporat, dengan ide-ide segar.
            </p>
          </div>
        </div>
        <a
          href="/about" // Ganti dengan path ke halaman about Anda
          className="mt-16 inline-block bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 px-10 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-blue-900 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Kenali Saya Lebih Dalam
        </a>
      </section>
      {/* Bagian Portofolio Unggulan dengan Efek Hover */}
      <section className="bg-gray-900 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-white animate-slide-in-left">
            Karya Pilihan Saya
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Proyek Contoh 1 */}
            <div className="group relative rounded-xl overflow-hidden shadow-2xl transform transition-transform duration-500 hover:scale-[1.02] animate-fade-in delay-200">
              <img
                src="src/assets/thumbnailProductAdvertisement/2.png"
                alt="Thumbnail Corporate Event"
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-white text-2xl font-bold mb-2">
                  Dokumentasi Event Korporat
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  Menangkap esensi dan dinamika acara profesional.
                </p>
                <a
                  href="/portfolio/corporate-event"
                  className="text-blue-400 hover:text-blue-200 font-semibold underline"
                >
                  Tonton Sekarang &rarr;
                </a>
              </div>
            </div>

            {/* Proyek Contoh 2 */}
            <div className="group relative rounded-xl overflow-hidden shadow-2xl transform transition-transform duration-500 hover:scale-[1.02] animate-fade-in delay-400">
              <img
                src="src/assets/thumbnailWedding/1.dedeCaca.png"
                alt="Thumbnail Wedding Film"
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-white text-2xl font-bold mb-2">
                  Film Pernikahan Tak Terlupakan
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  Mengabadikan kisah cinta Anda dalam visual yang abadi.
                </p>
                <a
                  href="/portfolio/wedding-film"
                  className="text-blue-400 hover:text-blue-200 font-semibold underline"
                >
                  Tonton Sekarang &rarr;
                </a>
              </div>
            </div>

            {/* Proyek Contoh 3 */}
            <div className="group relative rounded-xl overflow-hidden shadow-2xl transform transition-transform duration-500 hover:scale-[1.02] animate-fade-in delay-600">
              <img
                src="src/assets/thumbnailProductAdvertisement/5.jpg"
                alt="Thumbnail Product Promo"
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-white text-2xl font-bold mb-2">
                  Video Promosi Produk Kreatif
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  Meningkatkan penjualan dengan visual yang menarik perhatian.
                </p>
                <a
                  href="/portfolio/product-promo"
                  className="text-blue-400 hover:text-blue-200 font-semibold underline"
                >
                  Tonton Sekarang &rarr;
                </a>
              </div>
            </div>
          </div>
          <a
            href="/portfolio" // Ganti dengan path ke halaman semua portofolio
            className="mt-16 inline-block bg-white text-gray-900 py-4 px-12 rounded-full text-lg font-bold uppercase tracking-wider hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Lihat Semua Proyek
          </a>
        </div>
      </section>
      {/* Bagian Testimonial */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-gray-900 animate-slide-in-right">
            Apa Kata Klien Saya
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="p-8 bg-blue-50 rounded-xl shadow-md transform transition-transform duration-300 hover:scale-105 animate-fade-in delay-200">
              <p className="text-lg italic text-gray-700 mb-6">
                "Kerja sama dengan [Nama Anda] benar-benar luar biasa! Hasil
                videonya melampaui ekspektasi kami, sangat sinematik dan mampu
                menangkap setiap detail penting acara perusahaan kami."
              </p>
              <p className="font-semibold text-gray-800">
                - Jane Doe, CEO Creative Solutions
              </p>
            </div>
            <div className="p-8 bg-blue-50 rounded-xl shadow-md transform transition-transform duration-300 hover:scale-105 animate-fade-in delay-400">
              <p className="text-lg italic text-gray-700 mb-6">
                "[Nama Anda] membuat film pernikahan kami menjadi sebuah
                mahakarya. Mereka sangat profesional, ramah, dan hasil akhirnya
                membuat kami terharu. Sangat direkomendasikan!"
              </p>
              <p className="font-semibold text-gray-800">
                - Sarah & Tom, Pasangan Pengantin
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Panggilan Aksi Akhir yang Lebih Kuat */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-24 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-8 drop-shadow-lg animate-fade-in-up">
            Siap Mewujudkan Proyek Video Anda?
          </h2>
          <p className="text-lg md:text-xl max-w-4xl mx-auto mb-12 opacity-90 animate-fade-in-up delay-200">
            Jangan biarkan ide-ide brilian Anda hanya menjadi angan. Hubungi
            saya sekarang untuk konsultasi gratis dan mari kita mulai
            menciptakan visual yang tak terlupakan.
          </p>
          <a
            href="/contact" // Ganti dengan path ke halaman kontak Anda
            className="inline-block bg-white text-blue-800 py-5 px-16 rounded-full text-xl font-bold uppercase tracking-wider hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-xl animate-fade-in-up delay-400"
          >
            Mulai Proyek Anda Sekarang!
          </a>
        </div>
      </section>
    </div>
  );
}
