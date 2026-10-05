import Sidebar from "@/components/insta/Sidebar";

export default function ExplorePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-black min-h-screen font-sans">
      <Sidebar />
      <div className="flex-1 md:ml-[72px] xl:ml-[244px] flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Explore</h1>
        <p className="text-gray-500">This page is under construction.</p>
      </div>
    </div>
  );
}
