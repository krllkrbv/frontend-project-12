import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Асинхронный запрос за каналами и сообщениями
export const fetchChatData = createAsyncThunk(
  'channel/fetchChatData',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;
    const response = await fetch('/api/chat/data', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch chat data');
    }
    const data = await response.json();
    return data; // { channels: [], messages: {} }
  }
);

const channelSlice = createSlice({
  name: 'channel',
  initialState: {
    channels: [],
    messages: {},
    status: 'idle',
    error: null
  },
  reducers: {
    // дополнительные редюсеры, если необходимо
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChatData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.channels = action.payload.channels;
        state.messages = action.payload.messages;
      })
      .addCase(fetchChatData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default channelSlice.reducer;