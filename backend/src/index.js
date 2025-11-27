import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import linkRoutes from "./routes/links.js";
import { redirectHandler } from "./controllers/linksController.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/healthz", (req, res) => {
  res.json({ ok: true, version: "1.0" });
});

// API Routes
app.use("/api/links", linkRoutes);

// Redirect route (must be last)
app.get("/:code", redirectHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
