export default function Home() {
  return (
    <div>
      {/* Video Banner */}
      <div>
        <video
          className="w-full h-[593px] object-cover mb-4"
          autoPlay
          loop
          muted
          playsInline
        >
          <source
            src="https://videos.pexels.com/video-files/2675515/2675515-hd_1920_1080_30fps.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}
