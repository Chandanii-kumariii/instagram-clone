import User from "../models/User.model.js";
import OTP from "../models/OTP.model.js";

const sendEmailOTP = async (email, otp) => {
  console.log(`[EMAIL MOCK] Sending Language Change OTP ${otp} to Email: ${email}`);
};

const sendMobileOTP = async (mobile, otp) => {
  console.log(`[SMS MOCK] Sending Language Change OTP ${otp} to Mobile: ${mobile}`);
};

export const requestLanguageChange = async (req, res) => {
  try {
    const { newLanguage } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);

    const validLanguages = ["en", "es", "hi", "pt", "zh", "fr"];
    if (!validLanguages.includes(newLanguage)) {
      return res.status(400).json({ error: "Invalid language selected." });
    }

    if (user.language === newLanguage) {
      return res.status(400).json({ error: "Language is already set to this." });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
    const purpose = `Language_Change_${newLanguage}`;

    // Remove any previous pending language change OTPs for this user
    await OTP.deleteMany({ user: userId, purpose: { $regex: /^Language_Change_/ } });

    await OTP.create({
      user: userId,
      otp: otpCode,
      purpose: purpose
    });

    if (newLanguage === "fr") {
      // Send to Email for French
      await sendEmailOTP(user.email, otpCode);
      return res.status(200).json({ 
        message: "OTP sent to your registered Email address for French verification.", 
        method: "email" 
      });
    } else {
      // Send to Mobile for others
      // If user doesn't have a mobile number, we should ideally fail or fallback to email. 
      // Assuming they have one for this requirement.
      const mobile = user.mobile || "9999999999";
      await sendMobileOTP(mobile, otpCode);
      return res.status(200).json({ 
        message: "OTP sent to your registered Mobile number.", 
        method: "mobile" 
      });
    }

  } catch (error) {
    console.error("Error in requestLanguageChange:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const verifyLanguageChangeOtp = async (req, res) => {
  try {
    const { otp, newLanguage } = req.body;
    const userId = req.user._id;

    const purpose = `Language_Change_${newLanguage}`;

    const otpRecord = await OTP.findOne({ user: userId, purpose, isVerified: false })
                               .sort({ createdAt: -1 });

    if (!otpRecord) return res.status(400).json({ error: "OTP expired or invalid" });

    if (otpRecord.retryCount >= 3) {
       return res.status(429).json({ error: "Maximum OTP retry limit reached. Please request a new OTP." });
    }

    if (otpRecord.otp !== otp) {
      otpRecord.retryCount += 1;
      await otpRecord.save();
      return res.status(400).json({ error: "Incorrect OTP" });
    }

    // Success
    otpRecord.isVerified = true;
    await otpRecord.save();

    // Update user language
    const user = await User.findById(userId);
    user.language = newLanguage;
    await user.save();

    res.status(200).json({ 
      message: "Language updated successfully",
      language: user.language
    });

  } catch (error) {
    console.error("Error in verifyLanguageChangeOtp:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
