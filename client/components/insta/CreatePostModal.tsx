"use client";

import { useState, useRef } from "react";
import { X, Image as ImageIcon, CalendarClock, Loader2, MapPin } from "lucide-react";
import { useCreateModal } from "@/lib/createmodelcontext";
import axiosInstance from "@/lib/axios";

// Fallback upload mock if imgbb service isn't ready
const mockUploadImage = async (file: File) => {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve(URL.createObjectURL(file));
    }, 1000);
  });
};

export default function CreatePostModal() {
  const { close } = useCreateModal();
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [dragActive, setDragActive] = useState(false);
  
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selectedFile: File) => {
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleShare = async () => {
    if (!file) {
      setError("Please select an image to share.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Upload Image
      const imageUrl = await mockUploadImage(file); // Replace with real service if available

      // 2. Prepare payload
      const payload: any = {
        image: imageUrl, // Backend uses image
        caption,
        location,
      };

      if (scheduledAt) {
        payload.scheduledAt = new Date(scheduledAt).toISOString();
      }

      // 3. Hit API
      const res = await axiosInstance.post("/api/posts", payload);
      
      alert(scheduledAt ? "Post scheduled successfully!" : "Post published successfully!");
      close();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <button onClick={close} disabled={loading} className="absolute right-4 top-4 text-white hover:opacity-70 disabled:opacity-50">
        <X size={28} />
      </button>

      <div className="flex flex-col h-[85vh] w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-xl dark:bg-[#262626]">
        {/* Header */}
        <div className="flex items-center justify-between border-b dark:border-gray-800 p-3 bg-white dark:bg-[#262626]">
          <div className="w-16"></div>
          <h1 className="font-semibold text-center flex-1">Create new post</h1>
          <button 
            onClick={handleShare}
            disabled={loading || !file}
            className="text-blue-500 font-semibold text-sm w-16 hover:text-blue-700 disabled:opacity-50 flex justify-end"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : scheduledAt ? "Schedule" : "Share"}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-white dark:bg-[#262626]">
          
          {/* Left: Upload/Preview Area */}
          <div className="w-full md:w-1/2 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black/20">
            {!previewUrl ? (
              <div 
                className={`w-full h-full p-8 flex flex-col items-center justify-center ${dragActive ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => { e.preventDefault(); setDragActive(false); if(e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
              >
                <ImageIcon size={64} className="text-gray-400 mb-4" strokeWidth={1} />
                <h2 className="text-xl font-light mb-4 text-center">Drag photos here</h2>
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                <button onClick={() => fileInputRef.current?.click()} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg px-4 py-1.5 transition-colors">
                  Select from computer
                </button>
              </div>
            ) : (
              <div className="relative w-full h-full group">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                <button 
                  onClick={() => { setFile(null); setPreviewUrl(null); }}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
          
          {/* Right: Details Area */}
          <div className="w-full md:w-1/2 flex flex-col p-4 overflow-y-auto">
            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                <img src="https://placehold.co/100x100" alt="Profile" />
              </div>
              <span className="font-semibold text-sm">You</span>
            </div>

            <textarea
              placeholder="Write a caption..."
              className="w-full bg-transparent outline-none resize-none mb-4 min-h-[120px]"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />

            <div className="border-t border-gray-200 dark:border-gray-800 py-3">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <MapPin size={18} />
                <input 
                  type="text" 
                  placeholder="Add location" 
                  className="bg-transparent outline-none flex-1 text-sm text-black dark:text-white"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 py-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-medium">
                  <CalendarClock size={18} className="text-gray-500" />
                  <span>Schedule Post (Optional)</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                Max 2 scheduled posts allowed per user based on subscription. Will be auto-published by our background worker.
              </p>
              <input 
                type="datetime-local" 
                className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2 text-sm focus:outline-none focus:border-blue-500"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                min={new Date(Date.now() + 5 * 60000).toISOString().slice(0, 16)} // min 5 mins from now
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
