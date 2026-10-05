"use client";

import { Grid, Bookmark, UserSquare, Settings } from "lucide-react";
import { currentUser } from "@/lib/mock-data";

export default function ProfileView() {
  return (
    <div className="w-full max-w-[935px] mx-auto px-4 md:px-0 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start gap-8 mb-10">
        <div className="flex-shrink-0 mx-auto md:mx-0 w-[150px] h-[150px] rounded-full overflow-hidden border dark:border-gray-800 bg-gray-100">
          <img src={currentUser?.profilePic || "https://placehold.co/300x300"} alt="Profile" className="w-full h-full object-cover" />
        </div>
        
        <div className="flex flex-col flex-1 items-center md:items-start">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <h1 className="text-xl">{currentUser?.username || "current_user"}</h1>
            <div className="flex items-center gap-2">
              <button className="bg-gray-100 dark:bg-[#363636] hover:bg-gray-200 dark:hover:bg-[#262626] font-semibold text-sm rounded-lg px-4 py-1.5 transition-colors">
                Edit profile
              </button>
              <button className="bg-gray-100 dark:bg-[#363636] hover:bg-gray-200 dark:hover:bg-[#262626] font-semibold text-sm rounded-lg px-4 py-1.5 transition-colors">
                View archive
              </button>
              <button className="hover:opacity-70"><Settings size={24} /></button>
            </div>
          </div>
          
          <div className="flex items-center gap-8 mb-4">
            <p><span className="font-semibold">0</span> posts</p>
            <p><span className="font-semibold">120</span> followers</p>
            <p><span className="font-semibold">150</span> following</p>
          </div>
          
          <div className="text-sm">
            <p className="font-semibold">{currentUser?.fullName || "Full Name"}</p>
            <p className="whitespace-pre-wrap">{currentUser?.bio || "Welcome to my Instagram profile!"}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t dark:border-gray-800 flex justify-center gap-12 text-xs font-semibold uppercase tracking-widest text-gray-500">
        <button className="flex items-center gap-2 py-4 border-t border-black dark:border-white text-black dark:text-white">
          <Grid size={12} /> Posts
        </button>
        <button className="flex items-center gap-2 py-4 hover:text-black dark:hover:text-white">
          <Bookmark size={12} /> Saved
        </button>
        <button className="flex items-center gap-2 py-4 hover:text-black dark:hover:text-white">
          <UserSquare size={12} /> Tagged
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-1 md:gap-4 mt-1">
        {/* Empty State */}
        <div className="col-span-3 flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full border-2 border-black dark:border-white flex items-center justify-center mb-4">
            <Grid size={32} strokeWidth={1} />
          </div>
          <h2 className="text-3xl font-black mb-4">Share Photos</h2>
          <p className="text-sm mb-4">When you share photos, they will appear on your profile.</p>
          <button className="text-blue-500 font-semibold text-sm hover:text-blue-700">Share your first photo</button>
        </div>
      </div>
    </div>
  );
}
