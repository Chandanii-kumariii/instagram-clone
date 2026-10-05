"use client";

import { currentUser } from "@/lib/mock-data";

export default function RightSidebar() {
  return (
    <div className="hidden lg:block w-[320px] pt-8 pl-8">
      {/* Current User */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-200">
            <img src={currentUser?.profilePic || "https://placehold.co/100x100"} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-semibold text-sm">{currentUser?.username || "current_user"}</p>
            <p className="text-gray-500 text-sm">{currentUser?.fullName || "Full Name"}</p>
          </div>
        </div>
        <button className="text-blue-500 text-xs font-semibold hover:text-black dark:hover:text-white">Switch</button>
      </div>

      {/* Suggestions Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-500 font-semibold text-sm">Suggested for you</p>
        <button className="text-xs font-semibold hover:text-gray-500">See All</button>
      </div>

      {/* Suggestions List */}
      <div className="flex flex-col gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-200">
                <img src={`https://placehold.co/100x100?text=${i}`} alt={`User ${i}`} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-semibold text-sm hover:text-gray-500">suggested_user_{i}</p>
                <p className="text-gray-500 text-xs">Followed by some_friend + {i} more</p>
              </div>
            </div>
            <button className="text-blue-500 text-xs font-semibold hover:text-black dark:hover:text-white">Follow</button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 text-xs text-gray-400 font-medium">
        <p className="mb-4">About • Help • Press • API • Jobs • Privacy • Terms • Locations • Language • Meta Verified</p>
        <p>© 2026 INSTAGRAM FROM META</p>
      </div>
    </div>
  );
}
