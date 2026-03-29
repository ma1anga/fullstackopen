import { createSlice } from "@reduxjs/toolkit"

const getId = () => (100000 * Math.random()).toFixed(0)

const anecdotesSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteUpOf: (state, action) => {
      const anecdoteId = action.payload
      const anecdote = state.find(a => a.id === anecdoteId)

      const newAnecdote = {
        ...anecdote,
        votes: anecdote.votes + 1
      }

      return state.map(a => {
        if (a.id === anecdoteId) {
          return newAnecdote
        } else {
          return a
        }
      })
    },
    createAnecdote: (state, action) => {
      state.push(action.payload)
    },
    setAnecdotes: (state, action) => action.payload
  }
})

export const { createAnecdote, voteUpOf, setAnecdotes } = anecdotesSlice.actions
export default anecdotesSlice.reducer
