const STORAGE_HOST = "portfolio-api.ambulancegema.com";

export function photoImageUrl(original, variant = "original") {
  if (!original || variant === "original") return original;

  try {
    const url = new URL(original, window.location.origin);

    if (
      url.hostname !== STORAGE_HOST ||
      !url.pathname.startsWith("/uploads/projects/")
    ) {
      return original;
    }

    if (/\.(thumb|preview)\.webp$/i.test(url.pathname)) {
      return original;
    }

    if (!/\.(jpg|jpeg|png|webp)$/i.test(url.pathname)) {
      return original;
    }

    url.pathname = url.pathname.replace(
      /\.(jpg|jpeg|png|webp)$/i,
      `.${variant === "preview" ? "preview" : "thumb"}.webp`
    );

    return url.toString();
  } catch {
    return original;
  }
}

export function fallbackPhotoImage(event, original) {
  const img = event.currentTarget;

  if (!original || img.src === original) return;

  img.onerror = null;
  img.removeAttribute("srcset");
  img.removeAttribute("sizes");
  img.src = original;
}


export function photoSrcSet(original) {
  if (!original) return undefined;

  const thumb = photoImageUrl(original, "thumbnail");
  const preview = photoImageUrl(original, "preview");

  if (
    thumb === original ||
    preview === original
  ) {
    return undefined;
  }

  return `${thumb} 480w, ${preview} 1200w`;
}
