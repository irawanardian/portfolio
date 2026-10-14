import { useEffect, useRef, useState } from "react";
import { Images, Loader2, UploadCloud, X } from "lucide-react";
import { apiRequest, API_BASE_URL } from "../../lib/api";
import { getToken } from "../../lib/auth";

const MAX_FILES = 20;
const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

const PUBLIC_API_URL = (
  import.meta.env.VITE_PUBLIC_API_BASE_URL ||
  "https://portfolio-api.ambulancegema.com"
).replace(/\/+$/, "");

export default function BulkPhotoUpload({
  projectId,
  existingCount = 0,
  onImagesAdded,
}) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState([]);
  const inputRef = useRef(null);
  const filesRef = useRef([]);

  const updateFiles = (next) => {
    filesRef.current = next;
    setFiles(next);
  };

  const clearFiles = () => {
    filesRef.current.forEach((item) => {
      URL.revokeObjectURL(item.preview);
    });
    updateFiles([]);
    if (inputRef.current) inputRef.current.value = "";
  };

  useEffect(() => {
    return () => {
      filesRef.current.forEach((item) => {
        URL.revokeObjectURL(item.preview);
      });
    };
  }, []);

  const handleSelect = (event) => {
    const selected = Array.from(event.target.files || []);

    setMessage("");
    setErrors([]);

    if (selected.length > MAX_FILES) {
      setMessage(`Maximum ${MAX_FILES} images per batch.`);
      event.target.value = "";
      return;
    }

    const invalid = selected.find(
      (file) => !ALLOWED.includes(file.type) || file.size > MAX_SIZE
    );

    if (invalid) {
      setMessage(
        `Invalid image: ${invalid.name}. Use JPG, PNG, or WebP, maximum 5 MB.`
      );
      event.target.value = "";
      return;
    }

    clearFiles();

    updateFiles(
      selected.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }))
    );
  };

  const uploadAll = async () => {
    if (!files.length || uploading) return;

    const token = getToken();

    if (!token) {
      setMessage("Session expired. Please log in again.");
      return;
    }

    setUploading(true);
    setProgress(0);
    setErrors([]);
    setMessage("");

    const successful = [];
    const failed = [];

    for (let index = 0; index < files.length; index++) {
      const item = files[index];

      try {
        const formData = new FormData();
        formData.append("image", item.file);

        const response = await fetch(`${API_BASE_URL}/api/uploads/projects`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Upload failed");
        }

        const imagePath = result.data?.path;

        if (
          typeof imagePath !== "string" ||
          !imagePath.startsWith("/uploads/projects/")
        ) {
          throw new Error("Invalid image path returned by API");
        }

        const imageUrl = `${PUBLIC_API_URL}${imagePath}`;

        const saved = await apiRequest(
          `/api/projects/${projectId}/images`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              imageUrl,
              caption: "",
              sortOrder: existingCount + index + 1,
              imageType: "gallery",
            }),
          }
        );

        successful.push(saved.data);
        onImagesAdded?.([saved.data]);
      } catch (error) {
        failed.push(`${item.file.name}: ${error.message}`);
      }

      setProgress(index + 1);
    }

    setErrors(failed);
    setMessage(
      `${successful.length} of ${files.length} images added successfully.`
    );

    if (failed.length === 0) {
      clearFiles();
    } else {
      const unsuccessfulNames = new Set(
        failed.map((line) => line.split(": ")[0])
      );

      updateFiles((() => {
        const remaining = files.filter((item) =>
          unsuccessfulNames.has(item.file.name)
        );
        files.forEach((item) => {
          if (!remaining.includes(item)) {
            URL.revokeObjectURL(item.preview);
          }
        });
        return remaining;
      })());
    }

    setUploading(false);
  };

  return (
    <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5 md:p-7">
      <div className="mb-5 flex items-center gap-3">
        <Images className="h-7 w-7 text-white" />
        <div>
          <h3 className="text-xl font-bold text-white">
            Bulk Photo Upload
          </h3>
          <p className="text-sm text-gray-400">
            Upload up to 20 photos at once. Maximum 5 MB each.
          </p>
        </div>
      </div>

      <label className={`flex min-h-36 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/20 bg-black/20 p-6 text-center transition hover:border-white/50 ${uploading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>
        <UploadCloud className="h-9 w-9 text-gray-400" />
        <span className="font-semibold">
          Select Photos
        </span>
        <span className="text-xs text-gray-500">
          JPG, PNG, WebP — Max 20 files
        </span>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          disabled={uploading}
          onChange={handleSelect}
          className="hidden"
        />
      </label>

      {files.length > 0 && (
        <>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
            {files.map((item, index) => (
              <div
                key={`${item.file.name}-${index}`}
                className="relative overflow-hidden rounded-xl border border-white/10 bg-neutral-900"
              >
                <img
                  src={item.preview}
                  alt={item.file.name}
                  className="aspect-square w-full object-cover"
                />

                {!uploading && (
                  <button
                    type="button"
                    aria-label={`Remove ${item.file.name}`}
                    onClick={() => {
                      URL.revokeObjectURL(item.preview);
                      updateFiles(
                        files.filter((_, i) => i !== index)
                      );
                    }}
                    className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5"
                  >
                    <X size={15} />
                  </button>
                )}

                <p className="truncate px-2 py-2 text-xs text-gray-400">
                  {item.file.name}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={uploadAll}
              disabled={uploading}
              className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-200 disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <UploadCloud className="h-5 w-5" />
              )}

              {uploading ? "Uploading..." : `Upload ${files.length} Photos`}
            </button>
          </div>
        </>
      )}

      {uploading && (
        <div className="mt-5">
          <div className="mb-2 flex justify-between text-sm text-gray-400">
            <span>Uploading photos</span>
            <span>{progress} / {files.length}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-white transition-all"
              style={{
                width: `${(progress / files.length) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {message && (
        <p
          role="status"
          className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-gray-300"
        >
          {message}
        </p>
      )}

      {errors.length > 0 && (
        <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
          <p className="mb-2 text-sm font-semibold text-red-300">
            Failed uploads
          </p>
          {errors.map((error, index) => (
            <p key={index} className="text-xs text-red-200">
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
