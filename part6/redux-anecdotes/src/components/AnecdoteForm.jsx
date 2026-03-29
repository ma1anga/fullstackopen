import { useDispatch } from "react-redux"
import { createAnecdote } from "../reducers/anecdoteReducer"
import { setNotification, clearNotification } from "../reducers/notificationReducer"
import anecdotesService from '../services/anecdotes'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const submitAnecdote = async event => {
    event.preventDefault()

    const content = event.target.anecdoteText.value
    event.target.anecdoteText.value = ''

    const createdAnecdote = await anecdotesService.createNew(content)
    dispatch(createAnecdote(createdAnecdote))

    dispatch(setNotification(`You created '${content}'`))
    setTimeout(() => dispatch(clearNotification()), 5000)
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={submitAnecdote}>
        <div>
          <input name='anecdoteText' />
        </div>
        <button>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm