import cron from "node-cron";
import Story from "../models/Story.model.js";

// Run every hour
export const startCronJobs = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      console.log("Running cron job to clean up expired stories...");
      
      const now = new Date();
      // Find all stories where expiresAt is less than current time
      const result = await Story.deleteMany({ expiresAt: { $lt: now } });
      
      if (result.deletedCount > 0) {
        console.log(`Successfully deleted ${result.deletedCount} expired stories.`);
      } else {
        console.log("No expired stories found to delete.");
      }
    } catch (error) {
      console.error("Error during expired stories cleanup cron job:", error);
    }
  });
  
  console.log("Cron jobs initialized.");
};
