import User from "../models/User.model.js";
import Post from "../models/Post.model.js";
import Story from "../models/Story.model.js";
import Subscription from "../models/Subscription.model.js";
import AuditLog from "../models/AuditLog.model.js";

// Middleware check for admin is assumed to be handled before these controllers

// 1. Dashboard Summary Statistics
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ role: "User" }); // Could refine 'active' definition
    const totalPosts = await Post.countDocuments();
    const totalStories = await Story.countDocuments();
    const totalSubscriptions = await Subscription.countDocuments({ status: "Success" });
    
    // Revenue sum
    const revenueResult = await Subscription.aggregate([
      { $match: { status: "Success" } },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.status(200).json({
      totalUsers,
      activeUsers,
      totalPosts,
      totalStories,
      totalSubscriptions,
      totalRevenue
    });
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 2. Get Users with Filters and Pagination
export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, plan, role } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }
    if (plan) query.subscriptionPlan = plan;
    if (role) query.role = role;

    const users = await User.find(query)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalUsers: total
    });
  } catch (error) {
    console.error("Error in getUsers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 3. Delete User (CRUD)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user._id;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.role === "Admin") return res.status(403).json({ error: "Cannot delete another admin" });

    await User.findByIdAndDelete(id);
    
    // Log action
    await AuditLog.create({
      adminId,
      action: "DELETE_USER",
      targetId: id,
      targetModel: "User",
      details: { username: user.username, email: user.email },
      ipAddress: req.ip
    });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 4. Get Audit Logs
export const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("adminId", "username email")
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json(logs);
  } catch (error) {
    console.error("Error in getAuditLogs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
