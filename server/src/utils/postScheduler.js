import cron from "node-cron";
import Post from "../models/Post.model.js";
import User from "../models/User.model.js";

// Run every minute
const initPostScheduler = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();
      
      // Find posts scheduled for now or in the past that are still in 'Scheduled' state
      const postsToPublish = await Post.find({
        status: "Scheduled",
        scheduledAt: { $lte: now }
      });

      if (postsToPublish.length > 0) {
        console.log(`[Post Scheduler] Found ${postsToPublish.length} post(s) to publish.`);
      }

      for (const post of postsToPublish) {
        try {
          const user = await User.findById(post.user);
          
          // Re-check plan limits before publishing
          let limit = 1; 
          if (user.subscriptionPlan === "Bronze") limit = 3;
          else if (user.subscriptionPlan === "Silver") limit = 5;
          else if (user.subscriptionPlan === "Gold") limit = Infinity;

          const publishedCount = await Post.countDocuments({ user: user._id, status: "Published" });
          
          if (publishedCount >= limit) {
             // Fails due to limit
             post.status = "Failed";
             post.errorLog = `Failed to publish scheduled post at ${now.toLocaleString()}: Posting limit exceeded for ${user.subscriptionPlan} plan.`;
          } else {
             // Publish
             post.status = "Published";
             post.errorLog = "";
             console.log(`[Post Scheduler] Published post ${post._id} for user ${user.username}`);
          }

          await post.save();
        } catch (postError) {
          console.error(`[Post Scheduler] Error processing post ${post._id}:`, postError);
          post.status = "Failed";
          post.errorLog = `System error: ${postError.message}`;
          await post.save();
        }
      }
    } catch (error) {
      console.error("[Post Scheduler] Error running cron job:", error);
    }
  });
};

export default initPostScheduler;
