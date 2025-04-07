import { Link } from "react-router-dom";

export default function Portfolio() {
  return (
    <div className="font-roboto bg-black min-h-screen flex flex-col justify-center items-center text-white">
      <h1 className="text-3xl font-semibold mb-6">Pilih Kategori Portfolio</h1>
      <div className="space-x-4">
        <Link
          to="/portfolio/foto"
          className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          Foto
        </Link>
        <Link
          to="/portfolio/video"
          className="px-6 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition"
        >
          Video
        </Link>
      </div>
    </div>
  );
}
