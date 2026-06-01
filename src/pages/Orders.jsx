import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function Orders() {
  const orders = useSelector(state => state.orders.list)
  const navigate = useNavigate()

  // Reset scroll to top on page mount
  useEffect(() => {
    document.documentElement.scrollTop = 0
  }, [])

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex items-center justify-center transition-colors duration-250">
        <div className="text-center p-6">
          <div className="text-7xl mb-4">📦</div>
          <h2 className="text-2xl font-black text-slate-700 dark:text-slate-300 mb-2">No Orders Found</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 font-semibold">You haven't placed any orders yet</p>
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-250 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-6">My Orders</h1>
        <div className="space-y-5">
          {[...orders].reverse().map(order => (
            <div key={order.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Order ID</span>
                  <p className="font-extrabold text-slate-800 dark:text-white font-mono text-sm">{order.id}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Payment</span>
                  <p className="font-bold text-slate-700 dark:text-slate-300 text-sm flex items-center gap-1">
                    {order.paymentMethod ? (
                      <>
                        {order.paymentMethod.includes('Card') && '💳 '}
                        {order.paymentMethod.includes('UPI') && '📱 '}
                        {order.paymentMethod.includes('Delivery') && '💵 '}
                        {order.paymentMethod}
                      </>
                    ) : '💵 Cash on Delivery'}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-bold">Placed on</span>
                  <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">{order.date}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-xs font-bold px-3 py-1.5 rounded-full self-start sm:self-auto">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
                  Confirmed
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map(item => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/product/${item.id}`)}
                    className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 p-2 rounded-xl transition-all"
                    title="Click to view product details"
                  >
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-12 h-12 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 flex-shrink-0" 
                      onError={e => e.target.src = `https://placehold.co/48x48/e2e8f0/94a3b8?text=P`} 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 dark:text-white line-clamp-1 group-hover:text-blue-600">{item.name}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                    <p className="text-sm font-black text-slate-800 dark:text-white">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-bold">Total Amount</span>
                  <p className="text-lg font-black text-blue-600 dark:text-blue-400">₹{order.total.toLocaleString('en-IN')}</p>
                </div>
                <button
                  onClick={() => navigate(`/tracking/${order.id}`)}
                  className="bg-blue-600 hover:bg-blue-750 text-white font-extrabold px-5 py-2.5 rounded-xl text-sm transition-all hover:scale-105 active:scale-95 shadow cursor-pointer"
                >
                  📍 Track Order
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
