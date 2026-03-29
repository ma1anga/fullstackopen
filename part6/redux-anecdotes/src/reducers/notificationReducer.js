import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotification: (state, action) => action.payload,
    clearNotification: (state, action) => ''
  }
})

const { setNotification, clearNotification } = notificationSlice.actions

export const applyNotification = (content, timeSeconds) => {
  return async dispatch => {
    dispatch(setNotification(content))

    setTimeout(() => {
      dispatch(clearNotification())
    }, timeSeconds * 1000)
  }
}

export default notificationSlice.reducer