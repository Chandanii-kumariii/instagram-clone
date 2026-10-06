import User from "../models/User.model.js";
import Subscription from "../models/Subscription.model.js";

const sendInvoiceEmail = async (email, invoiceDetails) => {
  console.log(`[EMAIL MOCK] Sending Invoice to ${email}:\n`, invoiceDetails);
};

export const purchaseSubscription = async (req, res) => {
  try {
    const { plan, paymentDetails } = req.body;
    const userId = req.user._id;

    // 1. Time Restriction (5:00 AM to 11:00 AM IST)
    // IST is UTC+5:30
    const now = new Date();
    // Convert current UTC time to IST
    const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 mins in ms
    const istTime = new Date(now.getTime() + istOffset);
    const hoursIST = istTime.getUTCHours();
    
    if (hoursIST < 5 || hoursIST >= 11) {
      return res.status(403).json({ 
        error: "Payments are currently unavailable. The payment gateway only accepts transactions between 5:00 AM and 11:00 AM IST." 
      });
    }

    // 2. Determine Plan Details
    let amount = 0;
    if (plan === "Bronze") amount = 100;
    else if (plan === "Silver") amount = 300;
    else if (plan === "Gold") amount = 1000;
    else return res.status(400).json({ error: "Invalid plan selected" });

    // 3. Mock Payment Gateway (Stripe/Razorpay)
    if (!paymentDetails || !paymentDetails.cardNumber) {
       return res.status(400).json({ error: "Payment details missing or invalid." });
    }
    const transactionId = `txn_${Math.random().toString(36).substring(2, 15)}`;

    // 4. Update User and Create Subscription Record
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1); // 1 Month validity

    const newSub = await Subscription.create({
      user: userId,
      plan,
      amount,
      transactionId,
      status: "Success",
      startDate,
      endDate
    });

    const user = await User.findById(userId);
    user.subscriptionPlan = plan;
    user.subscriptionExpiry = endDate;
    await user.save();

    // 5. Send Invoice Email
    const invoiceDetails = {
      plan,
      amount: `₹${amount}`,
      transactionId,
      validity: "1 Month",
      nextRenewalDate: endDate.toDateString()
    };
    await sendInvoiceEmail(user.email, invoiceDetails);

    res.status(200).json({
      message: `Successfully subscribed to the ${plan} plan!`,
      subscription: newSub
    });

  } catch (error) {
    console.error("Error in purchaseSubscription:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
