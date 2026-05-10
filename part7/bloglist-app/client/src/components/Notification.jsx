import { Alert } from '@mui/material'
import { useNotificationStore } from '../stores/notificationStore'

const Notification = () => {
  const { message, severity } = useNotificationStore()

  if (message === null) {
    return null
  }

  return (
    <Alert style={{ marginTop: 10, marginBottom: 10 }} severity={severity}>
      {message}
    </Alert>
  )
}

export default Notification
