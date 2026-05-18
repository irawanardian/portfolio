import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import projectRoutes from "./src/routes/projects.js";
import authRoutes from "./src/routes/auth.js";
import uploadRoutes from "./src/routes/uploads.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true
  })
);

app.use(express.json());
app.use("/uploads", express.static("public/uploads"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Irawan Portfolio API",
    version: "1.0.0"
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "ok",
    service: "portfolio-irawan-backend"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/uploads", uploadRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Portfolio API running on http://127.0.0.1:${PORT}`);
});
