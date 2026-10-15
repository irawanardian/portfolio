import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2, Images, Loader2, RefreshCw,
  Trash2, UploadCloud,
} from "lucide-react";
import { apiRequest, API_BASE_URL } from "../../lib/api";
import { getToken } from "../../lib/auth";

const MAX_FILES = 100;
const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

const PUBLIC_API_URL = (
  import.meta.env.VITE_PUBLIC_API_BASE_URL ||
  "https://portfolio-api.ambulancegema.com"
).replace(/\/+$/, "");

export default function BulkPhotoUpload({
  projectId,
  ensureProjectId,
  existingCount = 0,
  onImagesAdded,
  onUploadingChange,
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState([]);

  const runningRef = useRef(false);
  const failedRef = useRef([]);
  const orderRef = useRef(existingCount);

  // Keep track of photos that already existed or were added.
  useEffect(() => {
    orderRef.current = Math.max(orderRef.current, existingCount);
  }, [existingCount]);

  const replaceFailed = (items) => {
    failedRef.current = items;
    setFailed(items);
  };

  useEffect(() => {
    return () => {
      failedRef.current.forEach((item) => {
        URL.revokeObjectURL(item.preview);
      });
    };
  }, []);

  const validate = (files) => {
    if (files.length > MAX_FILES) {
      throw new Error(`Maximum ${MAX_FILES} files per batch.`);
    }

    for (const file of files) {
      if (!ALLOWED.includes(file.type)) {
        throw new Error(`${file.name}: JPG, PNG, or WebP only.`);
      }

      if (file.size > MAX_SIZE) {
        throw new Error(`${file.name}: Maximum size is 5 MB.`);
      }
    }
  };

  const uploadFiles = async (items) => {
    if (runningRef.current || items.length === 0) return;

    runningRef.current = true;
    setUploading(true);
    onUploadingChange?.(true);
    setProgress(0);
    setTotal(items.length);
    setMessage("");

    const errors = [];
    let succeeded = 0;

    try {
      const token = getToken();

      if (!token) {
        throw new Error("Session expired. Please log in again.");
      }

      const targetId = projectId || await ensureProjectId?.();

      if (!targetId) {
        throw new Error("Album draft ID is not available.");
      }

      for (let index = 0; index < items.length; index++) {
        const item = items[index];

        try {
          // A successful file upload is reused during retry.
          if (!item.imageUrl) {
            const formData = new FormData();
            formData.append("image", item.file);

            const response = await fetch(
              `${API_BASE_URL}/api/uploads/projects`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                body: formData,
              }
            );

            const result = await response.json().catch(() => null);

            if (!response.ok || !result?.success) {
              throw new Error(result?.message || "File upload failed.");
            }

            const path = result.data?.path;

            if (
              typeof path !== "string" ||
              !/^\/uploads\/projects\/[^/]+$/.test(path)
            ) {
              throw new Error("Invalid uploaded image path.");
            }

            item.imageUrl = `${PUBLIC_API_URL}${path}`;
          }

          // Only the database association is retried here.
          const saved = await apiRequest(
            `/api/projects/${targetId}/images`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                imageUrl: item.imageUrl,
                caption: "",
                sortOrder: orderRef.current + 1,
                imageType: "gallery",
              }),
            }
          );

          if (!saved?.data?.id) {
            throw new Error("Image record was not confirmed.");
          }

          orderRef.current += 1;
          succeeded += 1;
          onImagesAdded?.([saved.data]);
          URL.revokeObjectURL(item.preview);
        } catch (error) {
          errors.push({
            ...item,
            error: error.message || "Failed to save photo.",
          });
        }

        setProgress(index + 1);
      }

      replaceFailed(errors);

      setMessage(
        errors.length
          ? `${succeeded} successful, ${errors.length} failed.`
          : `${succeeded} photos uploaded and saved successfully.`
      );
    } catch (error) {
      // Draft creation or authentication errors must not lock the UI.
      replaceFailed(items.map((item) => ({
        ...item,
        error: error.message || "Unable to prepare upload.",
      })));
      setMessage(error.message || "Unable to prepare upload.");
    } finally {
      runningRef.current = false;
      setUploading(false);
      onUploadingChange?.(false);
    }
  };

  const handleSelect = async (event) => {
    const selected = Array.from(event.target.files || []);
    event.target.value = "";

    if (
      selected.length === 0 ||
      runningRef.current ||
      failedRef.current.length > 0
    ) return;

    try {
      validate(selected);

      const items = selected.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        imageUrl: null,
      }));

      await uploadFiles(items);
    } catch (error) {
      setMessage(error.message || "Invalid files.");
    }
  };

  const retryFailed = async () => {
    if (runningRef.current || failedRef.current.length === 0) return;

    const retry = [...failedRef.current];
    replaceFailed([]);
    await uploadFiles(retry);
  };

  const discardFailed = () => {
    if (runningRef.current) return;

    failedRef.current.forEach((item) => {
      URL.revokeObjectURL(item.preview);
    });
    replaceFailed([]);
    setMessage("Failed items cleared from the queue.");
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <Images className="h-7 w-7 text-white" />
        <div>
          <h3 className="text-xl font-bold text-white">
            Gallery Photos
          </h3>
          <p className="text-sm text-gray-400">
            Auto-upload up to 100 photos per batch.
            Maximum 5 MB each.
          </p>
        </div>
      </div>

      <label
        className={`flex min-h-36 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/20 bg-black/20 p-6 text-center transition ${
          uploading || failed.length
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer hover:border-white/50"
        }`}
      >
        {uploading ? (
          <Loader2 className="h-9 w-9 animate-spin" />
        ) : (
          <UploadCloud className="h-9 w-9 text-gray-400" />
        )}

        <span className="font-semibold text-white">
          {uploading ? "Uploading Photos..." : "Select Photos"}
        </span>

        <span className="text-xs text-gray-500">
          JPG, PNG, WebP — Select 1 to 100 files
        </span>

        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          disabled={uploading || failed.length > 0}
          onChange={handleSelect}
          className="hidden"
        />
      </label>

      {uploading && (
        <div className="mt-6" role="status">
          <div className="mb-3 flex justify-between text-sm text-gray-300">
            <span>Uploading and saving photos...</span>
            <span>{progress} / {total}</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-white transition-all duration-300"
              style={{
                width: `${total ? (progress / total) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      )}

      {message && (
        <div role="status" className="mt-5 flex gap-2 text-sm text-gray-300">
          {!uploading && failed.length === 0 && (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-green-400" />
          )}
          <span>{message}</span>
        </div>
      )}

      {failed.length > 0 && !uploading && (
        <div className="mt-5 rounded-xl border border-red-500/20 p-4">
          <p className="mb-3 text-sm font-semibold text-red-300">
            {failed.length} photos need attention
          </p>

          <div className="max-h-40 space-y-2 overflow-y-auto">
            {failed.map((item, index) => (
              <p key={index} className="text-xs text-red-200">
                {item.file.name}: {item.error}
              </p>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={retryFailed}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2 text-sm text-white hover:bg-white/10"
            >
              <RefreshCw className="h-4 w-4" />
              Retry Failed
            </button>

            <button
              type="button"
              onClick={discardFailed}
              className="inline-flex items-center gap-2 rounded-full border border-red-500/30 px-5 py-2 text-sm text-red-300 hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4" />
              Clear Queue
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
