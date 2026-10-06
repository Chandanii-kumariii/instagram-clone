import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/User.model.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/instagram");
    console.log("Connected to MongoDB for Seeding");

    const adminEmail = "admin@instagram.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("Admin user already exists!");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const admin = new User({
      username: "admin_super",
      fullName: "System Administrator",
      email: adminEmail,
      password: hashedPassword,
      role: "Admin",
      subscriptionPlan: "Gold", // Admins get everything
    });

    await admin.save();
    console.log("=========================================");
    console.log("✅ Admin Seeder Executed Successfully!");
    console.log("Credentials for Evaluation:");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: Admin@123`);
    console.log("=========================================");
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
