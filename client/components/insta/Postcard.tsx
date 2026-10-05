"use client";

import { MoreHorizontal, Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import { useState } from "react";

export default function PostCard({ post, onOpenModal }: { post: any, onOpenModal?: () => void }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="w-full max-w-[470px] mx-auto mb-6 border-b dark:border-gray-800 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between py-2 mb-1">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
            <img src={post?.user?.avatar || "https://placehold.co/100x100"} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <span className="font-semibold text-sm hover:text-gray-500">{post?.user?.username || "username"}</span>
          <span className="text-gray-500 text-sm">• 1d</span>
        </div>
        <button className="hover:text-gray-500"><MoreHorizontal size={20} /></button>
      </div>

      {/* Image */}
      <div 
        className="rounded-sm overflow-hidden bg-gray-100 dark:bg-gray-900 border dark:border-gray-800 cursor-pointer"
        onClick={onOpenModal}
      >
        <img 
          src={post?.imageUrl || "https://placehold.co/600x600"} 
          alt="Post" 
          className="w-full h-auto object-cover max-h-[600px]"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-3 mb-2">
        <div className="flex items-center gap-4">
          <button 
            className={`hover:text-gray-500 transition-colors ${liked ? 'text-red-500' : ''}`}
            onClick={() => setLiked(!liked)}
          >
            <Heart size={24} fill={liked ? "currentColor" : "none"} />
          </button>
          <button className="hover:text-gray-500" onClick={onOpenModal}>
            <MessageCircle size={24} className="scale-x-[-1]" />
          </button>
          <button className="hover:text-gray-500"><Send size={24} /></button>
        </div>
        <button className="hover:text-gray-500"><Bookmark size={24} /></button>
      </div>

      {/* Likes */}
      <p className="font-semibold text-sm mb-1">{post?.likes || 0} likes</p>

      {/* Caption */}
      <p className="text-sm">
        <span className="font-semibold mr-2">{post?.user?.username || "username"}</span>
        {post?.caption || "This is a beautiful post!"}
      </p>

      {/* View Comments */}
      <button 
        className="text-gray-500 text-sm mt-1 hover:text-gray-400"
        onClick={onOpenModal}
      >
        View all {post?.comments || 0} comments
      </button>
      
      {/* Add comment */}
      <div className="flex items-center mt-2 border-b-0 pb-1">
        <input 
          type="text" 
          placeholder="Add a comment..." 
          className="w-full bg-transparent text-sm outline-none placeholder:text-gray-500"
        />
      </div>
    </div>
  );
}
