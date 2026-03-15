import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import CreateBlog from './components/CreateBlog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

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
      const createdBlog = await blogService.create(blog)

      setBlogs(blogs.concat(createdBlog))
      setNotificationMessage(`A new blog "${createdBlog.title}" added`)
      setTimeout(() => setNotificationMessage(null), 3000)
    } catch (error) {
      setErrorMessage(`Failed to add a new blog: ${error.response.data.error}`)
      setTimeout(() => setErrorMessage(null), 3000)
    }
  }

  const getLoginForm = () => (<LoginForm handleLogin={handleLogin} />)
  const getBlogs = () => (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      <CreateBlog handleCreate={handleCreateBlog} />
      {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
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