const Blog = require('../models/blog')

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

module.exports = {
  initialBlogs,
  additionalBlog,
  initialUsers,
  additionalUser,
  nonExistingId
}
