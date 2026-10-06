import express from "express";
import { getDashboardStats, getUsers, deleteUser, getAuditLogs } from "../controllers/Admin.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { protectAdminRoute } from "../middleware/admin.middleware.js";

const router = express.Router();

// Apply auth and admin middleware to all routes in this file
router.use(protectRoute, protectAdminRoute);

router.get("/stats", getDashboardStats);
router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);
router.get("/audit-logs", getAuditLogs);

export default router;
