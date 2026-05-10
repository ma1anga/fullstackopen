const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash(helper.blogsUser.password, 10)
  const user = new User({
    username: helper.blogsUser.username,
    name: helper.blogsUser.name,
    passwordHash
  })

  await user.save()
})

describe('login API', () => {
  test('succeeds with valid credentials and returns token', async () => {
    const response = await api
      .post('/api/login')
      .send({
        username: helper.blogsUser.username,
        password: helper.blogsUser.password
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert(response.body.token)
    assert.strictEqual(response.body.username, helper.blogsUser.username)
    assert.strictEqual(response.body.name, helper.blogsUser.name)
  })

  test('fails with status code 401 if password is incorrect', async () => {
    const response = await api
      .post('/api/login')
      .send({
        username: helper.blogsUser.username,
        password: 'wrong-password'
      })
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'invalid username or password')
  })

  test('fails with status code 401 if username does not exist', async () => {
    const response = await api
      .post('/api/login')
      .send({
        username: 'missing-user',
        password: helper.blogsUser.password
      })
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'invalid username or password')
  })
})

after(async () => {
  await mongoose.connection.close()
})
