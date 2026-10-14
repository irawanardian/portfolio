import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { apiRequest } from "../../lib/api";
import { getToken } from "../../lib/auth";

export default function PhotoCaptionEditor({
  projectId,
  image,
  onSaved,
}) {
  const [caption, setCaption] = useState(image.caption || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setCaption(image.caption || "");
    setSuccess(false);
    setError("");
  }, [image.id, image.caption]);

  const dirty = caption !== (image.caption || "");

  const handleSave = async () => {
    if (!dirty || saving) return;

    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const token = getToken();

      if (!token) {
        throw new Error("Session expired. Please log in again.");
      }

      const result = await apiRequest(
        `/api/projects/${projectId}/images/${image.id}/caption`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ caption }),
        }
      );

      onSaved(image.id, result.data.caption);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Unable to save caption.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mb-4 border-b border-white/10 pb-4">
      <label
        htmlFor={`caption-${image.id}`}
        className="mb-2 block text-xs text-gray-400"
      >
        Photo Caption
      </label>

      <textarea
        id={`caption-${image.id}`}
        value={caption}
        maxLength={500}
        rows={2}
        onChange={(event) => {
          setCaption(event.target.value);
          setSuccess(false);
        }}
        placeholder="Write a caption for this photo..."
        className="w-full resize-y rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-white outline-none focus:border-white/40"
      />

      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="text-xs text-gray-500">
          {caption.length}/500
        </span>

        <button
          type="button"
          onClick={handleSave}
          disabled={!dirty || saving}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black disabled:opacity-40"
        >
          {saving ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Save size={14} />
          )}
          {saving ? "Saving..." : "Save Caption"}
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-2 text-xs text-red-300">
          {error}
        </p>
      )}

      {success && !dirty && (
        <p role="status" className="mt-2 text-xs text-green-300">
          Caption saved successfully.
        </p>
      )}
    </div>
  );
}
