import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.jsx';
import channelReducer from '.channelSlice.jsx';
import messageReducer from '.messageSlice.jsx';

const store = configureStore({
  reducer: {
    auth: authReducer,
    channel: channelReducer,
    messages: messageReducer
  }
});

export default store;