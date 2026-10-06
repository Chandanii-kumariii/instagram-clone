import express from "express";
import { requestLanguageChange, verifyLanguageChangeOtp } from "../controllers/Settings.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/language/request", protectRoute, requestLanguageChange);
router.post("/language/verify", protectRoute, verifyLanguageChangeOtp);

export default router;
