const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Refactoring Node Services',
    author: 'Martin Fowler',
    url: 'https://martinfowler.com/articles/refactoring-node-services',
    likes: 12,
  },
  {
    title: 'Testing Express APIs with Supertest',
    author: 'Kent C. Dodds',
    url: 'https://kentcdodds.com/blog/testing-express-apis-with-supertest',
    likes: 8,
  },
]

const additionalBlog = {
  title: 'Building REST APIs with Node.js',
  author: 'Robert C. Martin',
  url: 'https://example.com/building-rest-apis-nodejs',
  likes: 5,
}

const blogsUser = {
  username: 'blogsuser',
  name: 'Blog User',
  password: 'blog-password'
}

const blogsUserSecond = {
  username: 'blogssecond',
  name: 'Blog Second',
  password: 'second-password'
}

const initialUsers = [
  {
    username: 'root',
    name: 'Superuser',
    password: 'sekret1'
  },
  {
    username: 'johndoe',
    name: 'John Doe',
    password: 'sekret2'
  }
]

const additionalUser = {
  username: 'janedoe',
  name: 'Jane Doe',
  password: 'secret123'
}

const nonExistingId = async () => {
  const blog = new Blog(additionalBlog)
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const setupBlogs = async () => {
  const testUser = await createTestUser();

  const blogDocs = await Blog.insertMany(
    initialBlogs.map(blog => ({
      ...blog,
      user: testUser._id
    }))
  )

  testUser.blogs = blogDocs.map(blog => blog._id)
  await testUser.save()
}

const createTestUser = async () => {
  const passwordHash = await bcrypt.hash(blogsUser.password, 10)

  const user = new User({
    username: blogsUser.username,
    name: blogsUser.name,
    passwordHash
  })

  return await user.save()
}

module.exports = {
  initialBlogs,
  additionalBlog,
  blogsUser,
  blogsUserSecond,
  initialUsers,
  additionalUser,
  nonExistingId,
  setupBlogs
}
