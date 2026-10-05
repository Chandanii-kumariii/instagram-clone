import { create } from 'zustand';
import { mockConversations } from '@/lib/mock-data';

export const useChatStore = create((set, get) => ({
  chats: mockConversations,
  activeChat: null,
  
  setActiveChat: (chat) => set({ activeChat: chat }),
  
  sendMessage: (chatId, text) => {
    // In a real app, this would emit via Socket.io
    console.log(`Sending message to chat ${chatId}: ${text}`);
    
    // Optimistic update for UI
    set((state) => {
      // Example logic to update the chat list or active chat
      return state;
    });
  },

  markAsRead: (chatId) => set((state) => ({
    chats: state.chats.map(chat => 
      chat.id === chatId ? { ...chat, unread: 0 } : chat
    )
  }))
}));

export default useChatStore;
