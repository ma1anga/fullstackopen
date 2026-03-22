import { useState, useEffect, useRef } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import CreateBlog from './components/CreateBlog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const createBlogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const handleLogin = async credentials => {
    try {
      const user = await loginService.login(credentials)

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)

      setNotificationMessage(`A user "${user.name}" was succesfully logged in`)
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
    setTimeout(() => setNotificationMessage(null), 3000)
  }

  const handleCreateBlog = async blog => {
    try {
      createBlogFormRef.current.toggleVisibility()
      const createdBlog = await blogService.create(blog)

      setBlogs(blogs.concat(createdBlog))
      setNotificationMessage(`A new blog "${createdBlog.title}" added`)
      setTimeout(() => setNotificationMessage(null), 3000)
    } catch (error) {
      setErrorMessage(`Failed to add a new blog: ${error.response.data.error}`)
      setTimeout(() => setErrorMessage(null), 3000)
    }
  }

  const handleBlogLike = async blogId => {
    const blog = blogs.find(b => b.id === blogId)
    const newLikesCount = blog.likes + 1

    const updatedBlog = {
      ...blog,
      likes: newLikesCount,
      user: blog.user.id
    }

    const savedBlog = await blogService.update(updatedBlog.id, updatedBlog)

    setBlogs(
      blogs.map(blog => blog.id === savedBlog.id ? savedBlog : blog)
    )
  }

  const handleBlogDelete = async blogId => {
    const blogToDelete = blogs.find(b => b.id === blogId)
    const deletionConfirmed = confirm(`Remove blog "${blogToDelete.title}" by ${blogToDelete.author}?`)

    if (deletionConfirmed) {
      await blogService.remove(blogToDelete.id)

      setBlogs(blogs.filter(b => b.id !== blogToDelete.id))
      setNotificationMessage(`A blog "${blogToDelete.title}" was deleted`)
      setTimeout(() => setNotificationMessage(null), 3000)
    }
  }

  const getLoginForm = () => (<LoginForm handleLogin={handleLogin} />)
  const getBlogs = () => (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      <Togglable buttonLabel='create new blog' ref={createBlogFormRef}>
        <CreateBlog handleCreate={handleCreateBlog} />
      </Togglable>
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <motion.div key={blog.id} layout>
          <Blog blog={blog} onLike={handleBlogLike} onDelete={handleBlogDelete} deleteVisible={blog.user.username === user.username} />
        </motion.div>
      )}
    </div>
  )

  return (
    <>
      <Notification
        message={errorMessage ? errorMessage : notificationMessage}
        isError={errorMessage ? true : false}
      />
      {!user && getLoginForm()}
      {user && getBlogs()}
    </>
  )
}

export default App