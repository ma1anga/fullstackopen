import { Button, TextField } from '@mui/material'
import { useState } from 'react'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return (
    <>
      <h2>Log in to application</h2>
      <form onSubmit={(e) => {
        e.preventDefault()
        handleLogin({ username, password })
        setUsername('')
        setPassword('')
      }}>
        <div>
          <TextField
            label='username'
            type='text'
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            margin='dense'
            size='small'
          />
        </div>
        <div>
          <TextField
            label='password'
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            margin='dense'
            size='small'
          />
        </div>
        <Button variant='contained' size='small' type='submit'>login</Button>
      </form>
    </>
  )
}

export default LoginForm
