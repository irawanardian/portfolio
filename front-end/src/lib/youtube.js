const VIDEO_ID = /^[a-zA-Z0-9_-]{11}$/;

export function getYouTubeId(input) {
  if (typeof input !== "string" || !input.trim()) return "";

  try {
    const url = new URL(input.trim());
    const host = url.hostname.toLowerCase();

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return "";
    }

    let id = "";

    if (host === "youtu.be" || host === "www.youtu.be") {
      id = url.pathname.split("/")[1] || "";
    } else if (
      host === "youtube.com" ||
      host === "www.youtube.com" ||
      host === "m.youtube.com"
    ) {
      const parts = url.pathname.split("/").filter(Boolean);

      if (parts[0] === "watch") {
        id = url.searchParams.get("v") || "";
      } else if (
        ["shorts", "embed", "live"].includes(parts[0])
      ) {
        id = parts[1] || "";
      }
    } else if (host === "www.youtube-nocookie.com" ||
               host === "youtube-nocookie.com") {
      const parts = url.pathname.split("/").filter(Boolean);
      if (parts[0] === "embed") id = parts[1] || "";
    }

    return VIDEO_ID.test(id) ? id : "";
  } catch {
    return "";
  }
}

export function getYouTubeEmbed(input) {
  const id = getYouTubeId(input);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : "";
}

export function getYouTubeThumbnail(input) {
  const id = getYouTubeId(input);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "";
}
