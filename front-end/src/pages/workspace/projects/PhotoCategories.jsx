import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Save,
  X,
  Tags,
} from "lucide-react";
import { apiRequest } from "../../../lib/api";
import { getToken } from "../../../lib/auth";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-white outline-none focus:border-white/40";

export default function PhotoCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadCategories = useCallback(async () => {
    try {
      setError("");
      const result = await apiRequest("/api/photo-categories");
      setCategories(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setError(err.message || "Unable to load photo categories.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const resetForm = () => {
    setEditing(null);
    setName("");
    setSortOrder("0");
  };

  const startEdit = (category) => {
    setEditing(category.id);
    setName(category.name);
    setSortOrder(String(category.sortOrder ?? 0));
    setError("");
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const cleanName = name.trim();
    if (!cleanName || saving) return;

    const token = getToken();
    if (!token) {
      setError("Please log in again.");
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const payload = {
        name: cleanName,
        sortOrder: Number(sortOrder) || 0,
      };

      await apiRequest(
        editing
          ? `/api/photo-categories/${editing}`
          : "/api/photo-categories",
        {
          method: editing ? "PUT" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      setNotice(
        editing
          ? "Category updated successfully."
          : "Category created successfully."
      );

      resetForm();
      await loadCategories();
    } catch (err) {
      setError(err.message || "Failed to save category.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category) => {
    if (
      !window.confirm(
        `Delete category "${category.name}"? Categories used by albums cannot be deleted.`
      )
    ) {
      return;
    }

    const token = getToken();
    if (!token) {
      setError("Please log in again.");
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");

    try {
      await apiRequest(`/api/photo-categories/${category.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotice("Category deleted successfully.");
      if (editing === category.id) resetForm();
      await loadCategories();
    } catch (err) {
      setError(err.message || "Failed to delete category.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="min-h-screen px-6 py-10 text-white lg:px-10">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/projects/foto"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Photo Projects
        </Link>

        <div className="mb-10">
          <div className="mb-4 flex items-center gap-3 text-gray-400">
            <Tags size={20} />
            <span className="text-xs uppercase tracking-[0.25em]">
              Workspace / Photo Categories
            </span>
          </div>
          <h1 className="text-3xl font-bold md:text-5xl">
            Manage Photo Categories.
          </h1>
          <p className="mt-4 text-gray-400">
            Add and organize the categories used by your photo albums.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {notice && (
          <div className="mb-5 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-green-300">
            {notice}
          </div>
        )}

        <form
          onSubmit={handleSave}
          className="mb-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6"
        >
          <h2 className="mb-5 text-xl font-semibold">
            {editing ? "Edit Category" : "Add New Category"}
          </h2>

          <div className="grid gap-4 md:grid-cols-[1fr_130px_auto] md:items-end">
            <label className="block">
              <span className="mb-2 block text-sm text-gray-400">
                Category Name
              </span>
              <input
                required
                maxLength={80}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Example: Graduation"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-gray-400">
                Sort Order
              </span>
              <input
                type="number"
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                className={inputClass}
              />
            </label>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-black disabled:opacity-50"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> :
                editing ? <Save size={18} /> : <Plus size={18} />}
              {editing ? "Save" : "Add"}
            </button>
          </div>

          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className="mt-4 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
            >
              <X size={16} />
              Cancel editing
            </button>
          )}
        </form>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="text-lg font-semibold">
              Categories ({categories.length})
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="animate-spin text-gray-400" />
            </div>
          ) : categories.length === 0 ? (
            <p className="p-8 text-gray-400">
              No categories available.
            </p>
          ) : (
            <div className="divide-y divide-white/10">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex flex-wrap items-center justify-between gap-4 px-6 py-5"
                >
                  <div>
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="mt-1 text-xs text-gray-500">
                      /{category.slug} · Order {category.sortOrder}
                      {" · "}{category.albumCount} published albums
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(category)}
                      disabled={saving}
                      className="rounded-xl border border-white/10 p-3 text-gray-300 hover:bg-white/10 disabled:opacity-50"
                      aria-label={`Edit ${category.name}`}
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(category)}
                      disabled={saving}
                      className="rounded-xl border border-red-500/20 p-3 text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                      aria-label={`Delete ${category.name}`}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="mt-5 text-sm text-gray-500">
          Categories currently used by photo albums are protected from deletion.
        </p>
      </div>
    </section>
  );
}
