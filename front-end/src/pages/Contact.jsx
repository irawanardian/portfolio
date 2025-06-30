export default function Contact() {
  return (
    <section className="min-h-screen px-4 py-16 bg-gray-50 flex items-center justify-center mt-12">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-slate-700 text-center mb-6">
          Kontak Saya
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Punya pertanyaan atau ingin bekerja sama? Kirim pesan melalui form di
          bawah ini.
        </p>

        <form className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700"
            >
              Nama
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Nama kamu"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="email@example.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-slate-700"
            >
              Pesan
            </label>
            <textarea
              id="message"
              rows="4"
              className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Tulis pesanmu di sini..."
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 bg-slate-700 text-white font-semibold rounded-xl hover:bg-slate-900 transition"
          >
            Kirim Pesan
          </button>
        </form>
      </div>
    </section>
  );
}
