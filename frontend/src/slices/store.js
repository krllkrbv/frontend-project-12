import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice.jsx'
import channelReducer from './channelsSlice.js'
import messageReducer from './messagesSlice.js'
const store = configureStore({
  reducer: {
    auth: authReducer,
    channels: channelReducer,
    messages: messageReducer,
  },
})
export default store
