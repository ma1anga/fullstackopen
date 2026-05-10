import { useEffect } from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import Blogs from './components/Blogs'
import Users from './components/Users'
import User from './components/User'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import CreateBlog from './components/CreateBlog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import { AppBar, Button, Toolbar, Typography } from '@mui/material'
import FallbackError from './components/FallbackError'
import NotFoundError from './components/NotFoundError'
import { useNotificationStore } from './stores/notificationStore'
import useBlogStore from './stores/blogStore'
import { useUserStore } from './stores/userStore'
import { useUserListStore } from './stores/userListStore'

const App = () => {
  const navigate = useNavigate()

  const { setNotification, clearNotification } = useNotificationStore()
  const { initializeBlogs } = useBlogStore()
  const { initializeUsers } = useUserListStore()
  const { user, logoutUser } = useUserStore()

  useEffect(() => {
    initializeBlogs()
    initializeUsers()
  }, [initializeBlogs, initializeUsers])

  useEffect(() => {
    if (user) {
      blogService.setToken(user.token)
    }
  }, [user])

  const handleLogout = async () => {
    await logoutUser()

    setNotification(
      `A user "${user.name}" was succesfully logged out`,
      'success',
    )
    navigate('/')
    setTimeout(() => clearNotification(), 3000)
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
          <Button color="inherit" component={Link} to="/users">
            users
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

      <Notification />

      <ErrorBoundary fallback={<FallbackError />}>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<Blogs />} />
          <Route path="/create" element={<CreateBlog />} />
          <Route path="/blogs/:id" element={<Blog />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="*" element={<NotFoundError />} />
        </Routes>
      </ErrorBoundary>
    </>
  )
}

export default App
