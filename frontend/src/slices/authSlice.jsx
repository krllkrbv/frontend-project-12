import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api'
export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/me')
      console.log('Server response for /auth/me:', response.data)
      return response.data
    }
    catch (error) {
      console.error('Error fetching user:', error)
      return rejectWithValue(error.message)
    }
  },
)
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token'),
    user: (() => {
      try {
        const storedUsername = localStorage.getItem('username')
        return storedUsername ? { username: storedUsername } : null
      }
      catch {
        return null
      }
    })(),
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload
      localStorage.setItem('token', action.payload)
    },
    setUser: (state, action) => {
      state.user = action.payload
      if (action.payload?.username) {
        localStorage.setItem('username', action.payload.username)
      }
    },
    logout: (state) => {
      state.token = null
      state.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('username')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        const fetchedUsername = action.payload?.username || action.payload?.name || action.payload?.login
        if (fetchedUsername) {
          state.user = { username: fetchedUsername }
          localStorage.setItem('username', fetchedUsername)
        }
        else {
          state.user = action.payload
        }
      })
  },
})
export const { setToken, setUser, logout } = authSlice.actions
export default authSlice.reducer
