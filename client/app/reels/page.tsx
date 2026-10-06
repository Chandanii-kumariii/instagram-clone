import Sidebar from "@/components/insta/Sidebar";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Music } from "lucide-react";

// Dummy reels for testing
const DUMMY_REELS = [
  {
    id: 1,
    username: "nature_lover",
    avatar: "https://i.pravatar.cc/150?u=12",
    description: "Beautiful sunset at the beach 🌅 #nature #sunset #beach",
    song: "Original Audio - nature_lover",
    likes: "124K",
    comments: "1,234",
    videoPlaceholder: "bg-gradient-to-tr from-orange-400 to-pink-500",
  },
  {
    id: 2,
    username: "tech_guru",
    avatar: "https://i.pravatar.cc/150?u=5",
    description: "New coding setup! 💻🚀 #coding #setup #developer",
    song: "Lofi Beats - chill_vibes",
    likes: "89K",
    comments: "456",
    videoPlaceholder: "bg-gradient-to-tr from-blue-500 to-purple-600",
  },
];

export default function ReelsPage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-black min-h-screen font-sans">
      <Sidebar />
      <div className="flex-1 md:ml-[72px] xl:ml-[244px] flex justify-center py-8 bg-black">
        {/* Reels Container */}
        <div className="h-[calc(100vh-4rem)] w-full max-w-[400px] overflow-y-scroll snap-y snap-mandatory hide-scrollbar">
          {DUMMY_REELS.map((reel) => (
            <div key={reel.id} className="relative h-full w-full snap-start snap-always bg-zinc-900 rounded-lg flex items-center justify-center mb-4">
              
              {/* Simulated Video Area */}
              <div className={`absolute inset-0 w-full h-full ${reel.videoPlaceholder} opacity-80 rounded-lg`}></div>
              <p className="z-10 text-white font-bold text-2xl tracking-widest opacity-50">REEL VIDEO</p>
              
              {/* Overlay Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 z-20 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-lg">
                <div className="flex justify-between items-end">
                  {/* Left Side: User Info & Caption */}
                  <div className="flex flex-col gap-3 max-w-[80%] text-white">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-white">
                        <img src={reel.avatar} alt={reel.username} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-semibold text-sm">{reel.username}</span>
                      <button className="text-sm font-semibold border border-white rounded-md px-2 py-0.5 ml-2 hover:bg-white hover:text-black transition-colors">
                        Follow
                      </button>
                    </div>
                    <p className="text-sm line-clamp-2">{reel.description}</p>
                    <div className="flex items-center gap-2 text-sm bg-white/20 w-max px-2 py-1 rounded-full backdrop-blur-sm">
                      <Music className="w-3 h-3" />
                      <span className="marquee truncate max-w-[150px]">{reel.song}</span>
                    </div>
                  </div>

                  {/* Right Side: Actions */}
                  <div className="flex flex-col items-center gap-6 text-white pb-2">
                    <button className="flex flex-col items-center gap-1 hover:opacity-70 transition-opacity">
                      <Heart className="w-7 h-7" />
                      <span className="text-xs font-medium">{reel.likes}</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 hover:opacity-70 transition-opacity">
                      <MessageCircle className="w-7 h-7" />
                      <span className="text-xs font-medium">{reel.comments}</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 hover:opacity-70 transition-opacity">
                      <Send className="w-7 h-7" />
                    </button>
                    <button className="flex flex-col items-center gap-1 hover:opacity-70 transition-opacity">
                      <Bookmark className="w-7 h-7" />
                    </button>
                    <button className="flex flex-col items-center gap-1 hover:opacity-70 transition-opacity">
                      <MoreHorizontal className="w-7 h-7" />
                    </button>
                    <div className="w-7 h-7 rounded-md border-2 border-white overflow-hidden mt-2">
                      <img src={reel.avatar} alt="audio track" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
