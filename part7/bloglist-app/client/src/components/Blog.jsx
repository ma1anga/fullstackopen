import { useParams } from 'react-router-dom'
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

const Blog = ({ blogs, user, onLike, onDelete }) => {
  const { id } = useParams()

  const blog = blogs.find((b) => b.id === id)

  if (!blog) {
    return (
      <Typography sx={{ mt: 3 }}>Blog with id '{id}' was not found</Typography>
    )
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
              onClick={() => onLike(blog.id)}
            >
              like
            </Button>
          )}
          {canDelete && (
            <Button color="error" onClick={() => onDelete(blog.id)}>
              remove
            </Button>
          )}
        </CardActions>
      </Card>
    </Box>
  )
}

export default Blog
