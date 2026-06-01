import { useSelector, useDispatch } from 'react-redux'
import { removeWishlist } from '../slices/wishlistSlice'
import { addToCart } from '../slices/cartSlice'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Wishlist() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const items = useSelector(state => state.wishlist.items)
  const cartItems = useSelector(state => state.cart.items)
  const [popup, setPopup] = useState(false)

  // Reset scroll to top on page mount
  useEffect(() => {
    document.documentElement.scrollTop = 0
  }, [])

  const handleAddToCart = (item) => {
    const inCart = cartItems.some(c => c.id === item.id)
    if (inCart) {
      setPopup(true)
      setTimeout(() => setPopup(false), 2500)
    } else {
      dispatch(addToCart(item))
    }
  }

  const handleCardClick = (id, e) => {
    if (e.target.closest('.no-nav')) return
    navigate(`/product/${id}`)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white flex items-center justify-center transition-colors">
        <div className="text-center p-6">
          <div className="text-7xl mb-4">💝</div>
          <h2 className="text-2xl font-black text-slate-700 dark:text-slate-300 mb-3">Your wishlist is empty</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">Save your favorite items to buy later</p>
          <button 
            onClick={() => navigate('/')} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 cursor-pointer shadow"
          >
            Browse Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors py-8">
      {popup && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 dark:bg-slate-800 text-white px-6 py-3 rounded-2xl shadow-2xl text-sm font-semibold flex items-center gap-2">
          ℹ️ Product already in cart
        </div>
      )}
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-6">
          My Wishlist <span className="text-red-500">♥ ({items.length})</span>
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div 
              key={item.id} 
              onClick={(e) => handleCardClick(item.id, e)}
              className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative">
                  <img src={item.image} alt={item.name} className="w-full h-44 object-cover bg-slate-50 dark:bg-slate-800" onError={e => e.target.src = `https://placehold.co/300x176/e2e8f0/94a3b8?text=IMG`} />
                  <button
                    onClick={() => dispatch(removeWishlist(item.id))}
                    className="no-nav absolute top-2 right-2 bg-white dark:bg-slate-800 rounded-full w-7 h-7 flex items-center justify-center shadow text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white line-clamp-2 min-h-9">{item.name}</h3>
                  <p className="text-blue-600 dark:text-blue-400 font-extrabold mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                </div>
              </div>
              <div className="p-3 pt-0">
                <button
                  onClick={() => handleAddToCart(item)}
                  className="no-nav w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all hover:scale-[1.02] cursor-pointer"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
