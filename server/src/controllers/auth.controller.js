import User from "../models/User.model.js";
import LoginHistory from "../models/LoginHistory.model.js";
import OTP from "../models/OTP.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UAParser } from "ua-parser-js";
import crypto from "crypto";
// import nodemailer from "nodemailer"; // Assuming nodemailer is configured elsewhere, but for now we'll mock it or use a basic one

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: "15d",
  });
};

const sendEmailOTP = async (email, otp) => {
  // In a real app, use nodemailer here
  console.log(`[EMAIL MOCK] Sending OTP ${otp} to ${email}`);
};

export const register = async (req, res) => {
  try {
    const { username, fullName, email, password } = req.body;
    
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) return res.status(400).json({ error: "Username or email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, fullName, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully. You can now login." });
  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userAgent = req.headers["user-agent"];
    const ipAddress = req.ip || req.connection.remoteAddress || "0.0.0.0";
    
    // Parse User Agent
    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser().name || "Unknown";
    const os = parser.getOS().name || "Unknown";
    const device = parser.getDevice().type || "Desktop"; // Default to Desktop if undefined
    
    // Determine Device Type
    let deviceType = "Desktop";
    if (device === "mobile") deviceType = "Mobile";
    else if (device === "tablet") deviceType = "Tablet";

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await LoginHistory.create({ user: user._id, browser, os, deviceType, ipAddress, status: "Failed", reason: "Invalid password" });
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // 1. Mobile Time Restriction (10:00 AM to 1:00 PM)
    if (deviceType === "Mobile") {
      const now = new Date();
      const hours = now.getHours();
      if (hours < 10 || hours >= 13) {
        await LoginHistory.create({ user: user._id, browser, os, deviceType, ipAddress, status: "Failed", reason: "Mobile login only allowed between 10 AM and 1 PM" });
        return res.status(403).json({ error: "Mobile logins are only permitted between 10:00 AM and 1:00 PM server time." });
      }
    }

    // 2. Google Chrome OTP Requirement
    if (browser.includes("Chrome")) {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
      
      await OTP.create({
        user: user._id,
        otp: otpCode,
        purpose: "Login_Chrome"
      });

      await sendEmailOTP(user.email, otpCode);
      
      await LoginHistory.create({ user: user._id, browser, os, deviceType, ipAddress, status: "OTP_Pending" });
      
      return res.status(200).json({ 
        requiresOtp: true, 
        message: "An OTP has been sent to your registered email address.",
        userId: user._id 
      });
    }

    // 3. Microsoft Edge (or others) - Direct Login
    await LoginHistory.create({ user: user._id, browser, os, deviceType, ipAddress, status: "Success" });
    const token = generateToken(user._id);

    res.status(200).json({
      _id: user._id,
      username: user.username,
      profilePic: user.profilePic,
      token
    });

  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const verifyLoginOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    
    // Find OTP record
    const otpRecord = await OTP.findOne({ user: userId, purpose: "Login_Chrome", isVerified: false })
                               .sort({ createdAt: -1 });

    if (!otpRecord) return res.status(400).json({ error: "OTP expired or invalid" });

    if (otpRecord.retryCount >= 3) {
       return res.status(429).json({ error: "Maximum OTP retry limit reached. Please login again." });
    }

    if (otpRecord.otp !== otp) {
      otpRecord.retryCount += 1;
      await otpRecord.save();
      return res.status(400).json({ error: "Incorrect OTP" });
    }

    // Success
    otpRecord.isVerified = true;
    await otpRecord.save();

    const user = await User.findById(userId);
    const token = generateToken(user._id);

    // Get basic req info to log success
    const parser = new UAParser(req.headers["user-agent"]);
    const deviceType = parser.getDevice().type === "mobile" ? "Mobile" : "Desktop";
    
    await LoginHistory.create({ 
      user: user._id, 
      browser: parser.getBrowser().name, 
      os: parser.getOS().name, 
      deviceType, 
      ipAddress: req.ip || "0.0.0.0", 
      status: "Success" 
    });

    res.status(200).json({
      _id: user._id,
      username: user.username,
      profilePic: user.profilePic,
      token
    });

  } catch (error) {
    console.error("Error in verifyLoginOtp:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getLoginHistory = async (req, res) => {
  try {
    const history = await LoginHistory.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.status(200).json(history);
  } catch (error) {
    console.error("Error in getLoginHistory:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
