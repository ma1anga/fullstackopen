const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

let loginToken

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  await helper.setupBlogs()
  loginToken = await getToken()
})

describe('get API', () => {
  test('blogs are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('unique identifier is returned as "id" field', async () => {
    const newBlog = new Blog(helper.additionalBlog)

    const newBlogSaved = await newBlog.save()

    const response = await api.get('/api/blogs')
    const newBlogReturnedFromApi = response.body.find(blog => blog.title === newBlogSaved.title)

    assert.deepStrictEqual(newBlogReturnedFromApi.id, newBlogSaved._id.toString())
  })
})

describe('post API', () => {
  test('a blog can be added with valid token', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loginToken}`)
      .send(helper.additionalBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    assert(titles.includes('Building REST APIs with Node.js'))
  })

  test('returns 401 Unauthorized if a token is not provided', async () => {
    await api
      .post('/api/blogs')
      .send(helper.additionalBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('if no likes in request, defaults to 0', async () => {
    const noLikesBlog = {
      title: 'Building REST APIs with Node.js',
      author: 'Robert C. Martin',
      url: 'https://example.com/building-rest-apis-nodejs'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loginToken}`)
      .send(noLikesBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const savedBlog = blogsAtEnd.find(blog => blog.title === noLikesBlog.title)
    assert.strictEqual(savedBlog.likes, 0)
  })

  test('if no title, returns 400 Bad Request', async () => {
    const invalidBlog = {
      author: 'Robert C. Martin',
      url: 'https://example.com/building-rest-apis-nodejs'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loginToken}`)
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
      .set('Authorization', `Bearer ${loginToken}`)
      .send(invalidBlog)
      .expect(400)
  })
})

describe('delete API', () => {
  test('succeeds with status code 204 if blog exists', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${loginToken}`)
      .expect(204)

    const blogsAtEnd = await Blog.find({})
    const ids = blogsAtEnd.map(b => b.id)

    assert(!ids.includes(blogToDelete.id))

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
  })

  test('succeeds with status code 404 if blog DOES NOT exists', async () => {
    const blogsAtStart = await Blog.find({})
    const nonExistingId = await helper.nonExistingId()

    await api
      .delete(`/api/blogs/${nonExistingId}`)
      .set('Authorization', `Bearer ${loginToken}`)
      .expect(404)

    const blogsAtEnd = await Blog.find({})

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })

  test('fails with 400 if incorrect id', async () => {
    await api
      .delete(`/api/blogs/invalid`)
      .set('Authorization', `Bearer ${loginToken}`)
      .expect(400)
  })
})

describe('put API', () => {
  test('updates only title and likes fields', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToUpdate = blogsAtStart[0]
    const updatedFields = {
      likes: 555,
      title: "New Title"
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${loginToken}`)
      .send(updatedFields)
      .expect(200)

    const updatedBlog = await Blog.findById(blogToUpdate.id)

    assert.strictEqual(updatedBlog.title, updatedFields.title)
    assert.strictEqual(updatedBlog.likes, updatedFields.likes)
    assert.strictEqual(updatedBlog.author, blogToUpdate.author)
    assert.strictEqual(updatedBlog.url, blogToUpdate.url)
  })

  test('fails with 404 if not such blog', async () => {
    const nonExistingId = await helper.nonExistingId()

    await api
      .put(`/api/blogs/${nonExistingId}`)
      .set('Authorization', `Bearer ${loginToken}`)
      .send({})
      .expect(404)
  })

  test('fails with 400 if incorrect ID', async () => {
    await api
      .put('/api/blogs/incorrect')
      .set('Authorization', `Bearer ${loginToken}`)
      .send({})
      .expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})

const getToken = async () => {
  const loginResponse = await api
    .post('/api/login')
    .send({
      username: helper.blogsUser.username,
      password: helper.blogsUser.password
    })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  return loginResponse.body.token
}
