import { createSlice } from "@reduxjs/toolkit"
import anedotesService from '../services/anecdotes'

const anecdotesSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    updateAnecdote: (state, action) => {
      const newAnecdote = action.payload

      return state.map(a => {
        if (a.id === newAnecdote.id) {
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

const { setAnecdotes, createAnecdote, updateAnecdote } = anecdotesSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anedotesService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const appendAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anedotesService.createNew(content)
    dispatch(createAnecdote(newAnecdote))
  }
}

export const addVoteFor = id => {
  return async (dispatch, getState) => {
    const anecdotes = getState().anecdotes
    const anecdote = anecdotes.find(a => a.id === id)

    const updatedAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    const savedAnecdote = await anedotesService.update(updatedAnecdote)
    dispatch(updateAnecdote(savedAnecdote))
  }
}

export default anecdotesSlice.reducer
