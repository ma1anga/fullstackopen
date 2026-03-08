const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

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

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

test('blogs are returned as JSON', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('unique identifier is returned as "id" field', async () => {
  const newBlog = new Blog({
    title: 'Building REST APIs with Node.js',
    author: 'Robert C. Martin',
    url: 'https://example.com/building-rest-apis-nodejs',
    likes: 5,
  })

  const newBlogSaved = await newBlog.save()

  const response = await api.get('/api/blogs')
  const newBlogReturnedFromApi = response.body.find(blog => blog.title === newBlogSaved.title)

  assert.deepStrictEqual(newBlogReturnedFromApi.id, newBlogSaved._id.toString())
})

test('a blog can be added', async () => {
  const newBlog = {
    title: 'Building REST APIs with Node.js',
    author: 'Robert C. Martin',
    url: 'https://example.com/building-rest-apis-nodejs',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await Blog.find({})
  assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1)

  const titles = blogsAtEnd.map(blog => blog.title)
  assert(titles.includes('Building REST APIs with Node.js'))
})

test('if no likes in request, defaults to 0', async () => {
  const newBlog = {
    title: 'Building REST APIs with Node.js',
    author: 'Robert C. Martin',
    url: 'https://example.com/building-rest-apis-nodejs'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await Blog.find({})
  assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1)

  const savedBlog = blogsAtEnd.find(blog => blog.title === newBlog.title)
  assert.strictEqual(savedBlog.likes, 0)
})

test('if no title, returns 400 Bad Request', async () => {
  const invalidBlog = {
    author: 'Robert C. Martin',
    url: 'https://example.com/building-rest-apis-nodejs'
  }

  await api
    .post('/api/blogs')
    .send(invalidBlog)
    .expect(400)
})

test('if no url, returns 400 Bad Request', async () => {
  const invalidBlog = {
    title: 'Building REST APIs with Node.js',
    author: 'Robert C. Martin'
  }

  await api
    .post('/api/blogs')
    .send(invalidBlog)
    .expect(400)
})

after(async () => {
  await mongoose.connection.close()
})
