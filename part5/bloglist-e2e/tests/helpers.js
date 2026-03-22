const { expect } = require('@playwright/test')

const loginWith = async (page, username, password) => {
  await page.getByRole('button', { name: 'login' }).click()
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'create new blog' }).click()
  await page.getByLabel('title:').fill(title)
  await page.getByLabel('author:').fill(author)
  await page.getByLabel('url:').fill(url)
  await page.getByRole('button', { name: 'create' }).click()

  await page.locator('.blog').getByText(title).waitFor()
}

const likeBlog = async (page, title, times) => {
  const blogContainer = page.locator('.blog').getByText(title)

  await blogContainer.getByRole('button', { name: 'view' }).click()

  const detailsContainer = page.locator('.blog-details')
  
  await expect(detailsContainer).toBeVisible()

  for (let i = 1; i <= times; i++) {
    await detailsContainer.getByRole('button', { name: 'like' }).click()
    await expect(detailsContainer).toContainText(`likes: ${i}`)
  }

  await blogContainer.getByRole('button', { name: 'hide' }).click()

  await blogContainer.getByRole('button', { name: 'view' }).waitFor()
}

export { loginWith, createBlog, likeBlog }