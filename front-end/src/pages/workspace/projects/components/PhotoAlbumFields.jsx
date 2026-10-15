const CATEGORIES = [
  "Wedding", "Prewedding", "Engagement", "Portrait",
  "Event", "Product", "Landscape", "Street", "Corporate"
];

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-white/40";

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm text-gray-400">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function PhotoAlbumFields({
  form,
  photoCategory,
  onChange,
  onCategoryChange,
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Field label="Album Title">
        <input
          required
          name="title"
          value={form.title}
          onChange={onChange}
          placeholder="Wedding Photography"
          className={inputClass}
        />
      </Field>

      <Field label="Slug">
        <input
          name="slug"
          value={form.slug}
          onChange={onChange}
          placeholder="Auto-generated if empty"
          className={inputClass}
        />
      </Field>

      <Field label="Photo Category">
        <select
          value={photoCategory}
          onChange={(event) => onCategoryChange(event.target.value)}
          className={inputClass}
        >
          <option value="">Select category</option>
          {CATEGORIES.map((category) => (
            <option
              key={category}
              value={category}
              className="bg-neutral-900"
            >
              {category}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Year">
        <input
          name="year"
          value={form.year}
          onChange={onChange}
          className={inputClass}
        />
      </Field>

      <Field label="Status">
        <select
          name="status"
          value={form.status}
          onChange={onChange}
          className={inputClass}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </Field>

      <Field label="Sort Order">
        <input
          name="sortOrder"
          type="number"
          value={form.sortOrder}
          onChange={onChange}
          className={inputClass}
        />
      </Field>

      <div className="md:col-span-2">
        <Field label="Tags">
          <input
            name="tags"
            value={form.tags}
            onChange={onChange}
            placeholder="Photography, Cinematic"
            className={inputClass}
          />
        </Field>
      </div>

      <div className="md:col-span-2">
        <Field label="Short Description">
          <textarea
            name="shortDescription"
            rows={3}
            value={form.shortDescription}
            onChange={onChange}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="md:col-span-2">
        <Field label="Description">
          <textarea
            name="description"
            rows={5}
            value={form.description}
            onChange={onChange}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="md:col-span-2">
        <Field label="SEO Title">
          <input
            name="seoTitle"
            value={form.seoTitle || ""}
            onChange={onChange}
            placeholder="SEO title, optional"
            className={inputClass}
          />
        </Field>
      </div>

      <div className="md:col-span-2">
        <Field label="SEO Description">
          <textarea
            name="seoDescription"
            rows={3}
            value={form.seoDescription || ""}
            onChange={onChange}
            placeholder="SEO description, optional"
            className={inputClass}
          />
        </Field>
      </div>
    </div>
  );
}
