import { useState, useEffect } from "react";
import CategoryFilter from "../components/CategoryFilter";
import VideoCard from "../components/VideoCard";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { videos } from "../assets/data/videos"; // Import data video

export default function Video() {
  const categories = [
    "Wedding",
    "Prewedding",
    "Engagement",
    "Event",
    "Product Advertisement",
    "Live Streaming",
    "Corporate",
  ];

  const [selectedCategory, setSelectedCategory] = useState("Wedding");
  const [currentPage, setCurrentPage] = useState(1);
  const [videosPerPage, setVideosPerPage] = useState(8);

  const filteredVideos = videos.filter(
    (video) => video.category === selectedCategory
  );

  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);
  const startIndex = (currentPage - 1) * videosPerPage;
  const currentVideos = filteredVideos.slice(
    startIndex,
    startIndex + videosPerPage
  );

  useEffect(() => {
    const updateVideosPerPage = () => {
      setVideosPerPage(window.innerWidth < 768 ? 4 : 8);
    };

    updateVideosPerPage();
    window.addEventListener("resize", updateVideosPerPage);
    return () => window.removeEventListener("resize", updateVideosPerPage);
  }, []);

  return (
    <div className="font-roboto relative bg-black">
      <div id="video-section" className="max-full p-6">
        <div className="w-8 h-8 mt-[90px] mb-16">
          <Link to="/portfolio">
            <ArrowLeft
              size={28}
              className="text-white hover:text-gray-400 transition"
            />
          </Link>
        </div>
        <h1 className="text-3xl font-semibold text-start text-white mt-[5px] mb-[30px] font-roboto">
          Video Portfolio
        </h1>
        <div className="ml-[-10px]">
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 min-h-[500px]">
          {currentVideos.length > 0 ? (
            currentVideos.map((video, index) => (
              <VideoCard key={index} video={video} />
            ))
          ) : (
            <div className="col-span-4 text-white text-lg flex justify-center items-center h-full min-h-[300px]">
              No videos available.
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center space-x-2 mt-5">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === page ? "bg-blue-600 text-white" : "bg-gray-300"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
