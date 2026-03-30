import { useContext } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import anecdotesService from './services/anecdotes'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import NotificationContext from './NotificationContext'

const App = () => {
  const queryClient = useQueryClient()
  const { messageDispatch } = useContext(NotificationContext)

  const updateAnecdoteMutation = useMutation({
    mutationFn: anecdotesService.update,
    onSuccess: anecdote => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      messageDispatch({ type: 'SET_MESSAGE', payload: `You voted '${anecdote.content}'` })
      setTimeout(() => messageDispatch({ type: 'CLEAR_MESSAGE' }), 5000)
    }
  })

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: anecdotesService.getAll,
    refetchOnWindowFocus: false,
    retry: 1
  })

  const handleVote = anecdote => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }

  if (result.isLoading) {
    return <p>Fetching anecdotes from the server...</p>
  }

  if (result.isError) {
    return <p>Anecdotes service is not available due to a problems with the server</p>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
