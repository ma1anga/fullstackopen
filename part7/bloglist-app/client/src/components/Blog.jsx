import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Link,
  Stack,
  Typography,
} from '@mui/material'
import useBlogStore from '../stores/blogStore'
import { useNotificationStore } from '../stores/notificationStore'
import { useUserStore } from '../stores/userStore'

const Blog = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { user } = useUserStore()
  const { blogs, likeBlog, deleteBlog } = useBlogStore()
  const { setNotification, clearNotification } = useNotificationStore()

  const blog = blogs.find((b) => b.id === id)

  if (!blog) {
    return (
      <Typography sx={{ mt: 3 }}>Blog with id '{id}' was not found</Typography>
    )
  }

  const handleBlogDelete = async () => {
    const deletionConfirmed = confirm(
      `Remove blog "${blog.title}" by ${blog.author}?`,
    )

    if (deletionConfirmed) {
      await deleteBlog(blog)

      setNotification(`A blog "${blog.title}" was deleted`, 'success')
      navigate('/')
      setTimeout(() => clearNotification(), 3000)
    }
  }

  const canDelete = user && user.username === blog.user.username

  return (
    <Box className="blog" sx={{ maxWidth: 640, mx: 'auto', mt: 4, px: 2 }}>
      <Card elevation={3}>
        <CardContent className="blog-details">
          <Typography variant="h4" component="h2">
            {blog.title}
          </Typography>

          <Typography variant="subtitle1" color="text.secondary">
            Added by {blog.author}
          </Typography>

          <Link href={blog.url} underline="hover">
            {blog.url}
          </Link>

          <Typography>likes: {blog.likes}</Typography>
        </CardContent>

        <CardActions>
          {user && (
            <Button
              variant="contained"
              size="small"
              onClick={async () => await likeBlog(blog)}
            >
              like
            </Button>
          )}
          {canDelete && (
            <Button color="error" onClick={handleBlogDelete}>
              remove
            </Button>
          )}
        </CardActions>
      </Card>
    </Box>
  )
}

export default Blog
