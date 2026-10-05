"use client";

import { currentUser } from "@/lib/mock-data";

export default function Stories({ onStoryClick }: { onStoryClick?: (id: number) => void }) {
  const stories = [
    { id: 0, user: currentUser, isMe: true },
    { id: 1, user: { username: "alex", profilePic: "https://placehold.co/100x100?text=A" } },
    { id: 2, user: { username: "jane", profilePic: "https://placehold.co/100x100?text=J" } },
    { id: 3, user: { username: "doe", profilePic: "https://placehold.co/100x100?text=D" } },
    { id: 4, user: { username: "smith", profilePic: "https://placehold.co/100x100?text=S" } },
    { id: 5, user: { username: "sarah", profilePic: "https://placehold.co/100x100?text=S2" } },
    { id: 6, user: { username: "mike", profilePic: "https://placehold.co/100x100?text=M" } },
  ];

  return (
    <div className="w-full max-w-[630px] mx-auto mt-4 md:mt-8 mb-6">
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2 md:px-0">
        {stories.map((story) => (
          <div 
            key={story.id} 
            className="flex flex-col items-center gap-1 cursor-pointer shrink-0"
            onClick={() => onStoryClick && onStoryClick(story.id)}
          >
            <div className={`w-[66px] h-[66px] rounded-full p-[2px] ${story.isMe ? 'bg-gray-300' : 'bg-gradient-to-tr from-yellow-400 to-fuchsia-600'}`}>
              <div className="w-full h-full rounded-full border-2 border-white dark:border-black overflow-hidden bg-white">
                <img src={story.user?.profilePic} alt={story.user?.username} className="w-full h-full object-cover" />
              </div>
            </div>
            <p className="text-xs w-[70px] truncate text-center">{story.isMe ? "Your story" : story.user?.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
