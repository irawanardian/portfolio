import express from "express";
import pool from "../config/db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

const slugify = (value) =>
  String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const clean = (value) =>
  typeof value === "string" ? value.trim() : "";

const mapCategory = (row) => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  sortOrder: row.sort_order,
  albumCount: Number(row.album_count ?? 0),
});

const handleError = (res, error) => {
  if (error.code === "23505") {
    return res.status(409).json({
      success: false,
      message: "Category already exists",
    });
  }

  console.error("Photo category error:", error);

  return res.status(500).json({
    success: false,
    message: "Failed to process photo category",
  });
};

// Public: read categories and album counts.
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT pc.*,
        (
          SELECT COUNT(DISTINCT p.id)
          FROM projects p
          JOIN project_tags pt ON pt.project_id = p.id
          WHERE p.category = 'photo'
            AND LOWER(pt.tag) = LOWER(pc.name)
            AND p.status = 'published'
        ) AS album_count
      FROM photo_categories pc
      ORDER BY pc.sort_order, pc.name
    `);

    return res.json({
      success: true,
      data: result.rows.map(mapCategory),
    });
  } catch (error) {
    return handleError(res, error);
  }
});

// Admin: create category.
router.post("/", requireAuth, async (req, res) => {
  const name = clean(req.body?.name);
  const slug = slugify(name);

  if (!name || name.length > 80 || !slug) {
    return res.status(400).json({
      success: false,
      message: "Invalid category name",
    });
  }

  try {
    const result = await pool.query(`
      INSERT INTO photo_categories (name, slug, sort_order)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [
      name,
      slug,
      Number.isSafeInteger(req.body?.sortOrder)
        ? req.body.sortOrder
        : 0,
    ]);

    return res.status(201).json({
      success: true,
      data: mapCategory(result.rows[0]),
    });
  } catch (error) {
    return handleError(res, error);
  }
});

// Admin: rename category and its photo-album tags.
router.put("/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const name = clean(req.body?.name);
  const slug = slugify(name);

  if (!Number.isSafeInteger(id) || id <= 0 ||
      !name || name.length > 80 || !slug) {
    return res.status(400).json({
      success: false,
      message: "Invalid category",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const existing = await client.query(`
      SELECT * FROM photo_categories
      WHERE id = $1 FOR UPDATE
    `, [id]);

    if (!existing.rowCount) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const previousName = existing.rows[0].name;

    const updated = await client.query(`
      UPDATE photo_categories
      SET name = $1, slug = $2, sort_order = $3,
          updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `, [
      name,
      slug,
      Number.isSafeInteger(req.body?.sortOrder)
        ? req.body.sortOrder
        : existing.rows[0].sort_order,
      id,
    ]);

    if (name !== previousName) {
      await client.query(`
        UPDATE project_tags pt
        SET tag = $1
        FROM projects p
        WHERE pt.project_id = p.id
          AND p.category = 'photo'
          AND LOWER(pt.tag) = LOWER($2)
      `, [name, previousName]);
    }

    await client.query("COMMIT");

    return res.json({
      success: true,
      data: mapCategory(updated.rows[0]),
    });
  } catch (error) {
    await client.query("ROLLBACK");
    return handleError(res, error);
  } finally {
    client.release();
  }
});

// Admin: delete unused categories only.
router.delete("/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid category ID",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const category = await client.query(`
      SELECT * FROM photo_categories
      WHERE id = $1 FOR UPDATE
    `, [id]);

    if (!category.rowCount) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const usage = await client.query(`
      SELECT COUNT(DISTINCT p.id)::int AS total
      FROM projects p
      JOIN project_tags pt ON pt.project_id = p.id
      WHERE p.category = 'photo'
        AND LOWER(pt.tag) = LOWER($1)
    `, [category.rows[0].name]);

    if (usage.rows[0].total > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        success: false,
        message: "Category is used by photo albums",
      });
    }

    await client.query(
      "DELETE FROM photo_categories WHERE id = $1",
      [id]
    );

    await client.query("COMMIT");

    return res.json({
      success: true,
      message: "Category deleted",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    return handleError(res, error);
  } finally {
    client.release();
  }
});

export default router;
