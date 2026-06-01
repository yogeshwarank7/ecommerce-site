import { createSlice } from '@reduxjs/toolkit'

const getInitialOrdersState = () => {
  const savedOrders = localStorage.getItem('yoki_orders_list')
  return {
    list: savedOrders ? JSON.parse(savedOrders) : [],
  }
}

const orderSlice = createSlice({
  name: 'orders',
  initialState: getInitialOrdersState(),
  reducers: {
    placeOrder(state, action) {
      state.list.push({
        id: action.payload.id || 'ORD' + Date.now(),
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        items: action.payload.items,
        total: action.payload.total,
        trackingStatus: 'placed',
        paymentMethod: action.payload.paymentMethod || 'Cash on Delivery',
        paymentDetails: action.payload.paymentDetails || {},
        shippingAddress: action.payload.shippingAddress || {},
      })
      localStorage.setItem('yoki_orders_list', JSON.stringify(state.list))
    },
    trackingStatus(state, action) {
      const order = state.list.find(o => o.id === action.payload.id)
      if (order) {
        order.trackingStatus = action.payload.status
        localStorage.setItem('yoki_orders_list', JSON.stringify(state.list))
      }
    },
  },
})

export const { placeOrder, trackingStatus } = orderSlice.actions
export default orderSlice.reducer
