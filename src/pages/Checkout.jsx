import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearCart } from '../slices/cartSlice'
import { placeOrder } from '../slices/orderSlice'

export default function Checkout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const cartItems = useSelector(state => state.cart.items)
  const user = useSelector(state => state.auth.user)

  // Address State
  const [shippingAddress, setShippingAddress] = useState({
    name: user.name || '',
    phone: user.phone || '',
    address: user.address || '',
    city: 'Chennai',
    zipCode: '600001',
  })

  // State controls
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [loading, setLoading] = useState(false)
  const [loadingStage, setLoadingStage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [placedOrderId, setPlacedOrderId] = useState('')

  // Card input states
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')

  // UPI input states
  const [customUpiId, setCustomUpiId] = useState('')
  const [upiVerified, setUpiVerified] = useState(false)
  const [upiVerifying, setUpiVerifying] = useState(false)

  // Scroll to top on mount
  useEffect(() => {
    document.documentElement.scrollTop = 0
  }, [])

  // If cart is empty and order is not successful, redirect to home
  useEffect(() => {
    if (cartItems.length === 0 && !isSuccess) {
      navigate('/cart')
    }
  }, [cartItems, isSuccess, navigate])

  // Order summary calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const delivery = subtotal > 999 ? 0 : 99
  const total = subtotal + delivery

  // Estimated delivery date (3 days from now)
  const getDeliveryEstimate = () => {
    const d = new Date()
    d.setDate(d.getDate() + 3)
    return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  }

  

  // Format Card Number (adds spaces every 4 digits)
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 16) value = value.slice(0, 16)
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value
    setCardNumber(formatted)
  }

  // Format Expiry Date (adds '/' after 2 digits)
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 4) value = value.slice(0, 4)
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`
    }
    setCardExpiry(value)
  }

  // Handle Custom UPI ID Verification simulation
  const handleVerifyUpi = () => {
    if (!customUpiId.includes('@')) {
      alert('Please enter a valid UPI ID (e.g. username@okhdfcbank)')
      return
    }
    setUpiVerifying(true)
    setUpiVerified(false)
    setTimeout(() => {
      setUpiVerifying(false)
      setUpiVerified(true)
    }, 1000)
  }

  // Handle Checkout submission
  const handleCheckoutSubmit = (e) => {
    e.preventDefault()

    // Valdiations
    if (!shippingAddress.name.trim() || !shippingAddress.phone.trim() || !shippingAddress.address.trim()) {
      alert('Please fill out all shipping details.')
      return
    }

    if (paymentMethod === 'card') {
      const cleanCard = cardNumber.replace(/\s+/g, '')
      if (cleanCard.length < 16) {
        alert('Please enter a valid 16-digit card number.')
        return
      }
      if (cardExpiry.length < 5) {
        alert('Please enter a valid expiry date (MM/YY).')
        return
      }
      if (cardCvv.length < 3) {
        alert('Please enter a valid CVV.')
        return
      }
      if (!cardName.trim()) {
        alert('Please enter the cardholder name.')
        return
      }
    } else if (paymentMethod === 'upi') {
      if (!upiVerified) {
        alert('Please enter and verify your UPI ID first.')
        return
      }
    }

    // Trigger loader simulation
    setLoading(true)
    setLoadingStage('🔒 Establishing secure connection...')

    setTimeout(() => {
      setLoadingStage('🏦 Contacting gateway & routing payment...')
      setTimeout(() => {
        setLoadingStage('🎉 Securing receipt & finalising order...')
        setTimeout(() => {
          // Success parameters
          const orderId = 'ORD' + Date.now()
          const paymentDetails = {}
          let finalMethodName = 'Cash on Delivery'
          if (paymentMethod === 'upi') {
            finalMethodName = 'UPI Payment'
          } else if (paymentMethod === 'card') {
            finalMethodName = 'Debit/Credit/ATM Card'
          }

          // Dispatch to Redux order Slice
          dispatch(placeOrder({
            id: orderId,
            items: cartItems,
            total: total,
            paymentMethod: finalMethodName,
            paymentDetails: paymentDetails,
            shippingAddress: shippingAddress,
          }))

          // Clear Redux Cart Slice
          dispatch(clearCart())

          setPlacedOrderId(orderId)
          setLoading(false)
          setIsSuccess(true)
          document.documentElement.scrollTop = 0
        }, 1200)
      }, 1200)
    }, 1000)
  }

  // --- RENDERING ORDER SUCCESS CELEBRATION ---
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 py-10 transition-colors relative overflow-hidden">
        {/* CSS Confetti Effect Spans */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {[...Array(24)].map((_, i) => {
            const randomX = Math.random() * 100
            const randomDelay = Math.random() * 3
            const randomDuration = 2 + Math.random() * 2
            const randomSize = 6 + Math.random() * 8
            const colors = ['bg-pink-500', 'bg-blue-500', 'bg-yellow-400', 'bg-green-500', 'bg-purple-500', 'bg-orange-500']
            const randomColor = colors[Math.floor(Math.random() * colors.length)]
            return (
              <span
                key={i}
                className={`absolute rounded-full opacity-60 animate-bounce ${randomColor}`}
                style={{
                  left: `${randomX}%`,
                  top: `-20px`,
                  width: `${randomSize}px`,
                  height: `${randomSize}px`,
                  animation: `fall ${randomDuration}s linear ${randomDelay}s infinite`,
                }}
              />
            )
          })}
        </div>

        {/* Global Keyframes embedded in inline style  (predefined css injector) */}
        <style dangerouslySetInnerHTML={{__html: ` 
          @keyframes fall {
            0% { transform: translateY(-50px) rotate(0deg); opacity: 1; }
            100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
          }
        `}} />

        <div className="max-w-xl mx-auto px-4 relative z-10">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-200/60 dark:border-slate-800 text-center transition-all">
            
            {/* Drew animated Checkmark SVG */}
            <div className="w-20 h-20 bg-green-50 dark:bg-green-950/30 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100 dark:border-green-900 shadow-inner">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" className="animate-[dash_0.6s_ease-in-out_forwards]" style={{ strokeDasharray: 20, strokeDashoffset: 20, animation: 'dash 0.6s ease-in-out forwards 0.2s' }} />
              </svg>
            </div>
            
            <style>{`
              @keyframes dash {
                to { stroke-dashoffset: 0; }
              }
            `}</style>

            <h1 className="text-3xl font-black tracking-tight text-slate-850 dark:text-white mb-2">Order Confirmed!</h1>
            <p className="text-sm text-slate-400 dark:text-slate-500 font-semibold mb-6">Thank you for shopping with us. Your payment has been simulated successfully!</p>

           
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate(`/tracking/${placedOrderId}`)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-sm"
              >
                📍 Track Shipping
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-sm"
              >
                🛍️ Home Shop
              </button>
            </div>

          </div>
        </div>
      </div>
    )
  }

  // --- RENDERING CHECKOUT PAGE ---
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors py-8">
      
      {/* Processing Loader Backdrop */}
      {loading && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm w-full text-center border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <span className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800" />
              <span className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
            </div>
            <h3 className="font-black text-lg text-slate-850 dark:text-white mb-2">Simulating Secure Payment</h3>
            <p className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-3 py-1.5 rounded-lg inline-block">{loadingStage}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-4 leading-relaxed font-semibold">Please do not refresh this page or close the tab while we secure your transaction credentials.</p>
          </div>
        </div>
      )}

      {/* Main Checkout container */}
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Back navigation */}
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-extrabold text-sm mb-5 transition-colors cursor-pointer"
        >
          ← Return to Shopping Cart
        </button>

        <h1 className="text-2xl font-black text-slate-850 dark:text-white mb-6">Checkout Checkout</h1>

        <form onSubmit={handleCheckoutSubmit} className="grid lg:grid-cols-3 gap-6">
          
          {/* Left Columns - Form Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. SHIPPING ADDRESS */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800 shadow-sm transition-colors">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xl">🏠</span>
                <h2 className="font-black text-base text-slate-800 dark:text-white">Shipping Address Details</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-1.5 block">Full Name</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.name}
                    onChange={e => setShippingAddress({...shippingAddress, name: e.target.value})}
                    placeholder="Receiver Name"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 font-semibold text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-1.5 block">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={shippingAddress.phone}
                    onChange={e => setShippingAddress({...shippingAddress, phone: e.target.value})}
                    placeholder="Contact Number"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 font-semibold text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-1.5 block">Delivery Address</label>
                  <textarea
                    rows={2.5}
                    required
                    value={shippingAddress.address}
                    onChange={e => setShippingAddress({...shippingAddress, address: e.target.value})}
                    placeholder="Flat/House No., Building, Street Name"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 font-semibold text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-1.5 block">City</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={e => setShippingAddress({...shippingAddress, city: e.target.value})}
                    placeholder="City"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 font-semibold text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-1.5 block">PIN Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={shippingAddress.zipCode}
                    onChange={e => setShippingAddress({...shippingAddress, zipCode: e.target.value.replace(/\D/g, '')})}
                    placeholder="6-digit ZIP code"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 font-semibold text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* 2. CHOOSE PAYMENT METHOD */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800 shadow-sm transition-colors">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xl">💳</span>
                <h2 className="font-black text-base text-slate-800 dark:text-white">Choose Payment Method</h2>
              </div>

              {/* Payment Selectable Cards */}
              <div className="grid sm:grid-cols-3 gap-3 mb-5">
                {[
                  { id: 'cash', label: 'Cash on Delivery', icon: '💵', desc: 'Pay at your doorstep' },
                  { id: 'upi', label: 'UPI Payment', icon: '📱', desc: 'Simulated UPI' },
                  { id: 'card', label: 'Debit/Credit/ATM', icon: '💳', desc: 'Simulated Card' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPaymentMethod(opt.id)}
                    className={`flex flex-col items-center justify-center gap-1.5 p-4 rounded-xl text-center cursor-pointer transition-all border ${
                      paymentMethod === opt.id
                        ? 'bg-blue-600/10 border-blue-600 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-150 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-350'
                    }`}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <span className="text-xs font-black">{opt.label}</span>
                    <span className="text-[9px] font-bold opacity-60">{opt.desc}</span>
                  </button>
                ))}
              </div>

              {/* Selection Banner */}
              <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-150 dark:border-slate-800 rounded-2xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/30 rounded-xl flex items-center justify-center border border-blue-100 dark:border-blue-900 flex-shrink-0 text-xl">
                  {paymentMethod === 'cash' ? '💵' : paymentMethod === 'upi' ? '📱' : '💳'}
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800 dark:text-white">
                    {paymentMethod === 'cash' && 'Cash on Delivery Selected'}
                    {paymentMethod === 'upi' && 'Simulated UPI Payment Selected'}
                    {paymentMethod === 'card' && 'Simulated Debit/Credit/ATM Card Selected'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-semibold">
                    {paymentMethod === 'cash' && 'You can make your checkout payments using Cash, card scanners, or any UPI wallets directly at your doorstep when the courier delivers your package.'}
                    {paymentMethod === 'upi' && 'A secure sandboxed mock UPI payment simulation will be run. No actual money will be charged from your account.'}
                    {paymentMethod === 'card' && 'A secure sandboxed mock Credit / Debit / ATM Card payment simulation will be run. No actual credit card details are needed.'}
                  </p>
                </div>
              </div>

              {/* UPI ID input & Verify logic */}
              {paymentMethod === 'upi' && (
                <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-5 mt-5">
                  <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider mb-2">📱 UPI Payment Details</h3>
                  <div className="flex gap-2.5">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="username@okhdfcbank"
                        value={customUpiId}
                        onChange={e => {
                          setCustomUpiId(e.target.value)
                          setUpiVerified(false)
                        }}
                        className={`w-full bg-slate-50 dark:bg-slate-800 border ${
                          upiVerified ? 'border-green-500 focus:ring-green-500' : 'border-slate-200 dark:border-slate-700'
                        } rounded-xl px-4 py-3 pl-11 font-mono text-sm font-semibold tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                      />
                      <span className="absolute left-4 top-3 text-lg pointer-events-none">📱</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleVerifyUpi}
                      disabled={upiVerifying || upiVerified || !customUpiId}
                      className={`px-5 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center min-w-[90px] cursor-pointer ${
                        upiVerified
                          ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 text-green-600 dark:text-green-400 font-extrabold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-350 hover:bg-slate-200 dark:hover:bg-slate-750 disabled:opacity-50'
                      }`}
                    >
                      {upiVerifying ? (
                        <span className="w-3.5 h-3.5 border-2 border-slate-650 border-t-transparent rounded-full animate-spin" />
                      ) : upiVerified ? (
                        '✓ Verified'
                      ) : (
                        'Verify ID'
                      )}
                    </button>
                  </div>
                  {upiVerified && (
                    <p className="text-[10px] text-green-600 dark:text-green-400 font-semibold mt-1 pl-1.5">✓ VPA Verified: Yogesh (Mock Account)</p>
                  )}
                </div>
              )}

              {/* Card Inputs */}
              {paymentMethod === 'card' && (
                <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-5 mt-5">
                  <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider mb-2">💳 Card Payment Details</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-3">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-1.5 block">Card Number</label>
                      <div className="relative">
                        <input
                          type="text"
                          required={paymentMethod === 'card'}
                          placeholder="4111 2222 3333 4444"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 pl-11 font-mono text-sm font-semibold tracking-wider focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                        <span className="absolute left-4 top-3 text-lg pointer-events-none">💳</span>
                      </div>
                    </div>

                    <div className="col-span-3 sm:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-1.5 block">Cardholder Name</label>
                      <input
                        type="text"
                        required={paymentMethod === 'card'}
                        placeholder="NAME ON CARD"
                        value={cardName}
                        onChange={e => setCardName(e.target.value.replace(/[^A-Za-z ]/g, ''))}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 font-semibold text-sm uppercase tracking-wider focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-1.5 block">Expiry Date</label>
                      <input
                        type="text"
                        required={paymentMethod === 'card'}
                        placeholder="MM/YY"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 font-mono text-sm font-semibold tracking-wider text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>

                    <div className="col-span-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-1.5 block">CVV</label>
                      <input
                        type="password"
                        required={paymentMethod === 'card'}
                        maxLength={3}
                        placeholder="•••"
                        value={cardCvv}
                        onChange={e => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 font-mono text-sm font-semibold text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column - Cost and checkout action summary */}
          <div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800 shadow-sm sticky top-20 transition-colors">
              <h2 className="font-black text-slate-800 dark:text-white text-base mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">Review Items ({cartItems.reduce((s, i) => s + i.quantity, 0)})</h2>
              
              {/* Mini Cart lists */}
              <div className="space-y-3 mb-5 max-h-36 overflow-y-auto pr-1">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-3 text-xs">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 flex-shrink-0"
                      onError={e => e.target.src = `https://placehold.co/40x40?text=IMG`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-700 dark:text-slate-350 line-clamp-1">{item.name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">Qty: {item.quantity} · price: ₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                    <span className="font-extrabold text-slate-800 dark:text-white flex-shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              {/* Price breaking */}
              <div className="space-y-3 text-xs font-semibold pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Items Subtotal</span>
                  <span className="text-slate-800 dark:text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Shipping Fee</span>
                  <span className={`font-bold ${delivery === 0 ? 'text-green-600 dark:text-green-400' : 'text-slate-800 dark:text-white'}`}>
                    {delivery === 0 ? 'FREE' : `₹${delivery}`}
                  </span>
                </div>
                <div className="flex justify-between text-green-600 dark:text-green-400 font-bold border-t border-dashed border-slate-100 dark:border-slate-200/50 pt-2.5">
                  <span className="flex items-center gap-1">🚚 Expected Delivery</span>
                  <span>{getDeliveryEstimate()}</span>
                </div>
                <div className="flex justify-between font-black text-slate-800 dark:text-white text-sm pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span>Payable Total</span>
                  <span className="text-blue-600 dark:text-blue-400 text-base">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Place Order CTA Button */}
              <button
                type="submit"
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-xl shadow-lg hover:shadow-blue-500/15 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm cursor-pointer"
              >
                🔒 Place Simulated Order
              </button>

              <div className="flex items-center justify-center gap-1.5 mt-3 text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                <span>🛡️ Safe sandboxed environment</span>
              </div>
            </div>
          </div>

        </form>

      </div>
    </div>
  )
}
