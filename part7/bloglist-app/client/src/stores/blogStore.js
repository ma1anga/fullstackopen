import { create } from 'zustand'
import blogService from '../services/blogs'

const useBlogStore = create((set) => ({
  blogs: [],

  initializeBlogs: async () => {
    const blogs = await blogService.getAll()

    set({ blogs })
  },

  createBlog: async (newBlog) => {
    const createdBlog = await blogService.create(newBlog)

    set((state) => ({
      blogs: state.blogs.concat(createdBlog),
    }))
  },

  likeBlog: async (blog) => {
    const updatedBlog = await blogService.update(blog.id, {
      ...blog,
      likes: blog.likes + 1,
    })

    set((state) => ({
      blogs: state.blogs.map((b) =>
        b.id !== updatedBlog.id ? b : updatedBlog,
      ),
    }))
  },

  addComment: async (blog, comment) => {
    const savedComment = await blogService.addComment(blog.id, comment)

    set((state) => ({
      blogs: state.blogs.map((b) =>
        b.id !== blog.id
          ? b
          : { ...b, comments: [...b.comments, savedComment] },
      ),
    }))
  },

  deleteBlog: async (blog) => {
    await blogService.remove(blog.id)

    set((state) => ({
      blogs: state.blogs.filter((b) => b.id !== blog.id),
    }))
  },
}))

export default useBlogStore
