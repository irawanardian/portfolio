import { photoImageUrl, photoSrcSet, fallbackPhotoImage } from "../lib/photoImages";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Images,
  Loader2,
} from "lucide-react";
import { apiRequest } from "../lib/api";

const categories = [
  "All",
  "Wedding",
  "Prewedding",
  "Engagement",
  "Portrait",
  "Event",
  "Product",
  "Landscape",
  "Street",
  "Corporate",
];

export default function Foto() {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(9);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadPhotos() {
      try {
        const result = await apiRequest(
          "/api/projects?category=photo"
        );

        if (!cancelled) {
          setPhotos(
            Array.isArray(result.data) ? result.data : []
          );
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load photo albums right now.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPhotos();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const update = () => {
      setPerPage(window.innerWidth < 768 ? 12 : 9);
    };

    update();
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, perPage]);

  const filteredPhotos = photos.filter((photo) => {
    if (selectedCategory === "All") return true;

    return (photo.tags || []).some(
      (tag) =>
        tag.toLowerCase() === selectedCategory.toLowerCase()
    );
  });

  const totalPages = Math.ceil(filteredPhotos.length / perPage);

  const currentPhotos = filteredPhotos.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <div className="min-h-screen bg-neutral-950 px-6 pb-24 pt-24 font-sans text-white">
      <div className="mx-auto mb-12 max-w-7xl">
        <Link
          to="/portfolio"
          className="group mb-6 inline-flex items-center gap-2 text-gray-500 transition hover:text-white"
        >
          <ArrowLeft
            size={20}
            className="transition-transform group-hover:-translate-x-1"
          />
          <span className="text-sm font-medium uppercase tracking-widest">
            Back to Portfolio
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-gray-500">
            Photo Stories
          </p>

          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tighter md:text-7xl">
            VISUAL <br />
            <span className="bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
              JOURNAL.
            </span>
          </h1>

          <p className="max-w-3xl text-lg leading-relaxed text-gray-400 md:text-xl">
            A collection of still moments, visual details,
            and stories captured through light, composition,
            and real experience from the field.
          </p>
        </motion.div>
      </div>

      {/* CATEGORY FILTER */}
      <div className="mx-auto mb-12 max-w-7xl">
        <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-4">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap rounded-full border px-6 py-2 text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? "border-white bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                  : "border-white/10 text-gray-400 hover:border-white hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* PHOTO ALBUMS */}
      <div className="mx-auto max-w-7xl">
        {loading && (
          <div className="flex min-h-[350px] items-center justify-center">
            <Loader2 className="h-9 w-9 animate-spin text-gray-500" />
          </div>
        )}

        {!loading && error && (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-12 text-center text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && currentPhotos.length === 0 && (
          <div className="flex min-h-[350px] flex-col items-center justify-center gap-4 rounded-3xl border border-white/10 bg-white/[0.02] text-center">
            <Images className="h-12 w-12 text-gray-600" />
            <h2 className="text-2xl font-semibold">
              No Photo Albums Yet
            </h2>
            <p className="max-w-sm px-4 text-gray-500">
              Photo stories for this category will appear here.
            </p>
          </div>
        )}

        {!loading && !error && currentPhotos.length > 0 && (
          <motion.div
            layout
            className="grid grid-cols-3 gap-2 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {currentPhotos.map((photo) => (
                <motion.div
                  key={`${photo.id}-${selectedCategory}`}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.3 }}
                >
                  <PhotoCard
                    photo={photo}
                    onOpen={() => navigate(`/portfolio/foto/${encodeURIComponent(photo.slug)}`)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
          <div className="mt-20 flex flex-wrap items-center justify-center gap-4">
            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => {
                  setCurrentPage(page);
                  window.scrollTo({
                    top: 350,
                    behavior: "smooth",
                  });
                }}
                className={`relative px-4 py-2 text-lg font-medium transition ${
                  currentPage === page
                    ? "text-white"
                    : "text-gray-600 hover:text-white"
                }`}
              >
                {page}
                {currentPage === page && (
                  <motion.div
                    layoutId="photo-pagination"
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

function PhotoCard({ photo, onOpen }) {
  const tags = Array.isArray(photo.tags) ? photo.tags : [];
  const primaryTag = tags[0] || "Photography";

  const image =
    photo.coverImage ||
    photo.images?.[0]?.imageUrl ||
    null;

  return (
    <article className="group h-full overflow-hidden rounded-lg border border-white/5 bg-neutral-900 transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-white/5 sm:rounded-2xl">
      <button
        type="button"
        onClick={onOpen}
        className="relative block aspect-square w-full overflow-hidden bg-neutral-800 text-left sm:aspect-video"
        aria-label={`View album ${photo.title}`}
      >
        {image ? (
          <img
            src={photoImageUrl(image, "thumbnail")}
            srcSet={photoSrcSet(image)}
            sizes="(max-width: 640px) 33vw, (max-width: 1024px) 50vw, 33vw"
            onError={(event) => fallbackPhotoImage(event, image)}
            alt={photo.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Images className="h-12 w-12 text-gray-600" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="rounded-full bg-white/15 p-5 backdrop-blur-md">
            <Images className="h-8 w-8 text-white" />
          </span>
        </div>

        <div className="absolute bottom-4 left-4 right-4 hidden items-center justify-between gap-3 sm:flex">
          <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs uppercase tracking-widest text-gray-200 backdrop-blur-md">
            {primaryTag}
          </span>

          <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-gray-300 backdrop-blur-md">
            {photo.year || "Active"}
          </span>
        </div>
      </button>

      <div className="p-2 sm:p-6">
        <h2 className="mb-0 line-clamp-2 text-[11px] font-bold leading-snug tracking-tight sm:mb-3 sm:text-2xl">
          <button
            type="button"
            onClick={onOpen}
            className="text-left transition hover:text-gray-300"
          >
            {photo.title}
          </button>
        </h2>

        <p className="mb-5 hidden line-clamp-2 min-h-[3rem] leading-relaxed text-gray-400 sm:block">
          {photo.shortDescription ||
            photo.description ||
            "A visual story captured through photography."}
        </p>

        {tags.length > 0 && (
          <div className="mb-6 hidden flex-wrap gap-2 sm:flex">
            {tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="hidden border-t border-white/10 pt-5 sm:block">
          <button
            type="button"
            onClick={onOpen}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:scale-105 hover:bg-gray-200"
          >
            View Album
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
