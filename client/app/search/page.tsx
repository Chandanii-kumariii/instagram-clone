"use client";

import Sidebar from "@/components/insta/Sidebar";
import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import Image from "next/image";

// Dummy users for testing
const DUMMY_USERS = [
  { id: 1, username: "john_doe", fullName: "John Doe", avatar: "https://i.pravatar.cc/150?u=1" },
  { id: 2, username: "jane_smith", fullName: "Jane Smith", avatar: "https://i.pravatar.cc/150?u=2" },
  { id: 3, username: "alex_jones", fullName: "Alex Jones", avatar: "https://i.pravatar.cc/150?u=3" },
  { id: 4, username: "chandani", fullName: "Chandani Kumari", avatar: "https://i.pravatar.cc/150?u=4" },
  { id: 5, username: "tech_guru", fullName: "Tech Guru", avatar: "https://i.pravatar.cc/150?u=5" },
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = DUMMY_USERS.filter((user) => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex bg-zinc-50 dark:bg-black min-h-screen font-sans">
      <Sidebar />
      <div className="flex-1 md:ml-[72px] xl:ml-[244px] flex flex-col p-8 items-center">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Search</h1>
          
          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-zinc-900 dark:border-zinc-700 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            {searchQuery && filteredUsers.length === 0 ? (
              <p className="text-gray-500 text-center">No users found.</p>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden">
                    <img src={user.avatar} alt={user.username} className="object-cover w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user.username}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {user.fullName}
                    </p>
                  </div>
                </div>
              ))
            )}
            
            {!searchQuery && (
              <div className="text-center text-gray-500 mt-10">
                <p>Search for friends, creators, or topics.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
