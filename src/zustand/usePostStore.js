import { create } from 'zustand'

const usePostStore = create((set) => ({
  posts: [],
  setPosts: (postsParams) => set({ posts: postsParams }),
  deletePost: (postId) => set((state) => ({ posts: state.posts.filter(post => post.id !== postId) })),
  updatePost: (updatedPost) => set((state) => ({
    posts: state.posts.map(post => post.id === updatedPost.id ? updatedPost : post),
})),
}))

export default usePostStore
