import { useState } from "react";

export default function VideoCard({ video }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Thumbnail */}
      <div
        className="p-1 shadow-lg cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-[200px] object-cover"
        />
        <h2 className="font-roboto text-white text-sm mt-2 text-start">
          {video.title}
        </h2>
      </div>

      {/* Modal Popup */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="relative bg-black p-4 rounded-lg max-w-3xl w-full">
            {/* Tombol Close */}
            <button
              className="absolute top-2 right-2 text-white text-2xl"
              onClick={() => setIsOpen(false)}
            >
              &times;
            </button>

            {/* Video YouTube */}
            <iframe
              width="100%"
              height="400"
              src={`${video.videoUrl}?autoplay=1`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full rounded-lg"
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
}
