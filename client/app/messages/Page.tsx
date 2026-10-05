"use client";

import { useState } from "react";
import { Edit, Phone, Video, Info, Image as ImageIcon, Heart, MessageCircle } from "lucide-react";
import { mockConversations, currentUser } from "@/lib/mock-data";

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState<any>(null);
  const [message, setMessage] = useState("");

  return (
    <div className="flex h-screen bg-white dark:bg-black pt-[44px] md:pt-0 md:pl-[72px] xl:pl-[244px]">
      {/* Left Sidebar (Chats List) */}
      <div className="w-full md:w-[350px] border-r dark:border-gray-800 flex flex-col h-full">
        <div className="h-[75px] flex items-center justify-between px-5 border-b dark:border-gray-800 shrink-0">
          <h1 className="font-bold text-xl">{currentUser?.fullName || "Current User"}</h1>
          <button><Edit size={24} /></button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {mockConversations.map((chat: any) => (
            <div 
              key={chat.id} 
              onClick={() => setActiveChat(chat)}
              className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors ${activeChat?.id === chat.id ? 'bg-gray-50 dark:bg-gray-900' : ''}`}
            >
              <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 bg-gray-200">
                <img src={`https://placehold.co/100x100?text=${chat.name?.charAt(0) || 'U'}`} alt={chat.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="font-semibold text-sm truncate">{chat.name}</p>
                <p className={`text-sm truncate ${chat.unread > 0 ? 'font-bold text-black dark:text-white' : 'text-gray-500'}`}>
                  {chat.unread > 0 ? 'Sent you a message' : 'Active yesterday'}
                </p>
              </div>
              {chat.unread > 0 && (
                <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Content (Chat Box) */}
      <div className="hidden md:flex flex-1 flex-col h-full bg-white dark:bg-black">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="h-[75px] flex items-center justify-between px-6 border-b dark:border-gray-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                   <img src={`https://placehold.co/100x100?text=${activeChat.name?.charAt(0) || 'U'}`} alt={activeChat.name} className="w-full h-full object-cover" />
                </div>
                <span className="font-semibold">{activeChat.name}</span>
              </div>
              <div className="flex items-center gap-5">
                <button><Phone size={24} /></button>
                <button><Video size={24} /></button>
                <button><Info size={24} /></button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
               {/* Dummy message */}
               <div className="flex items-start gap-2 max-w-[70%]">
                 <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-200 shrink-0 mt-1">
                   <img src={`https://placehold.co/100x100?text=${activeChat.name?.charAt(0) || 'U'}`} alt="" className="w-full h-full object-cover" />
                 </div>
                 <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2 text-sm">
                   Hey there! How are you doing today?
                 </div>
               </div>
            </div>

            {/* Chat Input */}
            <div className="p-5">
              <div className="border dark:border-gray-700 rounded-full flex items-center px-4 py-2 min-h-[44px]">
                <button className="p-1"><Heart size={24} /></button>
                <input 
                  type="text" 
                  placeholder="Message..." 
                  className="flex-1 bg-transparent outline-none px-3 text-sm"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button className="p-1 font-semibold text-blue-500 hover:text-black dark:hover:text-white">
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
             <div className="w-24 h-24 border-2 border-black dark:border-white rounded-full flex items-center justify-center mb-4">
               <MessageCircle size={48} strokeWidth={1} />
             </div>
             <h2 className="text-xl font-semibold mb-2">Your Messages</h2>
             <p className="text-gray-500 mb-6">Send private photos and messages to a friend or group.</p>
             <button className="bg-blue-500 text-white font-semibold rounded-lg px-4 py-1.5 hover:bg-blue-600 transition-colors">
               Send message
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
