import { beforeEach, describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from '../../src/components/Blog'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')

  return {
    ...actual,
    useParams: () => ({ id: '123' })
  }
})

describe('<Blog />', () => {
  const handleLikeMock = vi.fn()

  const ownerUser = {
    username: 'usera'
  }
  const anotherUser = {
    username: 'userb'
  }
  const blogs = [
    {
      id: '123',
      title: 'Test blog',
      author: 'Author Test',
      url: 'https://test-blog.article',
      likes: 5,
      user: ownerUser
    },
    {
      id: '234',
      title: 'Second blog',
      author: 'Author 2nd',
      url: 'https://second-blog.com',
      likes: 2
    }
  ]
  const blog = blogs[0]

  beforeEach(() => {
    render(<Blog blogs={blogs} onLike={handleLikeMock} />)
  })


  test('blog information is displayed for unauthenticated user', () => {
    const blogDiv = screen.getByText(blog.title, { exact: false }).parentElement

    expect(blogDiv).toHaveTextContent(blog.title)
    expect(blogDiv).toHaveTextContent(blog.author)

    expect(blogDiv).toHaveTextContent(blog.likes)
    expect(blogDiv).toHaveTextContent(blog.url)
  })

  test('buttons are not displayed for unauthenticated user', () => {
    const likeButton = screen.queryByRole('button', { name: 'like' })
    const removeButton = screen.queryByRole('button', { name: 'remove' })

    expect(likeButton).not.toBeInTheDocument()
    expect(removeButton).not.toBeInTheDocument()
  })

  test('authenticated user, but not an owner, sees only "like" button', async () => {
    render(<Blog blogs={blogs} user={anotherUser} onLike={handleLikeMock} />)

    const likeButton = screen.queryByRole('button', { name: 'like' })
    const removeButton = screen.queryByRole('button', { name: 'remove' })

    expect(likeButton).toBeInTheDocument()
    expect(removeButton).not.toBeInTheDocument()
  })

  test('authenticated user, who is an owner, sees both "like" and "remove" buttons', async () => {
    render(<Blog blogs={blogs} user={ownerUser} onLike={handleLikeMock} />)

    const likeButton = screen.queryByRole('button', { name: 'like' })
    const removeButton = screen.queryByRole('button', { name: 'remove' })

    expect(likeButton).toBeInTheDocument()
    expect(removeButton).toBeInTheDocument()
  })

  test('if like pressed two times, handler called two times', async () => {
    render(<Blog blogs={blogs} user={anotherUser} onLike={handleLikeMock} />)

    const user = userEvent.setup()
    const likeButton = screen.getByText('like')

    await user.click(likeButton)
    await user.click(likeButton)

    expect(handleLikeMock.mock.calls).toHaveLength(2)
  })
})
