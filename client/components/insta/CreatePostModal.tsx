"use client";

import { useState } from "react";
import { X, Image as ImageIcon } from "lucide-react";
import { useCreateModal } from "@/lib/createmodelcontext";

export default function CreatePostModal() {
  const { close } = useCreateModal();
  const [caption, setCaption] = useState("");
  const [dragActive, setDragActive] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <button onClick={close} className="absolute right-4 top-4 text-white">
        <X size={28} />
      </button>

      <div className="flex flex-col h-[70vh] w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-xl dark:bg-[#262626]">
        {/* Header */}
        <div className="flex items-center justify-between border-b dark:border-gray-800 p-3">
          <div className="w-8"></div>
          <h1 className="font-semibold text-center flex-1">Create new post</h1>
          <button className="text-blue-500 font-semibold text-sm w-8 hover:text-black dark:hover:text-white">Share</button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-4 overflow-y-auto">
          {/* Upload Area */}
          <div 
            className={`flex-1 flex flex-col items-center justify-center rounded-lg border-2 border-dashed ${dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700'}`}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => { e.preventDefault(); setDragActive(false); }}
          >
            <ImageIcon size={64} className="text-gray-400 mb-4" strokeWidth={1} />
            <h2 className="text-xl font-light mb-4">Drag photos and videos here</h2>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg px-4 py-1.5 transition-colors">
              Select from computer
            </button>
          </div>
          
          {/* Caption */}
          <div className="mt-4">
            <textarea
              placeholder="Write a caption..."
              className="w-full bg-transparent outline-none resize-none"
              rows={4}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
