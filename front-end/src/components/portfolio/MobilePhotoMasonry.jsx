import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  photoImageUrl,
  photoSrcSet,
  fallbackPhotoImage,
} from "../../lib/photoImages";

export default function MobilePhotoMasonry({
  images,
  albumTitle,
  onOpen,
}) {
  const [ratios, setRatios] = useState({});

  useEffect(() => {
    let cancelled = false;

    Promise.all(
      images.map(
        (image) =>
          new Promise((resolve) => {
            const probe = new Image();

            probe.onload = () =>
              resolve([
                image.id,
                probe.naturalWidth / probe.naturalHeight,
              ]);

            probe.onerror = () => resolve([image.id, 1]);

            probe.src = photoImageUrl(
              image.imageUrl,
              "thumbnail"
            );
          })
      )
    ).then((results) => {
      if (!cancelled) {
        setRatios((previous) => ({
          ...previous,
          ...Object.fromEntries(results),
        }));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [images]);

  const columns = useMemo(() => {
    const result = [[], [], []];
    const heights = [0, 0, 0];

    images.forEach((image, index) => {
      const ratio = ratios[image.id] || 1;

      const shortest = heights.indexOf(
        Math.min(...heights)
      );

      result[shortest].push({ image, index });

      heights[shortest] += 1 / ratio + 0.06;
    });

    return result;
  }, [images, ratios]);

  return (
    <div className="grid grid-cols-3 items-start gap-1.5 sm:hidden">
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="flex flex-col gap-1.5">
          {column.map(({ image, index }) => (
            <motion.button
              key={image.id || index}
              type="button"
              onClick={() => onOpen(index)}
              className="group relative block w-full overflow-hidden rounded-xl bg-neutral-900"
              aria-label={`View photograph ${index + 1}`}
            >
              <img
                src={photoImageUrl(image.imageUrl, "thumbnail")}
                srcSet={photoSrcSet(image.imageUrl)}
                sizes="33vw"
                onError={(event) =>
                  fallbackPhotoImage(event, image.imageUrl)
                }
                alt={image.caption || `${albumTitle} ${index + 1}`}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full"
              />
            </motion.button>
          ))}
        </div>
      ))}
    </div>
  );
}
