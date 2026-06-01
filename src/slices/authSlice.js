import { createSlice } from '@reduxjs/toolkit'

// A simple, beginner-friendly helper to initialize auth state from localStorage
const getInitialAuthState = () => {
  const isLoggedIn = localStorage.getItem('yoki_is_logged_in') === 'true'
  const defaultUser = {
    name: 'Yogesh',
    email: 'yogesh@gmail.com',
    phone: '+91 77087 48677',
    address: '123, Gandhi Road, Chennai, Tamil Nadu - 600001',
  }

  if (isLoggedIn) {
    // Retrieve custom saved user profile
    const savedUser = localStorage.getItem('yoki_user_profile')
    return {
      isLoggedIn: true,
      user: savedUser ? JSON.parse(savedUser) : defaultUser,
    }
  }

  return {
    isLoggedIn: false,
    user: defaultUser,
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialAuthState(),
  reducers: {
    login(state, action) {
      state.isLoggedIn = true
      if (action.payload) {
        state.user.name = action.payload.username
        state.user.email = `${action.payload.username.toLowerCase()}@gmail.com`
      }
      
      // Persist values in localStorage so refresh doesn't log the user out
      localStorage.setItem('yoki_is_logged_in', 'true')
      localStorage.setItem('yoki_user_profile', JSON.stringify(state.user))
    },
    logout(state) {
      state.isLoggedIn = false
      
      // Clean up storage details upon sign out
      localStorage.removeItem('yoki_is_logged_in')
      localStorage.removeItem('yoki_user_profile')
    },
    updateProfile(state, action) {
      state.user = { ...state.user, ...action.payload }
      
      // Sync update to storage
      localStorage.setItem('yoki_user_profile', JSON.stringify(state.user))
    },
  },
})

export const { login, logout, updateProfile } = authSlice.actions
export default authSlice.reducer
