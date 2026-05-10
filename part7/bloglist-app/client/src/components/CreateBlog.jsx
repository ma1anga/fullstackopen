import { Button, TextField } from '@mui/material'
import useBlogStore from '../stores/blogStore'
import { useNotificationStore } from '../stores/notificationStore'
import { useNavigate } from 'react-router-dom'
import { useField } from '../hooks'

const CreateBlog = () => {
  const navigate = useNavigate()

  const [title] = useField('title', 'text')
  const [author] = useField('author', 'text')
  const [url] = useField('url', 'text')

  const { createBlog } = useBlogStore()
  const { setNotification, clearNotification } = useNotificationStore()

  const handleCreateBlog = async (blog) => {
    try {
      await createBlog(blog)

      setNotification(`A new blog "${blog.title}" added`, 'success')
      navigate('/')
      setTimeout(() => clearNotification(), 3000)
    } catch (error) {
      setNotification(
        `Failed to add a new blog: ${error.response.data.error}`,
        'error',
      )
      setTimeout(() => clearNotification(), 3000)
    }
  }

  return (
    <>
      <h2>Create new</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleCreateBlog({
            title: title.value,
            author: author.value,
            url: url.value,
          })
        }}
      >
        <div>
          <TextField {...title} margin="dense" size="small" />
        </div>
        <div>
          <TextField {...author} margin="dense" size="small" />
        </div>
        <div>
          <TextField {...url} margin="dense" size="small" />
        </div>
        <Button variant="contained" size="small" type="submit">
          create
        </Button>
      </form>
    </>
  )
}

export default CreateBlog
