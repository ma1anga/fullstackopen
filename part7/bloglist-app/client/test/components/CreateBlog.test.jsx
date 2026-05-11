import { beforeEach, describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import CreateBlog from '../../src/components/CreateBlog'
import useBlogStore from '../../src/stores/blogStore'

const createHandleMock = vi.fn()

describe('<CreateBlog />', () => {
  beforeEach(() => {
    createHandleMock.mockClear()
    useBlogStore.setState({ createBlog: createHandleMock })
  })

  test('calls create handle with proper details', async () => {
    const blogValues = {
      title: 'Test blog',
      author: 'Author Test',
      url: 'https://test-blog.article',
    }

    render(<CreateBlog />, { wrapper: MemoryRouter })

    const user = userEvent.setup()

    const titleInput = screen.getByLabelText('title')
    const authorInput = screen.getByLabelText('author')
    const urlInput = screen.getByLabelText('url')

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
