"use client";

import { Home, Search, PlusSquare, Film, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCreateModal } from "@/lib/createmodelcontext";
import { currentUser } from "@/lib/mock-data";

export default function MobileNav() {
  const pathname = usePathname();
  const { open } = useCreateModal();
  
  const isActive = (href: string) => pathname === href;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t dark:border-gray-800 z-50 h-[50px] flex items-center justify-around px-2">
      <Link href="/" className="p-2">
        <Home size={24} strokeWidth={isActive("/") ? 2.5 : 1.5} />
      </Link>
      
      <Link href="/search" className="p-2">
        <Search size={24} strokeWidth={isActive("/search") ? 2.5 : 1.5} />
      </Link>
      
      <button onClick={open} className="p-2">
        <PlusSquare size={24} strokeWidth={1.5} />
      </button>
      
      <Link href="/reels" className="p-2">
        <Film size={24} strokeWidth={isActive("/reels") ? 2.5 : 1.5} />
      </Link>
      
      <Link href="/profile" className="p-2">
         <div className={`w-6 h-6 rounded-full overflow-hidden ${isActive("/profile") ? 'ring-1 ring-black dark:ring-white p-[1px]' : ''}`}>
            <img src={currentUser?.profilePic || "https://placehold.co/100x100"} alt="Profile" className="w-full h-full rounded-full object-cover" />
         </div>
      </Link>
    </nav>
  );
}
