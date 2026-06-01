import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addToCart } from '../slices/cartSlice'
import { addWishlist, removeWishlist } from '../slices/wishlistSlice'
import { useState } from 'react'

// Helper to generate simple, beginner-level rating star strings
const getEmojiStars = (rating) => {
  const rounded = Math.round(rating)
  return '⭐'.repeat(rounded) + '☆'.repeat(5 - rounded)
}

export default function ProductCard({ product, onAlreadyInCart }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const cartItems = useSelector(state => state.cart.items)
  const wishlistItems = useSelector(state => state.wishlist.items)
  const [imgError, setImgError] = useState(false)

  const inWishlist = wishlistItems.some(i => i.id === product.id)
  const inCart = cartItems.some(i => i.id === product.id)

  const handleAddToCart = () => {
    if (inCart) {
      onAlreadyInCart()
    } else {
      dispatch(addToCart(product))
    }
  }

  const handleWishlist = () => {
    if (inWishlist) {
      dispatch(removeWishlist(product.id))
    } else {
      dispatch(addWishlist(product))
    }
  }

  const handleCardClick = (e) => {
    // If the click is inside wishlist or add-to-cart buttons, do NOT navigate
    if (e.target.closest('.no-nav')) return
    navigate(`/product/${product.id}`)
  }

  const categoryColors = {
    Mobiles: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    Laptops: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    TVs: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    Accessories: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  }

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 dark:border-slate-800 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="no-nav absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-white/95 dark:bg-slate-800/90 dark:text-slate-300 rounded-full shadow transition-all hover:scale-110 active:scale-95"
        >
          <svg className={`w-4.5 h-4.5 transition-colors ${inWishlist ? 'text-red-500 fill-red-500' : 'text-slate-400 dark:text-slate-500'}`} fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" style={{ width: '18px', height: '18px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Image */}
        <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-800" style={{ height: '200px' }}>
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColors[product.category] || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
            {product.category}
          </span>
          <h3 className="mt-2 text-sm font-bold text-slate-800 dark:text-white leading-snug line-clamp-2 min-h-10">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-xs text-amber-500 font-bold" title={`${product.rating} out of 5 stars`}>
            <span>{getEmojiStars(product.rating)}</span>
            <span className="text-slate-400 dark:text-slate-400 text-[10px] font-bold">({product.rating})</span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div>
              <span className="text-lg font-black text-slate-900 dark:text-white">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          className={`no-nav w-full py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 cursor-pointer ${
            inCart
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-default'
              : 'bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white shadow hover:shadow-blue-500/20 hover:scale-[1.02]'
          }`}
        >
          {inCart ? '✓ Added to Cart' : '+ Add to Cart'}
        </button>
      </div>
    </div>
  )
}
