import express from "express";
import { login, register, verifyLoginOtp, getLoginHistory } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-login-otp", verifyLoginOtp);
router.get("/login-history", protectRoute, getLoginHistory);

export default router;
