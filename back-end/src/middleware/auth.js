import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const token = authHeader.replace("Bearer ", "").trim();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      `
      SELECT id, username, email, full_name, role, is_active
      FROM admin_users
      WHERE id = $1
      LIMIT 1
      `,
      [decoded.id]
    );

    if (result.rows.length === 0 || !result.rows[0].is_active) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    req.user = result.rows[0];
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
}