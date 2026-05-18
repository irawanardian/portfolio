import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

function sanitizeUser(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    fullName: user.full_name,
    role: user.role,
    isActive: user.is_active
  };
}

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required"
      });
    }

    const result = await pool.query(
      `
      SELECT id, username, email, full_name, password_hash, role, is_active
      FROM admin_users
      WHERE username = $1 OR email = $1
      LIMIT 1
      `,
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password"
      });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password"
      });
    }

    await pool.query(
      "UPDATE admin_users SET last_login_at = NOW(), updated_at = NOW() WHERE id = $1",
      [user.id]
    );

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d"
      }
    );

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error("POST /api/auth/login error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
});

router.get("/me", requireAuth, (req, res) => {
  return res.json({
    success: true,
    user: sanitizeUser(req.user)
  });
});

export default router;