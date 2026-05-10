import { useState } from 'react'

export const useField = (label, type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return [
    {
      type,
      label,
      value,
      onChange,
    },
    reset,
  ]
}
