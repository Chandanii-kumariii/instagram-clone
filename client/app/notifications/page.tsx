import Sidebar from "@/components/insta/Sidebar";
import Image from "next/image";

// Dummy notifications for testing
const DUMMY_NOTIFICATIONS = [
  {
    id: 1,
    type: "like",
    user: { username: "jane_smith", avatar: "https://i.pravatar.cc/150?u=2" },
    text: "liked your photo.",
    time: "2h",
    postImage: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=150&h=150&fit=crop",
  },
  {
    id: 2,
    type: "comment",
    user: { username: "tech_guru", avatar: "https://i.pravatar.cc/150?u=5" },
    text: 'commented: "Looks amazing! 🔥"',
    time: "4h",
    postImage: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=150&h=150&fit=crop",
  },
  {
    id: 3,
    type: "follow",
    user: { username: "alex_jones", avatar: "https://i.pravatar.cc/150?u=3" },
    text: "started following you.",
    time: "1d",
  },
  {
    id: 4,
    type: "like",
    user: { username: "nature_lover", avatar: "https://i.pravatar.cc/150?u=12" },
    text: "liked your comment.",
    time: "2d",
    postImage: "https://images.unsplash.com/photo-1682687982501-1e58f813f228?w=150&h=150&fit=crop",
  }
];

export default function NotificationsPage() {
  return (
    <div className="flex bg-zinc-50 dark:bg-black min-h-screen font-sans">
      <Sidebar />
      <div className="flex-1 md:ml-[72px] xl:ml-[244px] flex flex-col p-8 items-center">
        <div className="w-full max-w-2xl">
          <h1 className="text-2xl font-bold mb-6">Notifications</h1>
          
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
            <h2 className="text-base font-semibold mb-4 text-gray-900 dark:text-white">This Week</h2>
            
            <div className="space-y-4">
              {DUMMY_NOTIFICATIONS.map((notif) => (
                <div key={notif.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 cursor-pointer">
                      <img src={notif.user.avatar} alt={notif.user.username} className="object-cover w-full h-full" />
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold text-gray-900 dark:text-white cursor-pointer hover:underline">
                        {notif.user.username}
                      </span>{" "}
                      <span className="text-gray-600 dark:text-gray-300">
                        {notif.text}
                      </span>{" "}
                      <span className="text-gray-400 text-xs">{notif.time}</span>
                    </div>
                  </div>
                  
                  {notif.type === "follow" ? (
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm px-4 py-1.5 rounded-lg transition-colors">
                      Follow
                    </button>
                  ) : notif.postImage ? (
                    <div className="w-11 h-11 rounded shrink-0 overflow-hidden cursor-pointer">
                      <img src={notif.postImage} alt="post" className="w-full h-full object-cover" />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
            
            <h2 className="text-base font-semibold mb-4 mt-8 text-gray-900 dark:text-white">Earlier</h2>
            <div className="text-center text-gray-500 py-6">
              <p>No older notifications.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
