import { create } from 'zustand';

export const usePostStore = create((set) => ({
  posts: [],
  isLoading: false,
  error: null,

  setPosts: (posts) => set({ posts }),
  
  addPost: (post) => set((state) => ({ 
    posts: [post, ...state.posts] 
  })),

  likePost: (postId) => set((state) => ({
    posts: state.posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1, isLiked: true } 
        : post
    )
  })),

  addComment: (postId, comment) => set((state) => ({
    posts: state.posts.map(post => 
      post.id === postId 
        ? { ...post, comments: post.comments + 1 } // Would add to comment array in real app
        : post
    )
  }))
}));

export default usePostStore;
