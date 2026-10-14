import MobilePhotoMasonry from "../components/portfolio/MobilePhotoMasonry";
import { photoImageUrl, photoSrcSet, fallbackPhotoImage } from "../lib/photoImages";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Camera,
  ChevronLeft,
  ChevronRight,
  Images,
  Loader2,
  X,
} from "lucide-react";
import { apiRequest } from "../lib/api";

export default function PhotoAlbumDetail() {
  const { slug } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);
  const [mobileVisibleCount, setMobileVisibleCount] = useState(12);
  const swipeStart = useRef(null);

  const handleTouchStart = (event) => {
    if (event.touches.length !== 1) {
      swipeStart.current = null;
      return;
    }

    swipeStart.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
  };

  const handleTouchEnd = (event) => {
    const start = swipeStart.current;
    swipeStart.current = null;

    if (
      !start ||
      event.changedTouches.length !== 1 ||
      displayImages.length < 2
    ) {
      return;
    }

    const deltaX = event.changedTouches[0].clientX - start.x;
    const deltaY = event.changedTouches[0].clientY - start.y;

    // Abaikan sentuhan kecil atau scroll vertikal.
    if (
      Math.abs(deltaX) < 55 ||
      Math.abs(deltaX) <= Math.abs(deltaY) * 1.2
    ) {
      return;
    }

    setActiveIndex((index) => {
      if (index === null) return null;

      if (deltaX < 0) {
        return (index + 1) % displayImages.length;
      }

      return (
        index - 1 + displayImages.length
      ) % displayImages.length;
    });
  };


  useEffect(() => {
    let cancelled = false;

    async function loadAlbum() {
      setLoading(true);
      setError("");
      setAlbum(null);
      setActiveIndex(null);
      setMobileVisibleCount(12);

      try {
        const result = await apiRequest(
          "/api/projects?category=photo"
        );

        const found = (result.data || []).find(
          (item) => item.slug === slug
        );

        if (!cancelled) {
          if (found) {
            setAlbum(found);
          } else {
            setError("Photo album not found.");
          }
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load this photo album.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAlbum();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const gallery = (Array.isArray(album?.images) ? album.images : [])
    .filter(
      (image) =>
        image.imageUrl &&
        image.imageType !== "cover_slider"
    )
    .sort(
      (a, b) =>
        Number(a.sortOrder || 0) -
          Number(b.sortOrder || 0) ||
        Number(a.id || 0) - Number(b.id || 0)
    );

  const displayImages = gallery.length
    ? gallery
    : album?.coverImage
      ? [{
          id: "cover",
          imageUrl: album.coverImage,
          caption: album.title,
        }]
      : [];

  useEffect(() => {
    if (activeIndex === null) return;

    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((index) =>
          (index + 1) % displayImages.length
        );
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((index) =>
          (index - 1 + displayImages.length) %
          displayImages.length
        );
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, displayImages.length]);

  const selectedImage =
    activeIndex !== null ? displayImages[activeIndex] : null;

  return (
    <main className="min-h-screen bg-neutral-950 px-6 pb-24 pt-24 text-white">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/portfolio/foto"
          className="mb-10 inline-flex items-center gap-2 text-sm uppercase tracking-widest text-gray-400 transition hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to Photo Albums
        </Link>

        {loading && (
          <div className="flex min-h-[400px] items-center justify-center">
            <Loader2 className="h-9 w-9 animate-spin text-gray-500" />
          </div>
        )}

        {!loading && error && (
          <div className="rounded-3xl border border-white/10 p-12 text-center">
            <p className="text-xl text-gray-300">{error}</p>
          </div>
        )}

        {!loading && album && (
          <>
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <p className="mb-5 text-xs uppercase tracking-[0.3em] text-gray-500">
                Photo Stories / {album.year || "Portfolio"}
              </p>

              <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-7xl">
                {album.title}
              </h1>

              <p className="max-w-3xl text-lg leading-relaxed text-gray-400">
                {album.shortDescription || album.description}
              </p>

              {Array.isArray(album.tags) && album.tags.length > 0 && (
                <div className="mt-7 flex flex-wrap gap-2">
                  {album.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 px-4 py-2 text-xs text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.header>

            {album.coverImage && (
              <div className="mb-14 overflow-hidden rounded-3xl bg-neutral-900">
                <img
                  src={photoImageUrl(album.coverImage, "preview")}
                  srcSet={photoSrcSet(album.coverImage)}
                  sizes="(max-width: 768px) 100vw, 1200px"
                  onError={(event) =>
                    fallbackPhotoImage(event, album.coverImage)
                  }
                  alt={`${album.title} cover`}
                  className="max-h-[650px] w-full object-cover"
                />
              </div>
            )}

            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div className="flex items-center gap-3">
                <Camera className="h-6 w-6" />
                <h2 className="text-2xl font-bold">
                  Photo Gallery
                </h2>
              </div>

              <span className="text-sm text-gray-500">
                {gallery.length} Photographs
              </span>
            </div>

            {album.description && (
              <p className="mb-12 max-w-3xl whitespace-pre-line leading-relaxed text-gray-400">
                {album.description}
              </p>
            )}

            {displayImages.length ? (
              <>
                <MobilePhotoMasonry
                  images={displayImages.slice(0, mobileVisibleCount)}
                  albumTitle={album.title}
                  onOpen={setActiveIndex}
                />

                <div className="hidden sm:block sm:columns-2 sm:gap-5 sm:space-y-5 lg:columns-3">
                {displayImages.map((image, index) => (
                  <motion.button
                    key={image.id || index}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className={`group relative w-full break-inside-avoid overflow-hidden rounded-xl bg-neutral-900 text-left sm:rounded-2xl ${index >= mobileVisibleCount ? "hidden sm:block" : "block"}`}
                    aria-label={`View photograph ${index + 1}`}
                  >
                    <img
                      src={photoImageUrl(image.imageUrl, "thumbnail")}
                      srcSet={photoSrcSet(image.imageUrl)}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                      onError={(event) =>
                        fallbackPhotoImage(event, image.imageUrl)
                      }
                      alt={image.caption || `${album.title} ${index + 1}`}
                      loading="lazy"
                      className="h-auto w-full transition-transform duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="rounded-full border border-white/30 bg-black/40 px-5 py-3 text-sm backdrop-blur-md">
                        View Photo
                      </span>
                    </div>
                  </motion.button>
                ))}
                </div>
              </>
            ) : (
              <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-3xl border border-white/10">
                <Images className="h-10 w-10 text-gray-500" />
                <p className="text-gray-400">
                  No photographs available yet.
                </p>
              </div>
            )}


            {displayImages.length > mobileVisibleCount && (
              <div className="mt-8 text-center sm:hidden">
                <p className="mb-4 text-sm text-gray-400">
                  Showing {mobileVisibleCount} of {displayImages.length} photos
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setMobileVisibleCount((count) =>
                      Math.min(count + 12, displayImages.length)
                    )
                  }
                  className="rounded-full border border-white/20 bg-white/10 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Load More Photos
                </button>
              </div>
            )}

            <div className="mt-20 border-t border-white/10 pt-10">
              <Link
                to="/portfolio/foto"
                className="inline-flex items-center gap-3 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold transition hover:bg-white hover:text-black"
              >
                <ArrowLeft size={18} />
                Explore More Albums
              </Link>
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            className="fixed inset-0 z-[100] flex flex-col bg-black/95"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <p className="truncate pr-4 text-sm font-medium">
                {album.title}
              </p>

              <button
                type="button"
                aria-label="Close viewer"
                onClick={() => setActiveIndex(null)}
                className="rounded-full p-3 transition hover:bg-white/10"
              >
                <X size={24} />
              </button>
            </div>

            <div
              className="relative flex min-h-0 flex-1 items-center justify-center p-4 md:p-10"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={() => {
                swipeStart.current = null;
              }}
              style={{ touchAction: "pan-y" }}
            >
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.caption || album.title}
                className="max-h-full max-w-full object-contain"
              />

              {displayImages.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous photograph"
                    onClick={() =>
                      setActiveIndex((index) =>
                        (index - 1 + displayImages.length) %
                        displayImages.length
                      )
                    }
                    className="absolute left-2 rounded-full bg-black/60 p-3 transition hover:bg-white/20 md:left-8"
                  >
                    <ChevronLeft size={26} />
                  </button>

                  <button
                    type="button"
                    aria-label="Next photograph"
                    onClick={() =>
                      setActiveIndex((index) =>
                        (index + 1) % displayImages.length
                      )
                    }
                    className="absolute right-2 rounded-full bg-black/60 p-3 transition hover:bg-white/20 md:right-8"
                  >
                    <ChevronRight size={26} />
                  </button>
                </>
              )}
            </div>

            <div className="flex justify-between gap-4 border-t border-white/10 px-5 py-4 text-sm text-gray-400">
              <p className="truncate">
                {selectedImage.caption || album.title}
              </p>
              <span className="shrink-0">
                {activeIndex + 1} / {displayImages.length}
              </span>
            </div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
