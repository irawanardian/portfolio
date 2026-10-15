import pool from "../src/config/db.js";

const apply = process.argv.includes("--apply");

const clean = (value) =>
  String(value || "").replace(/\s+/g, " ").trim();

function categoryFromTags(tags) {
  const normalized = tags.map((tag) => clean(tag).toLowerCase());

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
    ["cinematic", "Cinematic"],
  ];

  for (const [tag, label] of categories) {
    if (normalized.includes(tag)) return label;
  }

  return "Photography";
}

function generateMetadata(project) {
  const title = clean(project.title);
  const category = categoryFromTags(project.tags || []);
  const type = category.toLowerCase();

  const shortDescription =
    `A ${type} photography collection featuring ${title}.`;

  const description =
    `Explore the ${type} photography collection of ${title}. ` +
    `A curated selection of photographs and visual stories ` +
    `presented through the portfolio of Irawan Ardiantoro.`;

  const seoTitle =
    `${title} ${category} Photography | Irawan Ardiantoro`;

  const seoDescription =
    `Explore ${title}, a ${type} photography collection ` +
    `featuring selected photographs by Irawan Ardiantoro.`;

  return {
    short_description: shortDescription,
    description,
    seo_title: seoTitle.slice(0, 180),
    seo_description: seoDescription.slice(0, 160),
  };
}

async function main() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(`
      SELECT
        p.id,
        p.title,
        p.slug,
        p.short_description,
        p.description,
        p.seo_title,
        p.seo_description,
        COALESCE(
          ARRAY_AGG(pt.tag ORDER BY pt.sort_order, pt.id)
          FILTER (WHERE pt.tag IS NOT NULL),
          '{}'
        ) AS tags
      FROM projects p
      LEFT JOIN project_tags pt
        ON pt.project_id = p.id
      WHERE p.category = 'photo' AND p.slug <> 'tes'
      GROUP BY p.id
      ORDER BY p.id
    `);

    let updated = 0;
    let skipped = 0;

    console.log(`MODE: ${apply ? "APPLY" : "PREVIEW"}`);
    console.log(`PHOTO ALBUMS: ${result.rows.length}`);
    console.log();

    for (const project of result.rows) {
      const generated = generateMetadata(project);
      const changes = {};

      for (const [field, value] of Object.entries(generated)) {
        if (!clean(project[field])) {
          changes[field] = value;
        }
      }

      if (Object.keys(changes).length === 0) {
        skipped++;
        continue;
      }

      console.log(`ALBUM: ${project.title}`);
      console.log(`SLUG : ${project.slug}`);
      console.log(`TAGS : ${project.tags.join(", ") || "-"}`);

      for (const [field, value] of Object.entries(changes)) {
        console.log(`  ${field}: ${value}`);
      }

      console.log();

      if (apply) {
        const update = await client.query(
          `
          UPDATE projects
          SET
            short_description = CASE
              WHEN NULLIF(BTRIM(short_description), '') IS NULL
              THEN $2 ELSE short_description END,
            description = CASE
              WHEN NULLIF(BTRIM(description), '') IS NULL
              THEN $3 ELSE description END,
            seo_title = CASE
              WHEN NULLIF(BTRIM(seo_title), '') IS NULL
              THEN $4 ELSE seo_title END,
            seo_description = CASE
              WHEN NULLIF(BTRIM(seo_description), '') IS NULL
              THEN $5 ELSE seo_description END,
            updated_at = NOW()
          WHERE id = $1
          `,
          [
            project.id,
            generated.short_description,
            generated.description,
            generated.seo_title,
            generated.seo_description,
          ]
        );

        updated += update.rowCount;
      } else {
        updated++;
      }
    }

    if (apply) {
      await client.query("COMMIT");
    } else {
      await client.query("ROLLBACK");
    }

    console.log("===== SUMMARY =====");
    console.log("Mode:", apply ? "APPLIED" : "PREVIEW ONLY");
    console.log(
      apply ? "Updated albums:" : "Albums needing updates:",
      updated
    );
    console.log("Already complete:", skipped);

    if (!apply) {
      console.log("DATABASE NOT MODIFIED");
    }
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

try {
  await main();
} catch (error) {
  console.error("Metadata backfill failed:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
