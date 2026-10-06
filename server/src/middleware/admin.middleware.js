export const protectAdminRoute = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.user.role !== "Admin") {
      return res.status(403).json({ error: "Forbidden: Admin access required" });
    }

    next();
  } catch (error) {
    console.log("Error in protectAdminRoute middleware: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
