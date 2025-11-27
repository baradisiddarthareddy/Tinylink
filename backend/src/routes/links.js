import express from "express";
import {
  createLink,
  getAllLinks,
  getLinkStats,
  deleteLink,
} from "../controllers/linksController.js";

const router = express.Router();

router.post("/", createLink);
router.get("/", getAllLinks);
router.get("/:code", getLinkStats);
router.delete("/:code", deleteLink);

export default router;
