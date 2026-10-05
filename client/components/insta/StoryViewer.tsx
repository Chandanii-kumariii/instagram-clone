"use client";

import { X, Play, Pause, Volume2, MoreHorizontal, Send, Heart } from "lucide-react";
import { useState, useEffect } from "react";

export default function StoryViewer({ storyId, onClose }: { storyId: number, onClose: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          onClose(); // Auto close when done
          return 100;
        }
        return prev + 1; // Roughly 10 seconds total (100 * 100ms)
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPaused, onClose]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#1a1a1a] flex items-center justify-center">
      {/* Top Controls */}
      <button onClick={onClose} className="absolute top-4 right-4 text-white z-50 p-2">
        <X size={28} />
      </button>

      <img src="https://placehold.co/200x200/1a1a1a/white?text=Insta" className="absolute top-4 left-4 h-8 opacity-50 hidden md:block" alt="Logo" />

      {/* Story Container */}
      <div 
        className="relative w-full h-full md:w-[400px] md:h-[90vh] md:rounded-lg overflow-hidden bg-black flex flex-col"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Progress Bars */}
        <div className="absolute top-0 left-0 right-0 p-3 z-10 flex gap-1">
          <div className="h-[2px] flex-1 bg-white/30 rounded-full overflow-hidden">
             <div className="h-full bg-white transition-all duration-100 ease-linear" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* User Info Header */}
        <div className="absolute top-6 left-0 right-0 px-3 z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
               <img src="https://placehold.co/100x100" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <span className="text-white font-semibold text-sm drop-shadow-md">username</span>
            <span className="text-white/70 text-sm drop-shadow-md">4h</span>
          </div>
          <div className="flex gap-3 text-white">
            <button onClick={(e) => { e.stopPropagation(); setIsPaused(!isPaused); }}>
              {isPaused ? <Play size={20} /> : <Pause size={20} />}
            </button>
            <button><Volume2 size={20} /></button>
            <button><MoreHorizontal size={20} /></button>
          </div>
        </div>

        {/* Image/Video Content */}
        <div className="flex-1 flex items-center justify-center bg-zinc-900">
          <img src={`https://placehold.co/600x1000?text=Story+${storyId}`} alt="Story" className="w-full h-full object-cover" />
        </div>

        {/* Footer Reply Box */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10 flex items-center gap-4">
          <div className="flex-1 border border-white/50 rounded-full px-4 py-2.5 flex items-center bg-black/20 backdrop-blur-sm text-white">
             <input 
               type="text" 
               placeholder="Reply to username..." 
               className="bg-transparent outline-none w-full text-sm placeholder:text-white/70"
               onFocus={() => setIsPaused(true)}
               onBlur={() => setIsPaused(false)}
             />
          </div>
          <button className="text-white"><Heart size={28} /></button>
          <button className="text-white"><Send size={28} /></button>
        </div>
      </div>
    </div>
  );
}
