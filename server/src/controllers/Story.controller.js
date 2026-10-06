import Story from "../models/Story.model.js";
import StoryAnalytics from "../models/StoryAnalytics.model.js";
import User from "../models/User.model.js";

// Create a new story
export const createStory = async (req, res) => {
  try {
    const { media, privacy } = req.body;
    const userId = req.user._id;

    if (!media || media.length === 0) {
      return res.status(400).json({ error: "Media is required to create a story" });
    }

    const newStory = new Story({
      user: userId,
      media,
      privacy: privacy || "Public",
    });

    await newStory.save();

    // Initialize analytics for this story
    const newAnalytics = new StoryAnalytics({
      storyId: newStory._id,
      owner: userId,
    });
    await newAnalytics.save();

    res.status(201).json(newStory);
  } catch (error) {
    console.error("Error in createStory controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get feed stories (from followed users, public, etc.)
export const getFeedStories = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    // Find active stories (not expired)
    // For simplicity, we just fetch stories from following + own stories.
    // Privacy filtering should be applied (e.g. Followers Only is fine since we are following them)
    
    const followingIds = user.following || [];
    const targetUserIds = [...followingIds, userId];

    const stories = await Story.find({
      user: { $in: targetUserIds },
      expiresAt: { $gt: new Date() }
    }).populate("user", "username profilePic").sort({ createdAt: -1 });

    res.status(200).json(stories);
  } catch (error) {
    console.error("Error in getFeedStories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// View a story
export const viewStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const viewerId = req.user._id;

    const story = await Story.findById(storyId);
    if (!story) return res.status(404).json({ error: "Story not found" });

    if (story.user.toString() === viewerId.toString()) {
      return res.status(200).json({ message: "Viewed own story" }); // Don't count own views
    }

    // Update analytics
    const analytics = await StoryAnalytics.findOne({ storyId });
    if (analytics) {
      // Check for unique viewer
      const isUnique = !analytics.uniqueViewers.some(
        (v) => v.viewer.toString() === viewerId.toString()
      );

      analytics.views += 1;
      
      if (isUnique) {
        analytics.uniqueViewers.push({ viewer: viewerId });
      }

      await analytics.save();
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in viewStory:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a story
export const deleteStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const userId = req.user._id;

    const story = await Story.findById(storyId);
    if (!story) return res.status(404).json({ error: "Story not found" });

    if (story.user.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Unauthorized to delete this story" });
    }

    await Story.findByIdAndDelete(storyId);
    // Analytics is intentionally NOT deleted as per requirement.
    
    res.status(200).json({ message: "Story deleted successfully" });
  } catch (error) {
    console.error("Error in deleteStory:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get Story Analytics for Owner
export const getStoryAnalytics = async (req, res) => {
  try {
    const { storyId } = req.params;
    const userId = req.user._id;

    const analytics = await StoryAnalytics.findOne({ storyId, owner: userId })
      .populate("uniqueViewers.viewer", "username profilePic")
      .populate("reactions.user", "username profilePic")
      .populate("replies.user", "username profilePic");

    if (!analytics) {
      return res.status(404).json({ error: "Analytics not found or unauthorized" });
    }

    res.status(200).json(analytics);
  } catch (error) {
    console.error("Error in getStoryAnalytics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
