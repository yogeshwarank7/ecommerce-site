import { useSelector, useDispatch } from 'react-redux'
import { removeFromCart, increaseQuantity, decreaseQuantity } from '../slices/cartSlice'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function Cart() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const items = useSelector(state => state.cart.items)

  // Reset scroll to top on page mount
  useEffect(() => {
    document.documentElement.scrollTop = 0
  }, [])

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const delivery = subtotal > 999 ? 0 : 99
  const total = subtotal + delivery

  const handlePlaceOrder = () => {
    navigate('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex items-center justify-center transition-colors">
        <div className="text-center p-6">
          <div className="text-7xl mb-4">🛒</div>
          <h2 className="text-2xl font-black text-slate-700 dark:text-slate-300 mb-3">Your cart is empty</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">Looks like you haven't added anything yet</p>
          <button 
            onClick={() => navigate('/')} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 cursor-pointer shadow"
          >
            Start Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-6">
          Shopping Cart <span className="text-blue-600 dark:text-blue-400">({items.length})</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div 
                key={item.id} 
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 flex gap-4 transition-colors"
              >
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-24 h-24 object-cover rounded-xl flex-shrink-0 bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800" 
                  onError={e => e.target.src = `https://placehold.co/96x96/e2e8f0/94a3b8?text=IMG`} 
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm line-clamp-2">{item.name}</h3>
                  <p className="text-blue-600 dark:text-blue-400 font-extrabold text-lg mt-1">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">₹{item.price.toLocaleString('en-IN')} each</p>

                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700 rounded-xl overflow-hidden">
                      <button 
                        onClick={() => dispatch(decreaseQuantity(item.id))} 
                        className="px-3 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold transition-colors text-lg cursor-pointer"
                      >
                        −
                      </button>
                      <span className="px-3 py-1 font-extrabold text-slate-800 dark:text-white text-sm min-w-8 text-center bg-slate-50/50 dark:bg-slate-900/50">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => dispatch(increaseQuantity(item.id))} 
                        className="px-3 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold transition-colors text-lg cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="text-xs text-red-500 hover:text-red-605 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 sticky top-20 transition-colors">
              <h2 className="font-black text-slate-800 dark:text-white text-lg mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-600 dark:text-slate-400 font-semibold">
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="text-slate-800 dark:text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400 font-semibold">
                  <span>Delivery</span>
                  <span className={`font-bold ${delivery === 0 ? 'text-green-600 dark:text-green-400' : 'text-slate-800 dark:text-white'}`}>
                    {delivery === 0 ? 'FREE' : `₹${delivery}`}
                  </span>
                </div>
                {delivery === 0 && (
                  <p className="text-xs text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900 px-2.5 py-1 rounded-lg font-bold">
                    🎉 Free delivery applied!
                  </p>
                )}
                <div className="flex justify-between font-black text-slate-800 dark:text-white text-base pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span>Total</span>
                  <span className="text-blue-600 dark:text-blue-400">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
              
              <button
                onClick={handlePlaceOrder}
                className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-xl transition-all shadow hover:shadow-blue-500/10 text-sm cursor-pointer active:scale-[0.98]"
              >
                🛒 Place Order
              </button>
              <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-3 font-semibold">Secure checkout · Easy returns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
