import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { trackingStatus } from '../slices/orderSlice'

// The 5 stages of tracking required by Yoki Shop
const steps = [
  { key: 'placed', label: 'Order Placed', icon: '📋', desc: 'Your order has been received and confirmed.' },
  { key: 'packed', label: 'Packed', icon: '📦', desc: 'Items packed and ready for dispatch.' },
  { key: 'shipped', label: 'Shipped', icon: '🚚', desc: 'Package is on the way to delivery hub.' },
  { key: 'out_for_delivery', label: 'Out For Delivery', icon: '🛵', desc: 'Out for delivery to your address.' },
  { key: 'delivered', label: 'Delivered', icon: '✅', desc: 'Package delivered successfully.' },
]

const stepOrder = ['placed', 'packed', 'shipped', 'out_for_delivery', 'delivered']

export default function Tracking() {
  const dispatch = useDispatch()
  const { orderId } = useParams()
  const navigate = useNavigate()
  const orders = useSelector(state => state.orders.list)
  const order = orders.find(o => o.id === orderId)

  // Reset scroll to top on page mount
  useEffect(() => {
    document.documentElement.scrollTop = 0
  }, [])

  // Get current status from Redux (defaults to 'placed' if not defined yet)
  const currentStatus = order ? order.trackingStatus || 'placed' : 'placed'
  const currentIndex = stepOrder.indexOf(currentStatus)

  // Auto-update tracking status using useEffect and setTimeout every 3 seconds!
  useEffect(() => {
    // Stop if there is no order or we are already at the final stage ('delivered')
    if (!order || currentStatus === 'delivered') return

    const nextIndex = currentIndex + 1
    if (nextIndex < stepOrder.length) {
      const nextStatus = stepOrder[nextIndex]

      // Wait 3 seconds, then update the status in Redux
      const timer = setTimeout(() => {
        dispatch(trackingStatus({ id: orderId, status: nextStatus }))
      }, 3000)

      // Clean up the timer to avoid memory leaks
      return () => clearTimeout(timer)
    }
  }, [order, currentStatus, currentIndex, dispatch, orderId])

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex items-center justify-center transition-colors duration-250">
        <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-3xl shadow border border-slate-200 dark:border-slate-800 max-w-sm">
          <div className="text-5xl mb-3">❓</div>
          <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Order Not Found</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-5 font-semibold">We couldn't locate this order ID in your account.</p>
          <button
            onClick={() => navigate('/orders')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold transition-all cursor-pointer shadow"
          >
            View Orders
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-250 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-extrabold text-sm mb-5 transition-colors cursor-pointer"
        >
          ← Back to Orders
        </button>

        <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-1">Track Your Order</h1>
        <p className="text-slate-400 dark:text-slate-500 text-sm font-mono mb-6">ID: {orderId}</p>

        {/* Dynamic Simulation Status Banner */}
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 rounded-2xl p-4.5 mb-6 flex items-start gap-3 transition-colors">
          <span className="text-2xl mt-0.5">🚚</span>
          <div>
            <h3 className="text-sm font-bold text-blue-900 dark:text-blue-300">Auto-Tracking Simulation Active</h3>
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-1 leading-relaxed font-semibold">
              Your order is simulated in real-time. Watch the steps below light up green and get checkmarks as the courier updates the shipping status every 3 seconds!
            </p>
          </div>
        </div>

        {/* Timeline Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 mb-6 transition-colors">
          <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Ordered On</span>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{order.date}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Total Paid</span>
              <span className="text-base font-black text-blue-600 dark:text-blue-400">₹{order.total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Timeline Steps */}
          <div className="space-y-1">
            {steps.map((step, index) => {
              const isDone = index <= currentIndex
              const isActive = index === currentIndex
              const isLast = index === steps.length - 1

              return (
                <div key={step.key} className="flex gap-4">
                  {/* Timeline Line & Status Circle */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 transition-all duration-500 ${
                        isDone
                          ? isActive
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-4 ring-blue-100 dark:ring-blue-950/60'
                            : 'bg-green-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {isDone ? (isActive ? step.icon : '✓') : <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">{index + 1}</span>}
                    </div>
                    {!isLast && (
                      <div
                        className={`w-0.5 flex-1 min-h-8 my-1 transition-all duration-500 ${
                          index < currentIndex ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-800'
                        }`}
                      />
                    )}
                  </div>

                  {/* Step Description Content */}
                  <div className="pb-6 flex-1">
                    <div className="flex items-center gap-2">
                      <p
                        className={`font-bold text-sm ${
                          isDone
                            ? isActive
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-green-600 dark:text-green-450'
                            : 'text-slate-400 dark:text-slate-600'
                        }`}
                      >
                        {step.label} {isDone && <span className="text-green-550 ml-0.5">✔</span>}
                      </p>
                      {isActive &&  currentStatus !== 'delivered' && (
                        <span className="bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800 uppercase tracking-wider animate-pulse">
                          In Progress
                        </span>
                      )}
                      {isDone && !isActive  || (isActive && currentStatus === 'delivered') && (
                        <span className="bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800 uppercase tracking-wider">
                          Completed
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-0.5 ${isDone ? 'text-slate-500 dark:text-slate-400 font-semibold' : 'text-slate-400 dark:text-slate-500'}`}>{step.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Package Items details */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
          <h3 className="font-extrabold text-slate-800 dark:text-white mb-3.5 text-xs uppercase tracking-wider">Items in this package</h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {order.items.map(item => (
              <div 
                key={item.id} 
                onClick={() => navigate(`/product/${item.id}`)}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 px-2 rounded-xl transition-all"
                title="Click to view product details"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-shrink-0"
                  onError={e => { e.target.src = `https://placehold.co/48x48/e2e8f0/94a3b8?text=Product` }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 dark:text-white line-clamp-1 hover:text-blue-600 dark:hover:text-blue-400">{item.name}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">Qty: {item.quantity} · Price: ₹{item.price.toLocaleString('en-IN')}</p>
                </div>
                <p className="font-black text-slate-800 dark:text-white text-sm">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
