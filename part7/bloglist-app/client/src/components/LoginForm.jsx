import { Button, TextField } from '@mui/material'
import { useUserStore } from '../stores/userStore'
import { useNotificationStore } from '../stores/notificationStore'
import { useNavigate } from 'react-router-dom'
import { useField } from '../hooks'

const LoginForm = () => {
  const navigate = useNavigate()

  const [username, resetUsername] = useField('username', 'text')
  const [password, resetPassword] = useField('password', 'password')

  const { loginUser } = useUserStore()
  const { setNotification, clearNotification } = useNotificationStore()

  const handleLogin = async (credentials) => {
    try {
      await loginUser(credentials)

      setNotification(
        `A user "${credentials.username}" was successfully logged in`,
        'success',
      )
      navigate('/')
      setTimeout(() => clearNotification(), 3000)
    } catch (error) {
      resetUsername()
      resetPassword()

      setNotification(`Login failed: ${error.response.data.error}`, 'error')
      setTimeout(() => clearNotification(), 3000)
    }
  }

  return (
    <>
      <h2>Log in to application</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleLogin({ username: username.value, password: password.value })
        }}
      >
        <div>
          <TextField {...username} margin="dense" size="small" />
        </div>
        <div>
          <TextField {...password} margin="dense" size="small" />
        </div>
        <Button variant="contained" size="small" type="submit">
          login
        </Button>
      </form>
    </>
  )
}

export default LoginForm
