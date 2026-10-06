import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    purpose: {
      type: String, // "Login_Chrome", "Language_Change", etc.
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      // Default to 10 minutes from creation
      default: () => new Date(Date.now() + 10 * 60000), 
    },
    retryCount: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

// TTL index to automatically remove expired OTPs (optional, but good for cleanup)
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTP = mongoose.model("OTP", otpSchema);
export default OTP;
