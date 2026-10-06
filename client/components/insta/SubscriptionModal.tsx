"use client";

import { useState } from "react";
import { X, Check, CreditCard, Loader2 } from "lucide-react";
import axiosInstance from "@/lib/axios";
import useAuthStore from "@/store/authStore";

interface SubscriptionModalProps {
  onClose: () => void;
}

const PLANS = [
  { name: "Bronze", price: "₹100/month", posts: "Up to 3 posts", value: "Bronze" },
  { name: "Silver", price: "₹300/month", posts: "Up to 5 posts", value: "Silver", popular: true },
  { name: "Gold", price: "₹1000/month", posts: "Unlimited posts", value: "Gold" },
];

export default function SubscriptionModal({ onClose }: SubscriptionModalProps) {
  const { user, login } = useAuthStore() as any;
  const [selectedPlan, setSelectedPlan] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [invoiceMessage, setInvoiceMessage] = useState("");

  const handleSubscribe = async () => {
    if (!selectedPlan) {
      setError("Please select a plan.");
      return;
    }
    if (!cardNumber || !expiry || !cvc) {
      setError("Please enter payment details.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axiosInstance.post("/api/subscriptions/purchase", {
        plan: selectedPlan,
        paymentDetails: { cardNumber, expiry, cvc }
      });
      
      setSuccess(true);
      setInvoiceMessage(res.data.message);
      
      // Update user plan locally
      const updatedUser = { ...user, subscriptionPlan: selectedPlan };
      login(updatedUser);
      
    } catch (err: any) {
      setError(err.response?.data?.error || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-xl p-8 text-center shadow-xl border border-gray-200 dark:border-zinc-800">
          <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{invoiceMessage}</p>
          <p className="text-sm text-gray-500 mb-6">An invoice and subscription details have been sent to your registered email address.</p>
          <button onClick={onClose} className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
            Back to Instagram
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-xl overflow-hidden shadow-xl border border-gray-200 dark:border-zinc-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-zinc-800">
          <h2 className="font-bold text-xl">Upgrade Your Plan</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {error && <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {PLANS.map((plan) => (
              <div 
                key={plan.name}
                onClick={() => setSelectedPlan(plan.value)}
                className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all ${selectedPlan === plan.value ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-200 dark:border-zinc-700 hover:border-blue-300'}`}
              >
                {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Most Popular</div>}
                <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                <p className="text-xl font-black text-blue-600 dark:text-blue-400 mb-4">{plan.price}</p>
                <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> {plan.posts}</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Premium Badge</li>
                </ul>
              </div>
            ))}
          </div>

          {selectedPlan && (
            <div className="bg-gray-50 dark:bg-zinc-800/50 p-5 rounded-xl border border-gray-200 dark:border-zinc-700 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="font-bold mb-4 flex items-center gap-2"><CreditCard size={18} /> Payment Details (Mock Stripe)</h3>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Card Number (e.g. 4242 4242 4242 4242)" 
                  className="w-full rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="MM/YY" 
                    className="w-full rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                  />
                  <input 
                    type="text" 
                    placeholder="CVC" 
                    className="w-full rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                  />
                </div>
                
                <div className="pt-2">
                  <p className="text-xs text-gray-500 mb-3 text-center">
                    Note: Payments are only processed between 5:00 AM and 11:00 AM IST.
                  </p>
                  <button 
                    onClick={handleSubscribe}
                    disabled={loading || !cardNumber}
                    className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold transition-colors flex items-center justify-center"
                  >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : `Pay ₹${selectedPlan === 'Bronze' ? 100 : selectedPlan === 'Silver' ? 300 : 1000}`}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
