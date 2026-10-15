import { useEffect, useState } from "react";
import { apiRequest } from "./api";

const DEFAULT_CATEGORIES = [
  "Wedding", "Prewedding", "Engagement", "Portrait",
  "Event", "Product", "Landscape", "Street", "Corporate",
];

export function usePhotoCategories() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const result = await apiRequest("/api/photo-categories");
        if (!Array.isArray(result.data)) return;

        const names = result.data
          .map((item) => item.name)
          .filter((name) => typeof name === "string" && name.trim());

        if (!cancelled) setCategories(names);
      } catch (error) {
        console.error("Unable to load photo categories:", error);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return categories;
}
