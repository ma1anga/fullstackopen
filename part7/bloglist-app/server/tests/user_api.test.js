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
  await User.insertMany(helper.initialUsers)
})

describe('user get API', () => {
  test('users are returned as JSON', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all users are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialUsers.length)
  })
})

describe('user post API', () => {
  test('a valid user can be added', async () => {
    await api
      .post('/api/users')
      .send(helper.additionalUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, helper.initialUsers.length + 1)

    const addedUser = usersAtEnd.find((user) => user.username === 'janedoe')
    assert.strictEqual(addedUser.name, helper.additionalUser.name)
    assert(
      bcrypt.compare(addedUser.passwordHash, helper.additionalUser.password),
    )
  })

  test('invalid username, returns 400 and proper error message', async () => {
    const invalidUser = {
      ...helper.additionalUser,
      username: 'u',
    }

    const response = await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(response.body.error.includes('User validation failed: username'))
  })

  test('invalid password, returns 400 and proper error message', async () => {
    const invalidUser = {
      ...helper.additionalUser,
      password: 'p',
    }

    const response = await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(
      response.body.error.includes(
        'password field is required and should have 3 or more symbols',
      ),
    )
  })

  test('adding same user twice, returns 400 and proper error message', async () => {
    await api
      .post('/api/users')
      .send(helper.additionalUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    // trying to add a user with the same username
    const response = await api
      .post('/api/users')
      .send(helper.additionalUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(response.body.error.includes('expected \"username\" to be unique'))

    // verify that only one user was added
    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, helper.initialUsers.length + 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})
