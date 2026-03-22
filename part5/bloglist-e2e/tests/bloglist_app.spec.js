const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, likeBlog } = require('./helpers')

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
    const blogValues = {
      title: 'Test blog',
      author: 'Author Test',
      url: 'https://test-blog.article'
    }

    const secondBlogValues = {
      title: 'Playwright patterns',
      author: 'Second Author',
      url: 'https://another-test-blog.article'
    }

    const thirdBlogValues = {
      title: 'Async UI notes',
      author: 'Third Author',
      url: 'https://yet-another-test-blog.article'
    }

    beforeEach(async ({ page }) => {
      await loginWith(page, 'testuser', 'testpassword')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, blogValues.title, blogValues.author, blogValues.url)

      await expect(page.getByText(blogValues.title)).toBeVisible()
    })

    describe('and blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, blogValues.title, blogValues.author, blogValues.url)
      })

      test('a blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()

        const detailsContainer = page.locator('.blog-details')
        await expect(detailsContainer).toContainText('likes: 0')

        await page.getByRole('button', { name: 'like' }).click()

        await expect(detailsContainer).toContainText('likes: 1')
      })

      test('a blog can be deleted by owner', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()

        page.once('dialog', async dialog => {
          expect(dialog.type()).toBe('confirm')
          expect(dialog.message()).toContain('Remove blog')
          await dialog.accept()
        })

        await page.getByRole('button', { name: 'remove' }).click()

        await expect(page.getByText(blogValues.title)).not.toBeVisible()
      })

      test('another user cant delete blog', async ({ page, request }) => {
        const secondUser = {
          name: 'Second User',
          username: 'seconduser',
          password: 'secondpassword'
        }

        await request.post('/api/users', {
          data: {
            ...secondUser
          }
        })

        await page.getByRole('button', { name: 'logout' }).click()

        await loginWith(page, secondUser.username, secondUser.password)

        await page.getByRole('button', { name: 'view' }).click()

        const detailsContainer = page.locator('.blog-details')

        await expect(detailsContainer).toBeVisible()
        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })
    })

    describe('and several blogs exist', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, blogValues.title, blogValues.author, blogValues.url)
        await createBlog(page, secondBlogValues.title, secondBlogValues.author, secondBlogValues.url)
        await createBlog(page, thirdBlogValues.title, thirdBlogValues.author, thirdBlogValues.url)
      })

      test('blogs are arranged according to the likes, the blog with the most likes first', async ({ page }) => {
        await likeBlog(page, thirdBlogValues.title, 3)
        await likeBlog(page, blogValues.title, 2)
        await likeBlog(page, secondBlogValues.title, 1)

        const blogs = page.locator('.blog')
        await expect(blogs).toHaveCount(3)

        await expect(blogs.nth(0)).toContainText(thirdBlogValues.title)
        await expect(blogs.nth(1)).toContainText(blogValues.title)
        await expect(blogs.nth(2)).toContainText(secondBlogValues.title)
      })
    })
  })
})
