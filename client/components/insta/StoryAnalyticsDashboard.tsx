"use client";

import { useEffect, useState } from "react";
import { X, Eye, Users, MessageCircle, Heart, BarChart2 } from "lucide-react";
import axiosInstance from "@/lib/axios";

interface AnalyticsData {
  views: number;
  uniqueViewers: Array<{ viewer: any; viewedAt: string }>;
  reactions: Array<{ user: any; reactionType: string; reactedAt: string }>;
  replies: Array<{ user: any; message: string; repliedAt: string }>;
  completionRate: number;
}

interface StoryAnalyticsDashboardProps {
  storyId: string;
  onClose: () => void;
}

export default function StoryAnalyticsDashboard({ storyId, onClose }: StoryAnalyticsDashboardProps) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axiosInstance.get(`/api/stories/${storyId}/analytics`);
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [storyId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-zinc-800 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-zinc-800 sticky top-0 bg-white dark:bg-zinc-900 z-10">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <BarChart2 size={20} className="text-blue-500" /> 
            Story Insights
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-5 flex flex-col gap-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex flex-col items-center justify-center border border-blue-100 dark:border-blue-900/50">
              <Eye size={24} className="text-blue-500 mb-2" />
              <span className="text-2xl font-bold text-blue-700 dark:text-blue-400">{data.views}</span>
              <span className="text-xs font-medium text-blue-600/70 dark:text-blue-400/70 uppercase tracking-wider">Total Views</span>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl flex flex-col items-center justify-center border border-purple-100 dark:border-purple-900/50">
              <Users size={24} className="text-purple-500 mb-2" />
              <span className="text-2xl font-bold text-purple-700 dark:text-purple-400">{data.uniqueViewers.length}</span>
              <span className="text-xs font-medium text-purple-600/70 dark:text-purple-400/70 uppercase tracking-wider">Unique Viewers</span>
            </div>
          </div>

          <div className="flex gap-4 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl">
            <div className="flex-1 flex flex-col items-center border-r border-gray-200 dark:border-zinc-700">
              <Heart size={18} className="text-rose-500 mb-1" />
              <span className="font-semibold">{data.reactions.length}</span>
              <span className="text-xs text-gray-500">Reactions</span>
            </div>
            <div className="flex-1 flex flex-col items-center border-r border-gray-200 dark:border-zinc-700">
              <MessageCircle size={18} className="text-green-500 mb-1" />
              <span className="font-semibold">{data.replies.length}</span>
              <span className="text-xs text-gray-500">Replies</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <BarChart2 size={18} className="text-orange-500 mb-1" />
              <span className="font-semibold">{data.completionRate}%</span>
              <span className="text-xs text-gray-500">Completion</span>
            </div>
          </div>

          {/* Viewer List */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">Viewers ({data.uniqueViewers.length})</h3>
            
            {data.uniqueViewers.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-4">No one has viewed this story yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {data.uniqueViewers.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                        <img 
                          src={item.viewer?.profilePic || `https://placehold.co/100x100?text=${item.viewer?.username?.[0] || 'U'}`} 
                          alt="Viewer" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{item.viewer?.username}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(item.viewedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    {/* Reaction Icon if they reacted */}
                    {data.reactions.some(r => r.user?._id === item.viewer?._id) && (
                      <Heart size={16} className="text-rose-500 fill-rose-500" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
