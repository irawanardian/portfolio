const STORAGE_HOST = "portfolio-api.ambulancegema.com";

function normalizePhotoUrl(original) {
  if (!original || typeof original !== "string") return original;

  try {
    const url = new URL(original, window.location.origin);

    // Only upgrade our own image storage host.
    if (url.hostname === STORAGE_HOST && url.protocol === "http:") {
      url.protocol = "https:";
      return url.toString();
    }

    return original;
  } catch {
    return original;
  }
}

export function photoImageUrl(original, variant = "original") {
  const safeOriginal = normalizePhotoUrl(original);

  if (!safeOriginal || variant === "original") {
    return safeOriginal;
  }

  try {
    const url = new URL(safeOriginal, window.location.origin);

    if (
      url.hostname !== STORAGE_HOST ||
      !url.pathname.startsWith("/uploads/projects/")
    ) {
      return safeOriginal;
    }

    if (/\.(thumb|preview)\.webp$/i.test(url.pathname)) {
      return safeOriginal;
    }

    if (!/\.(jpg|jpeg|png|webp)$/i.test(url.pathname)) {
      return safeOriginal;
    }

    url.pathname = url.pathname.replace(
      /\.(jpg|jpeg|png|webp)$/i,
      `.${variant === "preview" ? "preview" : "thumb"}.webp`
    );

    return url.toString();
  } catch {
    return safeOriginal;
  }
}

export function fallbackPhotoImage(event, original) {
  const img = event.currentTarget;
  const safeOriginal = normalizePhotoUrl(original);

  if (!safeOriginal || img.src === safeOriginal) return;

  img.onerror = null;
  img.removeAttribute("srcset");
  img.removeAttribute("sizes");
  img.src = safeOriginal;
}

export function photoSrcSet(original) {
  if (!original) return undefined;

  const safeOriginal = normalizePhotoUrl(original);
  const thumb = photoImageUrl(original, "thumbnail");
  const preview = photoImageUrl(original, "preview");

  if (
    thumb === safeOriginal ||
    preview === safeOriginal
  ) {
    return undefined;
  }

  return `${thumb} 480w, ${preview} 1200w`;
}
