import { Alert } from '@mui/material'

const Notification = ({ message, isError }) => {
  if (message === null) {
    return null
  }

  return (
    <Alert
      style={{ marginTop: 10, marginBottom: 10 }}
      severity={isError ? 'error' : 'success'}
    >
      {message}
    </Alert>
  )
}

export default Notification
