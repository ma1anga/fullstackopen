import { Link as RouterLink, useParams } from 'react-router-dom'
import { useUserListStore } from '../stores/userListStore'
import {
  Box,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'
import ArticleIcon from '@mui/icons-material/Article'

const User = () => {
  const { id } = useParams()
  const { users } = useUserListStore()

  const user = users.find((user) => user.id === id)

  if (!user) {
    return (
      <Typography sx={{ mt: 3 }}>User with id '{id}' was not found</Typography>
    )
  }

  return (
    <Box sx={{ maxWidth: 640, mx: 'auto', mt: 4, px: 2 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h4" component="h1">
            {user.name}
          </Typography>

          <Typography color="text.secondary">@{user.username}</Typography>

          <Typography>{user.blogs.length} blogs added</Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h5" component="h2">
            Added blogs
          </Typography>

          {user.blogs.length > 0 ? (
            <List>
              {user.blogs.map((blog) => (
                <ListItem key={blog.id}>
                  <ListItemIcon>
                    <ArticleIcon />
                  </ListItemIcon>
                  <ListItemText primary={blog.title} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              No blogs added yet.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default User
