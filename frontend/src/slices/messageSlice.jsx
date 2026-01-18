import { createSlice } from '@reduxjs/toolkit';

const messageSlice = createSlice({
  name: 'messages',
  initialState: {
    // В основном, сообщения хранятся в channelSlice, но можно сюда добавить
  },
  reducers: {
    // Можно добавить редюсеры для отправки сообщений или удаления
    addMessage: (state, action) => {
      const { channelId, message } = action.payload;
      if (!state.messages[channelId]) {
        state.messages[channelId] = [];
      }
      state.messages[channelId].push(message);
    },
  }
});

export const { addMessage } = messageSlice.actions;
export default messageSlice.reducer;