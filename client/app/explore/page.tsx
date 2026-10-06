import Sidebar from "@/components/insta/Sidebar";
import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";

// Dummy posts for explore grid
const DUMMY_EXPLORE_POSTS = [
  { id: 1, image: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=500&h=500&fit=crop", likes: "12K", comments: "342" },
  { id: 2, image: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=500&h=500&fit=crop", likes: "8K", comments: "156" },
  { id: 3, image: "https://images.unsplash.com/photo-1682687982501-1e58f813f228?w=500&h=500&fit=crop", likes: "24K", comments: "892" },
  { id: 4, image: "https://images.unsplash.com/photo-1682695796497-31a44224d6d6?w=500&h=500&fit=crop", likes: "5K", comments: "45" },
  { id: 5, image: "https://images.unsplash.com/photo-1682687220199-d0124f48f95b?w=500&h=500&fit=crop", likes: "18K", comments: "423" },
  { id: 6, image: "https://images.unsplash.com/photo-1682687982141-0143020ed57a?w=500&h=500&fit=crop", likes: "32K", comments: "1.2K" },
  { id: 7, image: "https://images.unsplash.com/photo-1682695797221-8164ff1fafc9?w=500&h=500&fit=crop", likes: "15K", comments: "289" },
  { id: 8, image: "https://images.unsplash.com/photo-1682687218147-9806132dc697?w=500&h=500&fit=crop", likes: "9K", comments: "112" },
  { id: 9, image: "https://images.unsplash.com/photo-1682695794816-7b9da18ed470?w=500&h=500&fit=crop", likes: "45K", comments: "3.4K" },
];

export default function ExplorePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-black min-h-screen font-sans">
      <Sidebar />
      <div className="flex-1 md:ml-[72px] xl:ml-[244px] flex flex-col p-8 items-center">
        <div className="w-full max-w-4xl">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Explore</h1>
          
          <div className="grid grid-cols-3 gap-1 md:gap-4">
            {DUMMY_EXPLORE_POSTS.map((post) => (
              <div key={post.id} className="relative aspect-square group cursor-pointer overflow-hidden rounded-md">
                <img 
                  src={post.image} 
                  alt="Explore post" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Overlay that appears on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                  <div className="flex items-center text-white font-bold gap-2">
                    <Heart className="w-6 h-6 fill-white" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center text-white font-bold gap-2">
                    <MessageCircle className="w-6 h-6 fill-white" />
                    <span>{post.comments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
