import { useDispatch, useSelector } from "react-redux"
import { addVoteFor } from "../reducers/anecdoteReducer"
import { applyNotification } from "../reducers/notificationReducer"

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    if (filter == null || filter.trim() === '') {
      return anecdotes
    }

    return anecdotes.filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))
  })

  const vote = ({ content, id }) => {
    dispatch(addVoteFor(id))

    dispatch(applyNotification(`You voted '${content}'`, 5))
  }

  return (
    <div>
      {[...anecdotes].sort((a, b) => b.votes - a.votes).map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList