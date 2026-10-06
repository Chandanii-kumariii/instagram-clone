"use client";

import { useState } from "react";
import MobileHeader from "@/components/insta/MobileHeader";
import Sidebar from "@/components/insta/Sidebar";
import Stories from "@/components/insta/Stories";
import PostCard from "@/components/insta/Postcard";
import RightSidebar from "@/components/insta/RightSidebar";
import StoryViewer from "@/components/insta/StoryViewer";



export default function Home() {
  const [activeStories, setActiveStories] = useState<any[] | null>(null);

  return (
    <div className="flex bg-zinc-50 dark:bg-black min-h-screen font-sans">
      <Sidebar />
      <div className="flex-1 md:ml-[72px] xl:ml-[244px] flex justify-center">
        <main className="w-full max-w-[630px] pt-14 md:pt-10 px-4">
          <MobileHeader />
          <Stories onStoryClick={(userId, stories) => setActiveStories(stories)} />
          <div className="mt-6 flex flex-col gap-6">
            <PostCard post={{}} />
            <PostCard post={{}} />
          </div>
        </main>
      </div>
      <RightSidebar />
      {activeStories && (
        <StoryViewer 
          stories={activeStories} 
          onClose={() => setActiveStories(null)} 
        />
      )}
    </div>
  );
}
