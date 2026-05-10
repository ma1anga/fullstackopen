import { useState, useEffect } from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import Blogs from './components/Blogs'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import CreateBlog from './components/CreateBlog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import { AppBar, Button, Toolbar, Typography } from '@mui/material'
import FallbackError from './components/FallbackError'
import NotFoundError from './components/NotFoundError'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)

      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)

      setNotificationMessage(`A user "${user.name}" was succesfully logged in`)
      navigate('/')
      setTimeout(() => setNotificationMessage(null), 3000)
    } catch (error) {
      setErrorMessage(`Login failed: ${error.response.data.error}`)
      setTimeout(() => setErrorMessage(null), 3000)
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedNoteappUser')

    setNotificationMessage(`A user "${user.name}" was succesfully logged out`)
    navigate('/')
    setTimeout(() => setNotificationMessage(null), 3000)
  }

  const handleCreateBlog = async (blog) => {
    try {
      const createdBlog = await blogService.create(blog)

      setBlogs(blogs.concat(createdBlog))
      setNotificationMessage(`A new blog "${createdBlog.title}" added`)
      navigate('/')
      setTimeout(() => setNotificationMessage(null), 3000)
    } catch (error) {
      setErrorMessage(`Failed to add a new blog: ${error.response.data.error}`)
      setTimeout(() => setErrorMessage(null), 3000)
    }
  }

  const handleBlogLike = async (blogId) => {
    const blog = blogs.find((b) => b.id === blogId)
    const newLikesCount = blog.likes + 1

    const updatedBlog = {
      ...blog,
      likes: newLikesCount,
      user: blog.user.id,
    }

    const savedBlog = await blogService.update(updatedBlog.id, updatedBlog)

    setBlogs(blogs.map((blog) => (blog.id === savedBlog.id ? savedBlog : blog)))
  }

  const handleBlogDelete = async (blogId) => {
    const blogToDelete = blogs.find((b) => b.id === blogId)
    const deletionConfirmed = confirm(
      `Remove blog "${blogToDelete.title}" by ${blogToDelete.author}?`,
    )

    if (deletionConfirmed) {
      await blogService.remove(blogToDelete.id)

      setBlogs(blogs.filter((b) => b.id !== blogToDelete.id))
      setNotificationMessage(`A blog "${blogToDelete.title}" was deleted`)
      navigate('/')
      setTimeout(() => setNotificationMessage(null), 3000)
    }
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Blog App
          </Typography>
          <Button color="inherit" component={Link} to="/">
            blogs
          </Button>
          {user && (
            <Button color="inherit" component={Link} to="/create">
              new blog
            </Button>
          )}
          {user ? (
            <Button color="inherit" onClick={handleLogout}>
              logout
            </Button>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Notification
        message={errorMessage ? errorMessage : notificationMessage}
        isError={errorMessage ? true : false}
      />

      <ErrorBoundary fallback={<FallbackError />}>
        <Routes>
          <Route
            path="/login"
            element={<LoginForm handleLogin={handleLogin} />}
          />
          <Route path="/" element={<Blogs blogs={blogs} />} />
          <Route
            path="/create"
            element={<CreateBlog handleCreate={handleCreateBlog} />}
          />
          <Route
            path="/blogs/:id"
            element={
              <Blog
                blogs={blogs}
                user={user}
                onLike={handleBlogLike}
                onDelete={handleBlogDelete}
              />
            }
          />
          <Route path="*" element={<NotFoundError />} />
        </Routes>
      </ErrorBoundary>
    </>
  )
}

export default App
