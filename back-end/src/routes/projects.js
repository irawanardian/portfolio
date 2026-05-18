import express from "express";
import pool from "../config/db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

function createSlug(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapProject(row) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    year: row.year,
    status: row.status,
    shortDescription: row.short_description,
    description: row.description,
    coverImage: row.cover_image,
    externalUrl: row.external_url,
    videoEmbed: row.video_embed,
    seo: {
      title: row.seo_title,
      description: row.seo_description
    },
    viewCount: row.view_count,
    tags: row.tags || [],
    images: row.images || [],
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    const params = [];
    let whereClause = "WHERE p.status = 'published'";

    if (category) {
      params.push(category);
      whereClause += ` AND p.category = $${params.length}`;
    }

    const result = await pool.query(
      `
      SELECT
        p.*,
        COALESCE(
          ARRAY_AGG(DISTINCT pt.tag) FILTER (WHERE pt.tag IS NOT NULL),
          '{}'
        ) AS tags,
        COALESCE(
          JSON_AGG(
            DISTINCT JSONB_BUILD_OBJECT(
  'id', pi.id,
  'imageUrl', pi.image_url,
  'caption', pi.caption,
  'sortOrder', pi.sort_order,
  'imageType', pi.image_type
)
          ) FILTER (WHERE pi.id IS NOT NULL),
          '[]'
        ) AS images
      FROM projects p
      LEFT JOIN project_tags pt ON pt.project_id = p.id
      LEFT JOIN project_images pi ON pi.project_id = p.id
      ${whereClause}
      GROUP BY p.id
      ORDER BY p.sort_order ASC, p.created_at DESC
      `,
      params
    );

    return res.json({
      success: true,
      total: result.rows.length,
      data: result.rows.map(mapProject)
    });
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load projects"
    });
  }
});

router.post("/", requireAuth, async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      title,
      slug,
      category,
      year,
      status = "draft",
      shortDescription,
      description,
      coverImage,
      externalUrl,
      videoEmbed,
      seoTitle,
      seoDescription,
      sortOrder = 0,
      tags = [],
    } = req.body || {};

    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: "Title and category are required",
      });
    }

    const finalSlug = createSlug(slug || title);

    if (!finalSlug) {
      return res.status(400).json({
        success: false,
        message: "Valid slug is required",
      });
    }

    await client.query("BEGIN");

    const publishedAt = status === "published" ? new Date() : null;

    const projectResult = await client.query(
      `
      INSERT INTO projects (
        title,
        slug,
        category,
        year,
        status,
        short_description,
        description,
        cover_image,
        external_url,
        video_embed,
        seo_title,
        seo_description,
        sort_order,
        published_at
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10,
        $11, $12, $13, $14
      )
      RETURNING *
      `,
      [
        title,
        finalSlug,
        category,
        year || null,
        status,
        shortDescription || null,
        description || null,
        coverImage || null,
        externalUrl || null,
        videoEmbed || null,
        seoTitle || title,
        seoDescription || shortDescription || description || null,
        Number(sortOrder) || 0,
        publishedAt,
      ]
    );

    const project = projectResult.rows[0];

    if (Array.isArray(tags) && tags.length > 0) {
      const cleanTags = tags
        .map((tag) => String(tag || "").trim())
        .filter(Boolean);

      for (const [index, tag] of cleanTags.entries()) {
        await client.query(
          `
          INSERT INTO project_tags (project_id, tag, sort_order)
          VALUES ($1, $2, $3)
          `,
          [project.id, tag, index + 1]
        );
      }
    }

    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: mapProject({
        ...project,
        tags,
        images: [],
      }),
    });
  } catch (error) {
    await client.query("ROLLBACK");

    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Project slug already exists",
      });
    }

    console.error("POST /api/projects error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create project",
    });
  } finally {
    client.release();
  }
});

router.get("/workspace/all", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        p.*,
        COALESCE(
          ARRAY_AGG(DISTINCT pt.tag) FILTER (WHERE pt.tag IS NOT NULL),
          '{}'
        ) AS tags,
        COALESCE(
          JSON_AGG(
            DISTINCT JSONB_BUILD_OBJECT(
  'id', pi.id,
  'imageUrl', pi.image_url,
  'caption', pi.caption,
  'sortOrder', pi.sort_order,
  'imageType', pi.image_type
)
          ) FILTER (WHERE pi.id IS NOT NULL),
          '[]'
        ) AS images
      FROM projects p
      LEFT JOIN project_tags pt ON pt.project_id = p.id
      LEFT JOIN project_images pi ON pi.project_id = p.id
      GROUP BY p.id
      ORDER BY p.sort_order ASC, p.created_at DESC
      `
    );

    return res.json({
      success: true,
      total: result.rows.length,
      data: result.rows.map(mapProject),
    });
  } catch (error) {
    console.error("GET /api/projects/workspace/all error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load workspace projects",
    });
  }
});

router.get("/workspace/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        p.*,
        COALESCE(
          ARRAY_AGG(DISTINCT pt.tag) FILTER (WHERE pt.tag IS NOT NULL),
          '{}'
        ) AS tags,
        COALESCE(
          JSON_AGG(
            DISTINCT JSONB_BUILD_OBJECT(
  'id', pi.id,
  'imageUrl', pi.image_url,
  'caption', pi.caption,
  'sortOrder', pi.sort_order,
  'imageType', pi.image_type
)
          ) FILTER (WHERE pi.id IS NOT NULL),
          '[]'
        ) AS images
      FROM projects p
      LEFT JOIN project_tags pt ON pt.project_id = p.id
      LEFT JOIN project_images pi ON pi.project_id = p.id
      WHERE p.id = $1
      GROUP BY p.id
      LIMIT 1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.json({
      success: true,
      data: mapProject(result.rows[0]),
    });
  } catch (error) {
    console.error("GET /api/projects/workspace/:id error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load project",
    });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    const {
      title,
      slug,
      category,
      year,
      status = "draft",
      shortDescription,
      description,
      coverImage,
      externalUrl,
      videoEmbed,
      seoTitle,
      seoDescription,
      sortOrder = 0,
      tags = [],
    } = req.body || {};

    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: "Title and category are required",
      });
    }

    const finalSlug = createSlug(slug || title);

    if (!finalSlug) {
      return res.status(400).json({
        success: false,
        message: "Valid slug is required",
      });
    }

    const publishedAt = status === "published" ? new Date() : null;

    await client.query("BEGIN");

    const projectResult = await client.query(
      `
      UPDATE projects
      SET
        title = $1,
        slug = $2,
        category = $3,
        year = $4,
        status = $5,
        short_description = $6,
        description = $7,
        cover_image = $8,
        external_url = $9,
        video_embed = $10,
        seo_title = $11,
        seo_description = $12,
        sort_order = $13,
        published_at = $14,
        updated_at = NOW()
      WHERE id = $15
      RETURNING *
      `,
      [
        title,
        finalSlug,
        category,
        year || null,
        status,
        shortDescription || null,
        description || null,
        coverImage || null,
        externalUrl || null,
        videoEmbed || null,
        seoTitle || title,
        seoDescription || shortDescription || description || null,
        Number(sortOrder) || 0,
        publishedAt,
        id,
      ]
    );

    if (projectResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const project = projectResult.rows[0];

    await client.query("DELETE FROM project_tags WHERE project_id = $1", [
      project.id,
    ]);

    if (Array.isArray(tags) && tags.length > 0) {
      const cleanTags = tags
        .map((tag) => String(tag || "").trim())
        .filter(Boolean);

      for (const [index, tag] of cleanTags.entries()) {
        await client.query(
          `
          INSERT INTO project_tags (project_id, tag, sort_order)
          VALUES ($1, $2, $3)
          `,
          [project.id, tag, index + 1]
        );
      }
    }

    await client.query("COMMIT");

    return res.json({
      success: true,
      message: "Project updated successfully",
      data: mapProject({
        ...project,
        tags,
        images: [],
      }),
    });
  } catch (error) {
    await client.query("ROLLBACK");

    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Project slug already exists",
      });
    }

    console.error("PUT /api/projects/:id error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update project",
    });
  } finally {
    client.release();
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    await client.query("BEGIN");

    const result = await client.query(
      `
      DELETE FROM projects
      WHERE id = $1
      RETURNING id, title, slug
      `,
      [id]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await client.query("COMMIT");

    return res.json({
      success: true,
      message: "Project deleted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("DELETE /api/projects/:id error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete project",
    });
  } finally {
    client.release();
  }
});

router.post("/:id/images", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const {
  imageUrl,
  caption,
  sortOrder = 0,
  imageType = "gallery",
} = req.body || {};

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Image URL is required",
      });
    }

    if (!["gallery", "cover_slider"].includes(imageType)) {
  return res.status(400).json({
    success: false,
    message: "Invalid image type",
  });
}

    const projectCheck = await pool.query(
      "SELECT id FROM projects WHERE id = $1 LIMIT 1",
      [id]
    );

    if (projectCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO project_images (
  project_id,
  image_url,
  caption,
  sort_order,
  image_type
) VALUES ($1, $2, $3, $4, $5)
RETURNING id, project_id, image_url, caption, sort_order, image_type, created_at
      `,
      [id, imageUrl, caption || null, Number(sortOrder) || 0, imageType]
    );

    return res.status(201).json({
      success: true,
      message: "Project image added successfully",
      data: {
        id: result.rows[0].id,
        projectId: result.rows[0].project_id,
        imageUrl: result.rows[0].image_url,
        caption: result.rows[0].caption,
        sortOrder: result.rows[0].sort_order,
        createdAt: result.rows[0].created_at,
        imageType: result.rows[0].image_type,
      },
    });
  } catch (error) {
    console.error("POST /api/projects/:id/images error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add project image",
    });
  }
});

router.delete("/:id/images/:imageId", requireAuth, async (req, res) => {
  try {
    const { id, imageId } = req.params;

    const result = await pool.query(
      `
      DELETE FROM project_images
      WHERE id = $1
        AND project_id = $2
      RETURNING id, image_url
      `,
      [imageId, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project image not found",
      });
    }

    return res.json({
      success: true,
      message: "Project image deleted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("DELETE /api/projects/:id/images/:imageId error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete project image",
    });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await pool.query(
      `
      SELECT
        p.*,
        COALESCE(
          ARRAY_AGG(DISTINCT pt.tag) FILTER (WHERE pt.tag IS NOT NULL),
          '{}'
        ) AS tags,
        COALESCE(
          JSON_AGG(
            DISTINCT JSONB_BUILD_OBJECT(
  'id', pi.id,
  'imageUrl', pi.image_url,
  'caption', pi.caption,
  'sortOrder', pi.sort_order,
  'imageType', pi.image_type
)
          ) FILTER (WHERE pi.id IS NOT NULL),
          '[]'
        ) AS images
      FROM projects p
      LEFT JOIN project_tags pt ON pt.project_id = p.id
      LEFT JOIN project_images pi ON pi.project_id = p.id
      WHERE p.slug = $1
        AND p.status = 'published'
      GROUP BY p.id
      LIMIT 1
      `,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    await pool.query(
      "UPDATE projects SET view_count = view_count + 1, updated_at = NOW() WHERE slug = $1",
      [slug]
    );

    return res.json({
      success: true,
      data: mapProject(result.rows[0])
    });
  } catch (error) {
    console.error("GET /api/projects/:slug error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load project"
    });
  }
});

export default router;
