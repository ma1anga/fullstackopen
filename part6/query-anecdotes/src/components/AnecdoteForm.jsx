import { useMutation, useQueryClient } from "@tanstack/react-query"
import NotificationContext from "../NotificationContext"
import anecdotesService from "../services/anecdotes"
import { useContext } from "react"


const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const { messageDispatch } = useContext(NotificationContext)

  const newAnecdoteMutation = useMutation({
    mutationFn: anecdotesService.createNew,
    onSuccess: anecdote => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      messageDispatch({ type: 'SET_MESSAGE', payload: `You created '${anecdote.content}'` })
      setTimeout(() => messageDispatch({ type: 'CLEAR_MESSAGE' }), 5000)
    },
    onError: error => {
      messageDispatch({ type: 'SET_MESSAGE', payload: error.message })
      setTimeout(() => messageDispatch({ type: 'CLEAR_MESSAGE' }), 5000)
    }
  })

  const onCreate = event => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    
    newAnecdoteMutation.mutate(content)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
