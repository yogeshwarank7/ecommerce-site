import { createSlice } from '@reduxjs/toolkit'

const getInitialCartState = () => {
  const savedCart = localStorage.getItem('yoki_cart_items')
  return {
    items: savedCart ? JSON.parse(savedCart) : [],
  }
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: getInitialCartState(),
  reducers: {
    addToCart(state, action) {
      const exists = state.items.find(i => i.id === action.payload.id)
      if (!exists) {
        state.items.push({ ...action.payload, quantity: 1 })
        localStorage.setItem('yoki_cart_items', JSON.stringify(state.items))
      }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter(i => i.id !== action.payload)
      localStorage.setItem('yoki_cart_items', JSON.stringify(state.items))
    },
    increaseQuantity(state, action) {
      const item = state.items.find(i => i.id === action.payload)
      if (item) {
        item.quantity += 1
        localStorage.setItem('yoki_cart_items', JSON.stringify(state.items))
      }
    },
    decreaseQuantity(state, action) {
      const item = state.items.find(i => i.id === action.payload)
      if (item && item.quantity > 1) {
        item.quantity -= 1
        localStorage.setItem('yoki_cart_items', JSON.stringify(state.items))
      }
    },
    clearCart(state) {
      state.items = []
      localStorage.setItem('yoki_cart_items', JSON.stringify([]))
    },
  },
})

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
