import { useDispatch } from "react-redux"
import { appendAnecdote } from "../reducers/anecdoteReducer"
import { applyNotification } from "../reducers/notificationReducer"

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const submitAnecdote = async event => {
    event.preventDefault()

    const content = event.target.anecdoteText.value
    event.target.anecdoteText.value = ''

    dispatch(appendAnecdote(content))
    dispatch(applyNotification(`You created '${content}'`, 5))
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