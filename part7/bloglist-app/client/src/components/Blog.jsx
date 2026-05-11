import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import useBlogStore from '../stores/blogStore'
import { useNotificationStore } from '../stores/notificationStore'
import { useUserStore } from '../stores/userStore'
import { useField } from '../hooks'

const Blog = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { user } = useUserStore()
  const { blogs, likeBlog, addComment, deleteBlog } = useBlogStore()
  const { setNotification, clearNotification } = useNotificationStore()

  const [comment, resetComment] = useField('comment', 'text')

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

  const handleAddComment = async () => {
    try {
      await addComment(blog, { content: comment.value })
      resetComment()

      setNotification('Successfully added comment', 'success')
      setTimeout(() => clearNotification(), 3000)
    } catch (error) {
      setNotification(
        `Failed to add a comment: ${error.response.data.error}`,
        'error',
      )
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

        <CardContent>
          <Typography variant="h5" component="h3">
            Comments
          </Typography>

          {user && (
            <Stack direction="row" spacing={1}>
              <TextField {...comment} size="small" />
              <Button
                variant="contained"
                size="small"
                onClick={handleAddComment}
              >
                add comment
              </Button>
            </Stack>
          )}

          {blog.comments.length > 0 ? (
            <List>
              {blog.comments.map((comment) => (
                <ListItem key={comment.id}>
                  <ListItemIcon>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary={comment.content} />
                </ListItem>
              ))}
            </List>
          ) : (
            'No comments yet, be the first one!'
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default Blog
