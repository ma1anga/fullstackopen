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
          <label>
          username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
          password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </>
  )
}

export default LoginForm