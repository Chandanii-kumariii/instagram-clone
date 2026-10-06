"use client";

import React, { useState, useRef } from "react";
import { X, Image as ImageIcon, Loader2 } from "lucide-react";
import { uploadImage } from "@/lib/imgbb.service";
import axiosInstance from "@/lib/axios";

interface CreateStoryModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateStoryModal({ onClose, onSuccess }: CreateStoryModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState("Public");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError("");
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select an image to post to your story.");
      return;
    }

    try {
      setIsUploading(true);
      setError("");

      // 1. Upload to imgbb
      const uploadedMedia = await uploadImage(file);

      // 2. Save story in backend
      const storyData = {
        media: [
          {
            url: uploadedMedia.url,
            mediaType: "image",
          },
        ],
        privacy,
      };

      await axiosInstance.post("/api/stories", storyData);

      setIsUploading(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to create story. Please try again.");
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-xl overflow-hidden shadow-xl border border-gray-200 dark:border-zinc-800 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-zinc-800">
          <h2 className="font-semibold text-base">Create Story</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {!previewUrl ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-[9/16] max-h-[400px] bg-gray-50 dark:bg-zinc-800/50 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <ImageIcon size={48} className="text-gray-400 mb-3" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Click to select a photo</p>
            </div>
          ) : (
            <div className="w-full aspect-[9/16] max-h-[400px] relative rounded-lg overflow-hidden bg-black flex items-center justify-center">
              <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
              <button 
                onClick={() => { setFile(null); setPreviewUrl(null); }}
                className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 backdrop-blur-sm transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
          />

          {/* Privacy Select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Who can see this?</label>
            <select 
              value={privacy} 
              onChange={(e) => setPrivacy(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Public">Public (Everyone)</option>
              <option value="Followers Only">Followers Only</option>
              <option value="Close Friends">Close Friends</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-zinc-800 flex justify-end">
          <button 
            onClick={handleSubmit} 
            disabled={isUploading || !file}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isUploading ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Sharing...
              </>
            ) : (
              "Add to Story"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
