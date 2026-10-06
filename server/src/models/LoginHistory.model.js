import mongoose from "mongoose";

const loginHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    browser: {
      type: String,
      default: "Unknown",
    },
    os: {
      type: String,
      default: "Unknown",
    },
    deviceType: {
      type: String,
      enum: ["Desktop", "Laptop", "Mobile", "Tablet", "Unknown"],
      default: "Unknown",
    },
    ipAddress: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Success", "Failed", "OTP_Pending"],
      required: true,
    },
    reason: {
      type: String, // Reason for failure (e.g., "Outside allowed time", "Invalid OTP")
      default: "",
    }
  },
  { timestamps: true }
);

const LoginHistory = mongoose.model("LoginHistory", loginHistorySchema);
export default LoginHistory;
