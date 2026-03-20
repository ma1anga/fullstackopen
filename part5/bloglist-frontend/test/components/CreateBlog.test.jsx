import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlog from '../../src/components/CreateBlog'

describe('<CreateBlog />', () => {
  test('calls create handle with proper details', async () => {
    const createHandleMock = vi.fn()

    const blogValues = {
      title: 'Test blog',
      author: 'Author Test',
      url: 'https://test-blog.article'
    }

    render(<CreateBlog handleCreate={createHandleMock} />)

    const user = userEvent.setup()

    const titleInput = screen.getByLabelText('title:')
    const authorInput = screen.getByLabelText('author:')
    const urlInput = screen.getByLabelText('url:')

    const createButton = screen.getByText('create')

    await user.type(titleInput, blogValues.title)
    await user.type(authorInput, blogValues.author)
    await user.type(urlInput, blogValues.url)

    await user.click(createButton)

    expect(createHandleMock.mock.calls).toHaveLength(1)

    expect(createHandleMock.mock.calls[0][0].title).toBe(blogValues.title)
    expect(createHandleMock.mock.calls[0][0].author).toBe(blogValues.author)
    expect(createHandleMock.mock.calls[0][0].url).toBe(blogValues.url)
  })
})