import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createStory,
  getFeedStories,
  viewStory,
  deleteStory,
  getStoryAnalytics
} from "../controllers/Story.controller.js";

const router = express.Router();

router.post("/", protectRoute, createStory);
router.get("/feed", protectRoute, getFeedStories);
router.post("/:storyId/view", protectRoute, viewStory);
router.delete("/:storyId", protectRoute, deleteStory);
router.get("/:storyId/analytics", protectRoute, getStoryAnalytics);

export default router;
