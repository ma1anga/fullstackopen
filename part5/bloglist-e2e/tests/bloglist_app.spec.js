const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helpers')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'User Fortest',
        username: 'testuser',
        password: 'testpassword'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const loginTitle = page.getByRole('heading', { name: 'Log in to application' })

    const usernameInput = page.getByLabel('username')
    const passwordInput = page.getByLabel('password')

    await expect(loginTitle).toBeVisible()
    await expect(usernameInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'testpassword')

      await expect(page.getByText('User Fortest logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'incorrect')

      const errorNotification = page.getByText('Login failed: invalid')
      await expect(errorNotification).toHaveCSS('border-style', 'solid')
      await expect(errorNotification).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(errorNotification).toContainText('invalid username or password')

      await expect(page.getByText('User Fortest logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'testuser', 'testpassword')
    })

    test('a new blog can be created', async ({ page }) => {
      const blogValues = {
        title: 'Test blog',
        author: 'Author Test',
        url: 'https://test-blog.article'
      }

      await createBlog(page, blogValues.title, blogValues.author, blogValues.url)

      await expect(page.getByText(blogValues.title)).toBeVisible()
    })
  })
})