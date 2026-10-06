"use client";

import { X, Play, Pause, Volume2, MoreHorizontal, Send, Heart, ChevronLeft, ChevronRight, BarChart2 } from "lucide-react";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import useAuthStore from "@/store/authStore";
import StoryAnalyticsDashboard from "./StoryAnalyticsDashboard";

interface StoryViewerProps {
  stories: any[];
  onClose: () => void;
}

export default function StoryViewer({ stories, onClose }: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const { user } = useAuthStore() as any;

  const currentStory = stories[currentIndex];
  const isOwner = user?._id && currentStory?.user?._id && user._id === currentStory.user._id;

  // Record view in analytics
  useEffect(() => {
    if (currentStory) {
      axiosInstance.post(`/api/stories/${currentStory._id}/view`).catch(err => console.error(err));
    }
  }, [currentIndex, currentStory]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Go to next story or close if last
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(prevIndex => prevIndex + 1);
            return 0; // reset progress for next story
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 2; // Roughly 5 seconds per story
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPaused, currentIndex, stories.length, onClose]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
    } else {
      setProgress(0);
    }
  };

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#1a1a1a] flex items-center justify-center">
      <button onClick={onClose} className="absolute top-4 right-4 text-white z-50 p-2">
        <X size={28} />
      </button>

      <div 
        className="relative w-full h-full md:w-[400px] md:h-[90vh] md:rounded-lg overflow-hidden bg-black flex flex-col"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Progress Bars */}
        <div className="absolute top-0 left-0 right-0 p-3 z-10 flex gap-1">
          {stories.map((story, idx) => (
            <div key={story._id} className="h-[2px] flex-1 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-100 ease-linear" 
                style={{ 
                  width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%' 
                }}
              ></div>
            </div>
          ))}
        </div>

        {/* User Info Header */}
        <div className="absolute top-6 left-0 right-0 px-3 z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
               <img 
                 src={currentStory.user?.profilePic || `https://placehold.co/100x100?text=${currentStory.user?.username?.[0]}`} 
                 alt="Avatar" 
                 className="w-full h-full object-cover" 
               />
            </div>
            <span className="text-white font-semibold text-sm drop-shadow-md">{currentStory.user?.username}</span>
          </div>
          <div className="flex gap-3 text-white">
            <button onClick={(e) => { e.stopPropagation(); setIsPaused(!isPaused); }}>
              {isPaused ? <Play size={20} /> : <Pause size={20} />}
            </button>
            <button><Volume2 size={20} /></button>
            <button><MoreHorizontal size={20} /></button>
          </div>
        </div>

        {/* Navigation Overlays */}
        <div className="absolute inset-y-0 left-0 w-1/3 z-20 cursor-pointer" onClick={(e) => { e.stopPropagation(); handlePrev(); }}></div>
        <div className="absolute inset-y-0 right-0 w-1/3 z-20 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleNext(); }}></div>

        {/* Image/Video Content */}
        <div className="flex-1 flex items-center justify-center bg-zinc-900">
          <img 
            src={currentStory.media?.[0]?.url || `https://placehold.co/600x1000?text=No+Image`} 
            alt="Story" 
            className="w-full h-full object-contain" 
          />
        </div>

        {/* Footer Reply Box (hide if it's user's own story, show analytics instead) */}
        {!isOwner ? (
          <div className="absolute bottom-0 left-0 right-0 p-4 z-30 flex items-center gap-4">
            <div className="flex-1 border border-white/50 rounded-full px-4 py-2.5 flex items-center bg-black/20 backdrop-blur-sm text-white">
               <input 
                 type="text" 
                 placeholder={`Reply to ${currentStory.user?.username}...`} 
                 className="bg-transparent outline-none w-full text-sm placeholder:text-white/70"
                 onFocus={() => setIsPaused(true)}
                 onBlur={() => setIsPaused(false)}
               />
            </div>
            <button className="text-white"><Heart size={28} /></button>
            <button className="text-white"><Send size={28} /></button>
          </div>
        ) : (
          <div className="absolute bottom-0 left-0 right-0 p-4 z-30 flex items-center justify-center">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsPaused(true); setShowAnalytics(true); }}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-2.5 rounded-full text-white font-medium transition-colors"
            >
              <BarChart2 size={20} />
              View Analytics
            </button>
          </div>
        )}
      </div>

      {showAnalytics && (
        <StoryAnalyticsDashboard 
          storyId={currentStory._id} 
          onClose={() => { setShowAnalytics(false); setIsPaused(false); }} 
        />
      )}
    </div>
  );
}
