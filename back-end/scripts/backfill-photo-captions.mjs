import pool from "../src/config/db.js";

const apply = process.argv.includes("--apply");

async function main() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(`
      WITH numbered AS (
        SELECT
          pi.id,
          p.title,
          pi.caption,
          ROW_NUMBER() OVER (
            PARTITION BY pi.project_id
            ORDER BY pi.sort_order, pi.id
          ) AS sequence
        FROM project_images pi
        JOIN projects p ON p.id = pi.project_id
        WHERE p.category = 'photo' AND p.slug <> 'tes'
          AND pi.image_type = 'gallery'
      )
      SELECT
        id,
        title,
        caption,
        title || ' — Photo ' ||
        LPAD(sequence::text, 2, '0') AS new_caption
      FROM numbered
      WHERE caption IS NULL OR BTRIM(caption) = ''
      ORDER BY title, sequence
    `);

    console.log(
      `MODE: ${apply ? "APPLY" : "PREVIEW"}`
    );

    console.log(
      `Empty captions found: ${result.rows.length}`
    );

    for (const row of result.rows.slice(0, 30)) {
      console.log(
        `${row.id} | ${row.title} | ${row.new_caption}`
      );
    }

    if (result.rows.length > 30) {
      console.log(
        `... ${result.rows.length - 30} additional rows`
      );
    }

    if (apply) {
      let updated = 0;

      for (const row of result.rows) {
        const change = await client.query(
          `UPDATE project_images
           SET caption = $1
           WHERE id = $2
             AND (caption IS NULL OR BTRIM(caption) = '')`,
          [row.new_caption, row.id]
        );

        updated += change.rowCount;
      }

      await client.query("COMMIT");

      console.log(`UPDATED: ${updated} captions`);
    } else {
      await client.query("ROLLBACK");

      console.log("PREVIEW ONLY: No database changes");
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
  console.error("Backfill failed:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
