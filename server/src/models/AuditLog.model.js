import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String, // e.g., 'DELETE_USER', 'UPDATE_SUBSCRIPTION'
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId, // The ID of the affected document
      required: true,
    },
    targetModel: {
      type: String, // e.g., 'User', 'Post', 'Subscription'
      required: true,
    },
    details: {
      type: Object, // Any additional JSON details about what changed
      default: {},
    },
    ipAddress: {
      type: String,
      default: "0.0.0.0",
    }
  },
  { timestamps: true }
);

const AuditLog = mongoose.model("AuditLog", auditLogSchema);
export default AuditLog;
