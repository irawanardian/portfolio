import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

const uploadDir = path.join(process.cwd(), "public", "uploads", "projects");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const safeExt = ext || ".jpg";
    const filename = `project-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${safeExt}`;

    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPG, PNG, and WEBP images are allowed."));
    }

    cb(null, true);
  },
});

router.post("/projects", requireAuth, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Image file is required",
    });
  }

  const baseUrl = `${req.protocol}://${req.get("host")}`;

  return res.status(201).json({
    success: true,
    message: "Image uploaded successfully",
    data: {
      filename: req.file.filename,
      url: `${baseUrl}/uploads/projects/${req.file.filename}`,
      path: `/uploads/projects/${req.file.filename}`,
      size: req.file.size,
      mimeType: req.file.mimetype,
    },
  });
});

export default router;