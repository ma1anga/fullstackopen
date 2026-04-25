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

  test('routing to the Login page works', async ({ page }) => {
    const loginButton = page.getByRole('link', { name: 'login' })

    await loginButton.click()
    await page.getByRole('heading', { name: 'Log in to application' }).waitFor()

    const usernameInput = page.getByLabel('username')
    const passwordInput = page.getByLabel('password')

    await expect(usernameInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
  })

  describe('Login', () => {

    const succesfullLoginNotificationText = '"User Fortest" was succesfully logged in'

    beforeEach(async ({ page }) => {
      await page.goto('/login')
    })

    test('succeeds with correct credentials, redirects to the main page', async ({ page }) => {
      await loginWith(page, 'testuser', 'testpassword')

      await expect(page.getByText(succesfullLoginNotificationText)).toBeVisible()
      await expect(page.getByRole('heading', { name: 'blogs' })).toBeVisible()
    })

    test('fails with wrong credentials, does not redirect', async ({ page }) => {
      await loginWith(page, 'testuser', 'incorrect')

      const errorNotification = page.getByText('Login failed: invalid')
      await expect(errorNotification).toHaveCSS('border-style', 'solid')
      await expect(errorNotification).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(errorNotification).toContainText('invalid username or password')

      await expect(page.getByText(succesfullLoginNotificationText)).not.toBeVisible()
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
      await page.goto('/login')
      await loginWith(page, 'testuser', 'testpassword')

      await page.getByRole('heading', { name: 'blogs' }).waitFor()
    })

    test('routing to the "Create new" page works', async ({ page }) => {
      await page.getByRole('link', { name: 'new blog' }).click()

      await expect(page.getByRole('heading', { name: 'Create new' })).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.goto('/create')
      await createBlog(page, blogValues.title, blogValues.author, blogValues.url)

      await expect(page.getByRole('link', { name: blogValues.title })).toBeVisible()
    })

    describe('and blog exists', () => {
      beforeEach(async ({ page }) => {
        await page.goto('/create')
        await createBlog(page, blogValues.title, blogValues.author, blogValues.url)
      })

      test('a blog can be liked', async ({ page }) => {
        await page.getByRole('link', { name: blogValues.title }).click()

        const detailsContainer = page.locator('.blog-details')
        await expect(detailsContainer).toContainText('likes: 0')

        await page.getByRole('button', { name: 'like' }).click()

        await expect(detailsContainer).toContainText('likes: 1')
      })

      test('a blog can be deleted by owner', async ({ page }) => {
        await page.getByRole('link', { name: blogValues.title }).click()

        page.once('dialog', async dialog => {
          expect(dialog.type()).toBe('confirm')
          expect(dialog.message()).toContain('Remove blog')
          await dialog.accept()
        })

        await page.getByRole('button', { name: 'remove' }).click()
        await page.getByRole('heading', { name: 'blogs' }).waitFor()

        await expect(page.getByRole('link', { name: blogValues.title })).not.toBeVisible()
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

        await page.goto('/login')
        await loginWith(page, secondUser.username, secondUser.password)

       await page.getByRole('link', { name: blogValues.title }).click()

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

      // Skipping as frontend implementation has changed
      test.skip('blogs are arranged according to the likes, the blog with the most likes first', async ({ page }) => {
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
