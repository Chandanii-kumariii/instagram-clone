"use client";

import { useState, useEffect } from "react";
import { Grid, Bookmark, UserSquare, Settings, Activity, Globe, Crown } from "lucide-react";
import useAuthStore from "@/store/authStore";
import axiosInstance from "@/lib/axios";
import LanguageSettingsModal from "./LanguageSettingsModal";
import SubscriptionModal from "./SubscriptionModal";

export default function ProfileView() {
  const { user } = useAuthStore() as any;
  const [activeTab, setActiveTab] = useState("posts");
  const [loginHistory, setLoginHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showLanguageSettings, setShowLanguageSettings] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);

  useEffect(() => {
    if (activeTab === "history") {
      const fetchHistory = async () => {
        try {
          setLoadingHistory(true);
          const res = await axiosInstance.get("/api/auth/login-history");
          setLoginHistory(res.data);
        } catch (error) {
          console.error("Error fetching login history:", error);
        } finally {
          setLoadingHistory(false);
        }
      };
      fetchHistory();
    }
  }, [activeTab]);

  return (
    <div className="w-full max-w-[935px] mx-auto px-4 md:px-0 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start gap-8 mb-10">
        <div className="flex-shrink-0 mx-auto md:mx-0 w-[150px] h-[150px] rounded-full overflow-hidden border dark:border-gray-800 bg-gray-100">
          <img 
            src={user?.profilePic || `https://placehold.co/300x300?text=${user?.username?.[0] || 'U'}`} 
            alt="Profile" 
            className="w-full h-full object-cover" 
          />
        </div>
        
        <div className="flex flex-col flex-1 items-center md:items-start">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <h1 className="text-xl">{user?.username || "loading..."}</h1>
            <div className="flex items-center gap-2">
              <button className="bg-gray-100 dark:bg-[#363636] hover:bg-gray-200 dark:hover:bg-[#262626] font-semibold text-sm rounded-lg px-4 py-1.5 transition-colors">
                Edit profile
              </button>
              <button className="bg-gray-100 dark:bg-[#363636] hover:bg-gray-200 dark:hover:bg-[#262626] font-semibold text-sm rounded-lg px-4 py-1.5 transition-colors">
                View archive
              </button>
              <button onClick={() => setShowLanguageSettings(true)} className="hover:opacity-70 p-1 bg-gray-100 dark:bg-[#363636] rounded-full flex items-center justify-center w-8 h-8">
                <Globe size={16} />
              </button>
              <button className="hover:opacity-70"><Settings size={24} /></button>
            </div>
          </div>
          
          <div className="flex items-center gap-8 mb-4">
            <p><span className="font-semibold">0</span> posts</p>
            <p><span className="font-semibold">0</span> followers</p>
            <p><span className="font-semibold">0</span> following</p>
          </div>
          
          <div className="flex items-center gap-2 mb-4 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 px-3 py-1.5 rounded-full text-xs font-semibold">
            <Crown size={14} />
            <span>{user?.subscriptionPlan || 'Free'} Plan</span>
            {(!user?.subscriptionPlan || user?.subscriptionPlan === 'Free') && (
              <button 
                onClick={() => setShowSubscription(true)}
                className="ml-2 text-blue-600 dark:text-blue-400 hover:underline"
              >
                Upgrade
              </button>
            )}
            {user?.subscriptionPlan !== 'Free' && (
              <button 
                onClick={() => setShowSubscription(true)}
                className="ml-2 text-blue-600 dark:text-blue-400 hover:underline"
              >
                Manage
              </button>
            )}
          </div>
          
          <div className="text-sm">
            <p className="font-semibold">{user?.fullName || "Full Name"}</p>
            <p className="whitespace-pre-wrap">{user?.bio || "Welcome to my Instagram profile!"}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t dark:border-gray-800 flex justify-center gap-12 text-xs font-semibold uppercase tracking-widest text-gray-500">
        <button 
          onClick={() => setActiveTab("posts")}
          className={`flex items-center gap-2 py-4 border-t transition-colors ${activeTab === 'posts' ? 'border-black dark:border-white text-black dark:text-white' : 'border-transparent hover:text-black dark:hover:text-white'}`}
        >
          <Grid size={12} /> Posts
        </button>
        <button 
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-2 py-4 border-t transition-colors ${activeTab === 'history' ? 'border-black dark:border-white text-black dark:text-white' : 'border-transparent hover:text-black dark:hover:text-white'}`}
        >
          <Activity size={12} /> Login History
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "posts" && (
          <div className="grid grid-cols-3 gap-1 md:gap-4">
            <div className="col-span-3 flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full border-2 border-black dark:border-white flex items-center justify-center mb-4">
                <Grid size={32} strokeWidth={1} />
              </div>
              <h2 className="text-3xl font-black mb-4">Share Photos</h2>
              <p className="text-sm mb-4">When you share photos, they will appear on your profile.</p>
              <button className="text-blue-500 font-semibold text-sm hover:text-blue-700">Share your first photo</button>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold">Recent Login Activity</h2>
              <p className="text-xs text-gray-500">Monitors the last 20 attempts</p>
            </div>
            
            {loadingHistory ? (
              <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-b-2 border-blue-500 rounded-full"></div></div>
            ) : loginHistory.length === 0 ? (
              <div className="text-center p-8 text-gray-500">No login history found.</div>
            ) : (
              <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-zinc-800">
                    <tr>
                      <th className="px-4 py-3 font-medium">Date & Time</th>
                      <th className="px-4 py-3 font-medium">Device & OS</th>
                      <th className="px-4 py-3 font-medium">Browser</th>
                      <th className="px-4 py-3 font-medium">IP Address</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/50">
                    {loginHistory.map((log: any) => (
                      <tr key={log._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium">{log.deviceType}</span>
                          <span className="text-xs text-gray-500 block">{log.os}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {log.browser}
                            {log.browser.includes("Chrome") && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">OTP Req.</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-500">
                          {log.ipAddress}
                        </td>
                        <td className="px-4 py-3">
                          {log.status === "Success" && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              Success
                            </span>
                          )}
                          {log.status === "Failed" && (
                            <div className="flex flex-col">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                Failed
                              </span>
                              {log.reason && <span className="text-[10px] text-red-500 mt-1 max-w-[150px] truncate" title={log.reason}>{log.reason}</span>}
                            </div>
                          )}
                          {log.status === "OTP_Pending" && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                              OTP Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
      
      {showLanguageSettings && (
        <LanguageSettingsModal onClose={() => setShowLanguageSettings(false)} />
      )}
      
      {showSubscription && (
        <SubscriptionModal onClose={() => setShowSubscription(false)} />
      )}
    </div>
  );
}
