const clean = (value) =>
  String(value ?? "").replace(/\\s+/g, " ").trim();

export function generatePhotoMetadata(title, tags = []) {
  const name = clean(title);

  const normalizedTags = Array.isArray(tags)
    ? tags.map((tag) => clean(tag).toLowerCase())
    : [];

  const categories = [
    ["prewedding", "Prewedding"],
    ["wedding", "Wedding"],
    ["engagement", "Engagement"],
    ["portrait", "Portrait"],
    ["corporate", "Corporate"],
    ["event", "Event"],
    ["product", "Product"],
    ["landscape", "Landscape"],
    ["street", "Street"],
  ];

  const category =
    categories.find(([key]) => normalizedTags.includes(key))?.[1]
    || "Photography";

  const type = category.toLowerCase();
  const photographyLabel =
    category === "Photography" ? "Photography" : `${category} Photography`;

  return {
    shortDescription:
      `A ${type} photography collection featuring ${name}.`,

    description:
      `Explore the ${type} photography collection of ${name}. ` +
      `A curated selection of photographs and visual stories ` +
      `presented through the portfolio of Irawan Ardiantoro.`,

    seoTitle:
      `${name} | ${photographyLabel} | Irawan Ardiantoro`
        .slice(0, 180),

    seoDescription:
      `Explore ${name}, a ${type} photography collection ` +
      `featuring selected photographs by Irawan Ardiantoro.`
        .slice(0, 160),
  };
}
