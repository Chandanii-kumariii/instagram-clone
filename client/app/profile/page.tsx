import Sidebar from "@/components/insta/Sidebar";
import ProfileView from "@/components/insta/ProfileView";

export default function ProfilePage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-black min-h-screen font-sans">
      <Sidebar />
      <div className="flex-1 md:ml-[72px] xl:ml-[244px] flex justify-center">
        <ProfileView />
      </div>
    </div>
  );
}
