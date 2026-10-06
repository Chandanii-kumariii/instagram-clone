import mongoose from "mongoose";

const storyAnalyticsSchema = new mongoose.Schema(
  {
    storyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story",
      required: true,
      index: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    views: {
      type: Number,
      default: 0
    },
    uniqueViewers: [
      {
        viewer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        viewedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    reactions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        reactionType: String, // e.g., 'like', 'love', 'haha'
        reactedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    replies: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        message: String,
        repliedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    completionRate: {
      type: Number, // Percentage of story watched or skipped
      default: 0
    }
  },
  { timestamps: true }
);

const StoryAnalytics = mongoose.model("StoryAnalytics", storyAnalyticsSchema);

export default StoryAnalytics;
