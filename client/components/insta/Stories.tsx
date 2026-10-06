"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import axiosInstance from "@/lib/axios";
import CreateStoryModal from "./CreateStoryModal";
import useAuthStore from "@/store/authStore";

export default function Stories({ onStoryClick }: { onStoryClick?: (id: string, stories: any[]) => void }) {
  const [stories, setStories] = useState<any[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { user } = useAuthStore() as any; // Assuming authStore has user

  const fetchStories = async () => {
    try {
      const res = await axiosInstance.get("/api/stories/feed");
      setStories(res.data);
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  // Group stories by user so we don't show the same user multiple times in the bubbles
  const groupedStories = stories.reduce((acc: any, story: any) => {
    if (!acc[story.user._id]) {
      acc[story.user._id] = {
        user: story.user,
        stories: [],
      };
    }
    acc[story.user._id].stories.push(story);
    return acc;
  }, {});

  const storyGroups = Object.values(groupedStories);

  return (
    <div className="w-full max-w-[630px] mx-auto mt-4 md:mt-8 mb-6">
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2 md:px-0">
        
        {/* Current User Add Story Button */}
        <div 
          className="flex flex-col items-center gap-1 cursor-pointer shrink-0 relative"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <div className="w-[66px] h-[66px] rounded-full p-[2px] bg-gray-200 dark:bg-zinc-800 relative">
            <div className="w-full h-full rounded-full border-2 border-white dark:border-black overflow-hidden bg-white">
              <img 
                src={user?.profilePic || "https://placehold.co/100x100?text=U"} 
                alt="Your story" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full border-2 border-white dark:border-black p-0.5 text-white">
              <Plus size={14} strokeWidth={3} />
            </div>
          </div>
          <p className="text-xs w-[70px] truncate text-center text-gray-500">Your story</p>
        </div>

        {/* Feed Stories */}
        {storyGroups.map((group: any) => (
          <div 
            key={group.user._id} 
            className="flex flex-col items-center gap-1 cursor-pointer shrink-0"
            onClick={() => onStoryClick && onStoryClick(group.user._id, group.stories)}
          >
            <div className="w-[66px] h-[66px] rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 to-fuchsia-600">
              <div className="w-full h-full rounded-full border-2 border-white dark:border-black overflow-hidden bg-white">
                <img 
                  src={group.user.profilePic || `https://placehold.co/100x100?text=${group.user.username[0].toUpperCase()}`} 
                  alt={group.user.username} 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
            <p className="text-xs w-[70px] truncate text-center">{group.user.username}</p>
          </div>
        ))}
      </div>

      {isCreateModalOpen && (
        <CreateStoryModal 
          onClose={() => setIsCreateModalOpen(false)} 
          onSuccess={fetchStories} 
        />
      )}
    </div>
  );
}
