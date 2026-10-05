"use client";

import { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, X } from "lucide-react";

export default function PostModal({ post, onClose }: { post?: any, onClose: () => void }) {
  const [comment, setComment] = useState("");

  if (!post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <button onClick={onClose} className="absolute right-4 top-4 text-white">
        <X size={28} />
      </button>

      <div className="flex h-[90vh] max-h-[800px] w-full max-w-5xl overflow-hidden rounded-md bg-white shadow-xl dark:bg-black">
        {/* Left: Image */}
        <div className="flex w-full items-center justify-center bg-black md:w-3/5">
          <img
            src={post.imageUrl || "https://placehold.co/600x800"}
            alt="Post content"
            className="max-h-full max-w-full object-contain"
          />
        </div>

        {/* Right: Comments & Info */}
        <div className="flex w-full flex-col border-l dark:border-gray-800 md:w-2/5">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-200">
                <img src={post.user?.avatar || "https://placehold.co/100x100"} alt="User" className="h-full w-full object-cover" />
              </div>
              <span className="font-semibold text-sm">{post.user?.username || "username"}</span>
            </div>
            <button><MoreHorizontal size={20} /></button>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex gap-3">
               <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-gray-200">
                <img src={post.user?.avatar || "https://placehold.co/100x100"} alt="User" className="h-full w-full object-cover" />
              </div>
              <p className="text-sm">
                <span className="font-semibold mr-2">{post.user?.username || "username"}</span>
                {post.caption || "This is a beautiful post!"}
              </p>
            </div>
            {/* Dummy Comment */}
             <div className="flex gap-3">
               <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-gray-200">
                <img src="https://placehold.co/100x100" alt="User" className="h-full w-full object-cover" />
              </div>
              <p className="text-sm">
                <span className="font-semibold mr-2">jane_doe</span>
                Love this! 🔥
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t p-4 dark:border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-4">
                <button className="hover:text-gray-500"><Heart size={24} /></button>
                <button className="hover:text-gray-500"><MessageCircle size={24} /></button>
                <button className="hover:text-gray-500"><Send size={24} /></button>
              </div>
              <button className="hover:text-gray-500"><Bookmark size={24} /></button>
            </div>
            <p className="font-semibold text-sm mb-1">{post.likes || 124} likes</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wide">2 hours ago</p>
          </div>

          {/* Add Comment */}
          <div className="border-t p-4 dark:border-gray-800 flex items-center">
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 bg-transparent text-sm outline-none"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button 
              className={`text-sm font-semibold ${comment ? 'text-blue-500' : 'text-blue-200'} `}
              disabled={!comment}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
