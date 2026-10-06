import express from "express";
import { purchaseSubscription } from "../controllers/Subscription.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/purchase", protectRoute, purchaseSubscription);

export default router;
