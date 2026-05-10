import { useParams } from 'react-router-dom'
import { useUserListStore } from '../stores/userListStore'
import { Typography } from '@mui/material'

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
    <>
      <h1>{user.name}</h1>
      <h2>Added blogs</h2>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </>
  )
}

export default User
