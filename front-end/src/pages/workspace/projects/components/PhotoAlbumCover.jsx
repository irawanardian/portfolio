import { Camera, Loader2, UploadCloud } from "lucide-react";

export default function PhotoAlbumCover({
  coverUrl,
  uploading,
  onSelect,
}) {
  return (
    <section className="mt-10 border-t border-white/10 pt-8">
      <div className="mb-5 flex items-center gap-3">
        <Camera className="h-6 w-6" />
        <h2 className="text-2xl font-bold text-white">
          Album Cover
        </h2>
      </div>

      <label
        className={`flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-white/20 p-6 transition hover:bg-white/5 ${
          uploading ? "pointer-events-none opacity-60" : ""
        }`}
      >
        {uploading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <UploadCloud className="h-5 w-5" />
        )}

        <span>
          {uploading ? "Uploading Cover..." : "Select Cover Photo"}
        </span>

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={uploading}
          onChange={onSelect}
          className="hidden"
        />
      </label>

      {coverUrl && (
        <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-neutral-900">
          <img
            src={coverUrl}
            alt="Album cover"
            className="max-h-96 w-full object-contain"
          />
        </div>
      )}
    </section>
  );
}
