import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiRequest } from "../../../lib/api";
import { getToken } from "../../../lib/auth";

import WebEdit from "./editors/WebEdit";
import PhotoEdit from "./editors/PhotoEdit";
import VideoEdit from "./editors/VideoEdit";

export default function EditProject() {
  const { id } = useParams();

  const [category, setCategory] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCategory() {
      try {
        const token = getToken();

        if (!token) {
          throw new Error("Please log in again.");
        }

        const result = await apiRequest(
          `/api/projects/workspace/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!cancelled) {
          setCategory(result.data?.category || "digital");
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    }

    loadCategory();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) {
    return <div className="p-10 text-red-300">{error}</div>;
  }

  if (!category) {
    return (
      <div className="p-10 text-gray-400">
        Loading project editor...
      </div>
    );
  }

  if (category === "photo") return <PhotoEdit />;
  if (category === "video") return <VideoEdit />;

  return <WebEdit />;
}
