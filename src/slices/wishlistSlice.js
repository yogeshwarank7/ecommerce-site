import { createSlice } from '@reduxjs/toolkit'

const getInitialWishlistState = () => {
  const savedWishlist = localStorage.getItem('yoki_wishlist_items')
  return {
    items: savedWishlist ? JSON.parse(savedWishlist) : [],
  }
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: getInitialWishlistState(),
  reducers: {
    addWishlist(state, action) {
      const exists = state.items.find(i => i.id === action.payload.id)
      if (!exists) {
        state.items.push(action.payload)
        localStorage.setItem('yoki_wishlist_items', JSON.stringify(state.items))
      }
    },
    removeWishlist(state, action) {
      state.items = state.items.filter(i => i.id !== action.payload)
      localStorage.setItem('yoki_wishlist_items', JSON.stringify(state.items))
    },
  },
})

export const { addWishlist, removeWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
