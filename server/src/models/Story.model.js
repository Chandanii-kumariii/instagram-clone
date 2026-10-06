import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    media: [
      {
        url: { type: String, required: true },
        mediaType: { type: String, enum: ['image', 'video'], required: true },
      }
    ],
    privacy: {
      type: String,
      enum: ['Public', 'Followers Only', 'Close Friends'],
      default: 'Public'
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(+new Date() + 24 * 60 * 60 * 1000) // 24 hours from now
    },
    isHighlighted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Optional: Add a TTL index to automatically remove the document when expiresAt is reached.
// However, since a custom background job is requested, we might skip the strict TTL 
// and handle it via cron job for more control (e.g. archiving instead of hard delete).
// storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Story = mongoose.model("Story", storySchema);

export default Story;
