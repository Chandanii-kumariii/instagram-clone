"use client";

import { useState } from "react";
import { X, Loader2, Globe } from "lucide-react";
import axiosInstance from "@/lib/axios";
import useAuthStore from "@/store/authStore";

interface LanguageSettingsModalProps {
  onClose: () => void;
}

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish (Español)" },
  { code: "hi", name: "Hindi (हिंदी)" },
  { code: "pt", name: "Portuguese (Português)" },
  { code: "zh", name: "Chinese (中文)" },
  { code: "fr", name: "French (Français)" },
];

export default function LanguageSettingsModal({ onClose }: LanguageSettingsModalProps) {
  const { user, login } = useAuthStore() as any;
  const [selectedLanguage, setSelectedLanguage] = useState(user?.language || "en");
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpMethod, setOtpMethod] = useState(""); // "email" or "mobile"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleRequestChange = async () => {
    if (selectedLanguage === user?.language) {
      setError("This is already your current language.");
      return;
    }
    
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axiosInstance.post("/api/settings/language/request", {
        newLanguage: selectedLanguage
      });
      setIsOtpStep(true);
      setOtpMethod(res.data.method);
      setMessage(res.data.message);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to request language change");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axiosInstance.post("/api/settings/language/verify", {
        newLanguage: selectedLanguage,
        otp
      });
      
      // Update local user state
      const updatedUser = { ...user, language: res.data.language };
      login(updatedUser); // Update zustand store
      
      setMessage("Language updated successfully!");
      setTimeout(() => onClose(), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-xl overflow-hidden shadow-xl border border-gray-200 dark:border-zinc-800 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-zinc-800">
          <h2 className="font-semibold text-base flex items-center gap-2">
            <Globe size={18} />
            Language Settings
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}
          {message && <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-100">{message}</div>}

          {!isOtpStep ? (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-400">Select your preferred language. For security, changing this requires verification.</p>
              
              <div className="flex flex-col gap-2 mt-2">
                {LANGUAGES.map((lang) => (
                  <label key={lang.code} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${selectedLanguage === lang.code ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800/50'}`}>
                    <span className="text-sm font-medium">{lang.name}</span>
                    <input 
                      type="radio" 
                      name="language" 
                      value={lang.code}
                      checked={selectedLanguage === lang.code}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                  </label>
                ))}
              </div>

              <button 
                onClick={handleRequestChange}
                disabled={loading || selectedLanguage === user?.language}
                className="mt-4 w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm disabled:opacity-50 transition-colors flex justify-center items-center"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : "Save Changes"}
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border border-gray-200 dark:border-zinc-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  We've sent a 6-digit code to your <span className="font-bold text-black dark:text-white">{otpMethod === 'email' ? 'Email Address' : 'Mobile Number'}</span> to verify this change.
                </p>
                <input
                  type="text"
                  placeholder="------"
                  className="w-full rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3 text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={otp}
                  maxLength={6}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>

              <button 
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
                className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm disabled:opacity-50 transition-colors flex justify-center items-center"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : "Verify OTP"}
              </button>
              
              <button 
                onClick={() => { setIsOtpStep(false); setOtp(""); setError(""); setMessage(""); }}
                className="text-xs text-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
