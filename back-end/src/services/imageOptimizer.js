import sharp from "sharp";
import path from "node:path";

export function getVariantPaths(originalPath) {
  const parsed = path.parse(originalPath);

  return {
    thumbnail: path.join(
      parsed.dir,
      `${parsed.name}.thumb.webp`
    ),
    preview: path.join(
      parsed.dir,
      `${parsed.name}.preview.webp`
    ),
  };
}

export function isOriginalImage(filename) {
  return (
    /\.(jpg|jpeg|png|webp)$/i.test(filename) &&
    !/\.(thumb|preview)\.webp$/i.test(filename)
  );
}

export async function optimizeImage(originalPath) {
  const paths = getVariantPaths(originalPath);

  const metadata = await sharp(originalPath).metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error("Invalid image dimensions");
  }

  await Promise.all([
    sharp(originalPath)
      .rotate()
      .resize({
        width: 480,
        height: 480,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({
        quality: 80,
        effort: 4,
      })
      .toFile(paths.thumbnail),

    sharp(originalPath)
      .rotate()
      .resize({
        width: 1200,
        height: 1200,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({
        quality: 85,
        effort: 4,
      })
      .toFile(paths.preview),
  ]);

  return {
    original: originalPath,
    thumbnail: paths.thumbnail,
    preview: paths.preview,
    width: metadata.width,
    height: metadata.height,
  };
}
