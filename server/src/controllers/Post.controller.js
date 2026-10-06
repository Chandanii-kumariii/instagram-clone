import Post from "../models/Post.model.js";
import User from "../models/User.model.js";

export const createPost = async (req, res) => {
  try {
    const userId = req.user._id;
    // Assuming frontend might send `image` or `media`
    const { media, image, caption, location, scheduledAt } = req.body;
    const postImage = image || media;

    if (!postImage) return res.status(400).json({ error: "Image is required." });

    const user = await User.findById(userId);
    
    // Check if subscription is expired, revert to Free
    if (user.subscriptionExpiry && user.subscriptionExpiry < new Date()) {
       user.subscriptionPlan = "Free";
       await user.save();
    }

    // Determine Posting Limit based on Plan (Only for Published posts)
    let limit = 1; // Free
    if (user.subscriptionPlan === "Bronze") limit = 3;
    else if (user.subscriptionPlan === "Silver") limit = 5;
    else if (user.subscriptionPlan === "Gold") limit = Infinity;

    // Count existing published posts
    const postCount = await Post.countDocuments({ user: userId, status: "Published" });

    // Validate Scheduling
    let status = "Published";
    if (scheduledAt) {
      const scheduleDate = new Date(scheduledAt);
      if (scheduleDate <= new Date()) {
        return res.status(400).json({ error: "Scheduled time must be in the future." });
      }

      // Max 2 scheduled posts limit
      const scheduledCount = await Post.countDocuments({ user: userId, status: "Scheduled" });
      if (scheduledCount >= 2) {
        return res.status(403).json({ error: "You can only have a maximum of 2 scheduled posts at a time." });
      }

      status = "Scheduled";
    } else {
      // If not scheduling, check the plan limit
      if (postCount >= limit) {
        return res.status(403).json({ 
          error: `Posting limit exceeded. Your ${user.subscriptionPlan} plan allows a maximum of ${limit === Infinity ? 'unlimited' : limit} published posts. Please upgrade your plan.` 
        });
      }
    }

    const newPost = await Post.create({
      user: userId,
      image: postImage,
      caption,
      location,
      status,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error in createPost:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
