import { useEffect, useState } from 'react'
import anecdoteService from '../services/anecdotes'


export const useField = (type) => {
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
      value,
      onChange
    },
    reset
  ]
}

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    anecdoteService.getAll().then(data => setAnecdotes(data))
  }, [])

  const addAnecdote = (newAnecdote) => {
    anecdoteService.createNew(newAnecdote).then(created => {
      setAnecdotes([...anecdotes, created])
    })
  }

  const removeAnecdote = (anecdoteToRemove) => {
    anecdoteService.remove(anecdoteToRemove).then(removed => {
      const updatedList = anecdotes.filter(a => a.id !== removed.id)
      setAnecdotes(updatedList)
    })
  }

  return { anecdotes, addAnecdote, removeAnecdote }
}