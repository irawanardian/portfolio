import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Loader2,
  PlayCircle,
  X,
} from "lucide-react";
import { apiRequest } from "../lib/api";

const categories = [
  "All",
  "Wedding",
  "Prewedding",
  "Engagement",
  "Event",
  "Product Advertisement",
  "Live Streaming",
  "Corporate",
];

export default function Video() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [videosPerPage, setVideosPerPage] = useState(9);

  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const result = await apiRequest("/api/projects?category=video");
        setVideos(result.data || []);
      } catch (error) {
        setErrorMessage(
          "Unable to load motion works right now. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const filteredVideos =
    selectedCategory === "All"
      ? videos
      : videos.filter((video) => {
          const tags = Array.isArray(video.tags) ? video.tags : [];
          return tags.some(
            (tag) => tag.toLowerCase() === selectedCategory.toLowerCase()
          );
        });

  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);
  const startIndex = (currentPage - 1) * videosPerPage;
  const currentVideos = filteredVideos.slice(
    startIndex,
    startIndex + videosPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  useEffect(() => {
    const updateVideosPerPage = () => {
      if (window.innerWidth < 768) setVideosPerPage(4);
      else if (window.innerWidth < 1024) setVideosPerPage(6);
      else setVideosPerPage(9);
    };

    updateVideosPerPage();
    window.addEventListener("resize", updateVideosPerPage);

    return () => window.removeEventListener("resize", updateVideosPerPage);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 px-6 pb-20 pt-24 font-sans text-white">
      <div className="mx-auto mb-12 max-w-7xl">
        <Link
          to="/portfolio"
          className="group mb-6 inline-flex items-center gap-2 text-gray-500 transition-colors hover:text-white"
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
            Motion Works
          </p>

          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tighter md:text-7xl">
            CINEMATIC <br />
            <span className="bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
              STORIES.
            </span>
          </h1>

          <p className="max-w-3xl text-lg leading-relaxed text-gray-400 md:text-xl">
            A collection of motion works, visual stories, and moving moments
            shaped through rhythm, atmosphere, and real experience from the
            field.
          </p>
        </motion.div>
      </div>

      <div className="mx-auto mb-12 max-w-7xl">
        <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap rounded-full border px-6 py-2 text-sm font-medium transition-all duration-300 ${
                selectedCategory === cat
                  ? "border-white bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                  : "border-white/10 bg-transparent text-gray-400 hover:border-white hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl">
        {loading && <LoadingState />}

        {!loading && errorMessage && <ErrorState message={errorMessage} />}

        {!loading && !errorMessage && (
          <motion.div
            layout
            className="grid min-h-[400px] grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {currentVideos.length > 0 ? (
                currentVideos.map((video, index) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.3 }}
                    key={`${video.id || video.slug}-${selectedCategory}`}
                  >
                    <VideoProjectCard
                      video={video}
                      index={index}
                      onWatch={() => setActiveVideo(video)}
                    />
                  </motion.div>
                ))
              ) : (
                <EmptyState selectedCategory={selectedCategory} />
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && !errorMessage && totalPages > 1 && (
          <div className="mt-20 flex items-center justify-center gap-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`relative px-4 py-2 text-lg font-medium transition-colors ${
                    currentPage === page
                      ? "text-white"
                      : "text-gray-600 hover:text-gray-300"
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
              )
            )}
          </div>
        )}
      </div>

      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
    </div>
  );
}

function VideoProjectCard({ video, onWatch }) {
  const tags = Array.isArray(video.tags) ? video.tags : [];
  const primaryTag = tags[0] || "Motion Work";
  const hasPlayableVideo = Boolean(video.videoEmbed);

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/5 bg-neutral-900 transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-blue-900/20">
      <div className="relative aspect-video overflow-hidden bg-neutral-900">
        {video.coverImage ? (
          <img
            src={video.coverImage}
            alt={video.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white/[0.04] text-gray-600">
            <PlayCircle className="h-12 w-12" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

        <button
          type="button"
          onClick={hasPlayableVideo ? onWatch : undefined}
          disabled={!hasPlayableVideo}
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            hasPlayableVideo
              ? "opacity-0 group-hover:opacity-100"
              : "cursor-default opacity-0"
          }`}
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
            <PlayCircle className="h-8 w-8 fill-white/20 text-white" />
          </span>
        </button>

        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
          <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs uppercase tracking-[0.18em] text-gray-300 backdrop-blur-md">
            {primaryTag}
          </span>

          <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-gray-300 backdrop-blur-md">
            {video.year || "Active"}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h2 className="mb-3 text-2xl font-bold tracking-tight text-white">
          {video.title}
        </h2>

        <p className="mb-5 line-clamp-2 leading-relaxed text-gray-400">
          {video.shortDescription || video.description}
        </p>

        {tags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
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

        <div className="flex flex-wrap gap-3 border-t border-white/10 pt-5">
          {hasPlayableVideo && (
            <button
              type="button"
              onClick={onWatch}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:scale-105 hover:bg-gray-200"
            >
              Watch Video
              <PlayCircle className="h-4 w-4" />
            </button>
          )}

          {video.externalUrl && (
            <a
              href={video.externalUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Open Link
              <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function VideoModal({ video, onClose }) {
  if (!video) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 px-4 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-neutral-950"
        >
          <div className="flex items-center justify-between border-b border-white/10 p-5">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
                Now Playing
              </p>
              <h3 className="mt-1 text-xl font-bold text-white">
                {video.title}
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white transition hover:bg-white hover:text-black"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="bg-black">
            <iframe
              src={video.videoEmbed}
              title={`${video.title} video`}
              className="aspect-video w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function LoadingState() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
      <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-gray-400" />
      <p className="text-gray-400">Loading motion works...</p>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-10 text-center">
      <p className="text-red-200">{message}</p>
    </div>
  );
}

function EmptyState({ selectedCategory }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500"
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
        <PlayCircle size={32} className="opacity-50" />
      </div>

      <p>
        {selectedCategory === "All"
          ? "No motion works found."
          : `No video found in ${selectedCategory}.`}
      </p>
    </motion.div>
  );
}