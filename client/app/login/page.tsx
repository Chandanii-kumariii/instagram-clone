"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import axiosInstance from "@/lib/axios";
import { Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  const router = useRouter();
  const loginAction = useAuthStore((state: any) => state.login);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await axiosInstance.post("/api/auth/login", { email, password });
      
      if (res.data.requiresOtp) {
        setIsOtpStep(true);
        setUserId(res.data.userId);
        setMessage(res.data.message);
      } else {
        // Direct login success
        localStorage.setItem("accessToken", res.data.token);
        loginAction(res.data);
        router.push("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axiosInstance.post("/api/auth/verify-login-otp", { userId, otp });
      
      localStorage.setItem("accessToken", res.data.token);
      loginAction(res.data);
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-black">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm">
        <h1 className="mb-6 text-center text-3xl font-bold font-serif">Instagram</h1>
        
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}
        {message && <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-100">{message}</div>}
        
        {!isOtpStep ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              className="rounded border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="rounded border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              type="submit" 
              disabled={loading}
              className="mt-2 flex items-center justify-center rounded bg-blue-500 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-70 transition-colors"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Log In"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              className="rounded border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 p-2 text-center text-lg tracking-[0.5em] focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={otp}
              maxLength={6}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button 
              type="submit" 
              disabled={loading || otp.length !== 6}
              className="mt-2 flex items-center justify-center rounded bg-blue-500 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-70 transition-colors"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Verify OTP"}
            </button>
            <button 
              type="button" 
              onClick={() => { setIsOtpStep(false); setOtp(""); setError(""); setMessage(""); }}
              className="text-xs text-blue-500 hover:underline"
            >
              Back to Login
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link href="/signup" className="font-semibold text-blue-500 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
