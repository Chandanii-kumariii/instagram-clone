import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import storyRoutes from "./routes/story.route.js";
import authRoutes from "./routes/auth.route.js";
import settingsRoutes from "./routes/settings.route.js";
import subscriptionRoutes from "./routes/subscription.route.js";
import postRoutes from "./routes/post.route.js";
import adminRoutes from "./routes/admin.route.js";

dotenv.config()
const app = express()

app.use(cors({ origin: "http://localhost:3000", credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/auth", authRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Instagram api is running"
    })
})
export default app;