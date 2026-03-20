import { beforeEach, describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from '../../src/components/Blog'


describe('<Blog />', () => {
  const handleLikeMock = vi.fn()

  const blog = {
    title: 'Test blog',
    author: 'Author Test',
    url: 'https://test-blog.article',
    likes: 5
  }

  beforeEach(() => {
    render(<Blog blog={blog} onLike={handleLikeMock} />)
  })

  test('renders minimal content by default', () => {
    const blogDiv = screen.getByText(blog.title, { exact: false })

    expect(blogDiv).toHaveTextContent(blog.title)
    expect(blogDiv).toHaveTextContent(blog.author)

    expect(blogDiv).not.toHaveTextContent(blog.likes)
    expect(blogDiv).not.toHaveTextContent(blog.url)
  })

  test('renders full details if "view" button clicked', async () => {
    const blogDiv = screen.getByText(blog.title, { exact: false })

    const user = userEvent.setup()
    const button = screen.getByText('view')

    await user.click(button)

    expect(blogDiv).toHaveTextContent(blog.title)
    expect(blogDiv).toHaveTextContent(blog.author)

    expect(blogDiv).toHaveTextContent(blog.likes)
    expect(blogDiv).toHaveTextContent(blog.url)
  })

  test('if like pressed two times, handler called two times', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')

    await user.click(viewButton)

    const likeButton = screen.getByText('like')

    await user.click(likeButton)
    await user.click(likeButton)

    expect(handleLikeMock.mock.calls).toHaveLength(2)
  })
})



