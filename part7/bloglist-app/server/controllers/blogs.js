const blogsRouter = require('express').Router()
const middleware = require('../utils/middleware')
const Blog = require('../models/blog')
const Comment = require('../models/comment')
const { request } = require('express')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
    .populate('comments', { content: 1 })

  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const user = request.user

  const blog = new Blog({
    ...request.body,
    user: user.id,
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response
    .status(201)
    .json(await savedBlog.populate('user', { username: 1, name: 1 }))
})

blogsRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).end()
    }

    if (blog.user.toString() === request.user._id.toString()) {
      await Comment.deleteMany({ blog: blog.id })
      await blog.deleteOne()

      response.status(204).end()
    } else {
      response
        .status(400)
        .json({ error: 'Only the blog creator can delete this blog' })
    }
  },
)

blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).end()
  }

  if (blog.user.toString() === request.user._id.toString()) {
    blog.title = title ?? blog.title
    blog.author = author ?? blog.author
    blog.url = url ?? blog.url
    blog.likes = likes ?? blog.likes

    const updatedBlog = await blog.save()

    await updatedBlog.populate('user', { username: 1, name: 1 })
    await updatedBlog.populate('comments', { content: 1 })

    response.json(updatedBlog)
  } else {
    response
      .status(400)
      .json({ error: 'Only the blog creator can edit this blog' })
  }
})

blogsRouter.post('/:id/comments', middleware.userExtractor, async (request, response) => {
  const { content } = request.body

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).end()
  }

  const comment = new Comment({
    content,
    blog: blog.id,
  })

  const savedComment = await comment.save()

  blog.comments = blog.comments.concat(savedComment._id)

  await blog.save()

  response.status(201).json(
    await savedComment.populate('blog', {
      title: 1,
      author: 1,
      url: 1,
      likes: 1,
    }),
  )
})

module.exports = blogsRouter
