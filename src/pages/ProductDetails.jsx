import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { products } from '../data/products'
import { addToCart } from '../slices/cartSlice'
import { addWishlist, removeWishlist } from '../slices/wishlistSlice'

// Simple helper to generate rating stars emojis
const getEmojiStars = (rating) => {
  const rounded = Math.round(rating)
  return '⭐'.repeat(rounded) + '☆'.repeat(5 - rounded)
}
export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [imgError, setImgError] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  // Reviews and comments state
  const [reviews, setReviews] = useState([])
  const [reviewComment, setReviewComment] = useState('')
  const [reviewRating, setReviewRating] = useState(5)

  // Find the product by ID
  const product = products.find(p => p.id === parseInt(id))

  const cartItems = useSelector(state => state.cart.items)
  const wishlistItems = useSelector(state => state.wishlist.items)
  const user = useSelector(state => state.auth.user)

  // Retrieve dynamic reviews from localStorage when the product changes
  useEffect(() => {
    if (product) {
      const savedReviews = JSON.parse(localStorage.getItem('yoki_reviews') || '{}')
      const productReviews = savedReviews[product.id] || []
      setReviews(productReviews)
      setImgError(false) // reset image fallbacks
      
      // Scroll cleanly to the top of the page (no window references)
      document.documentElement.scrollTop = 0
    }
  }, [id, product])

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-20 text-center px-4 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
        <h2 className="text-3xl font-extrabold text-slate-700 dark:text-slate-300">Product Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">The product you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 bg-blue-600 hover:bg-blue-750 text-white font-bold px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow"
        >
          Back to Home
        </button>
      </div>
    )
  }

  const inCart = cartItems.some(item => item.id === product.id)
  const inWishlist = wishlistItems.some(item => item.id === product.id)

  const handleAddToCart = () => {
    if (inCart) {
      setShowPopup(true)
      setTimeout(() => setShowPopup(false), 2000)
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

  // Handle submitting review comments
  const handleReviewSubmit = (e) => {
    e.preventDefault()
    if (!reviewComment.trim()) return

    const newReview = {
      id: Date.now(),
      reviewerName: user.name || 'Anonymous Buyer',
      rating: parseInt(reviewRating),
      comment: reviewComment,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    }

    const updatedReviews = [newReview, ...reviews]
    setReviews(updatedReviews)

    // Save globally inside localStorage
    const savedReviewsMap = JSON.parse(localStorage.getItem('yoki_reviews') || '{}')
    savedReviewsMap[product.id] = updatedReviews
    localStorage.setItem('yoki_reviews', JSON.stringify(savedReviewsMap))

    // Reset inputs
    setReviewComment('')
    setReviewRating(5)
  }

  // Find 4 related products from the same category (excluding current product)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const description = product.description || 'High quality premium product.'
  const specs = product.specs || []

  const categoryColors = {
    Mobiles: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    Laptops: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    TVs: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    Accessories: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 py-8 px-4 transition-colors duration-200">
      
      {/* Toast Alert */}
      {showPopup && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 dark:bg-slate-800 text-white px-6 py-3 rounded-2xl shadow-2xl text-sm font-semibold flex items-center gap-2 animate-bounce">
          ℹ️ Product already in cart
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        
        {/* Back navigation */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white mb-6 group transition-all cursor-pointer"
        >
          ← Back to Listings
        </button>

        {/* Product Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10 transition-colors">
          
          {/* Product Image Section - Plain Image rendering (no scale zoom) */}
          <div className="relative bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden flex items-center justify-center p-4 border border-slate-200 dark:border-slate-800 h-[380px] md:h-[450px]">
            <img
              src={product.image}
              alt={product.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-contain max-h-[420px] rounded-xl"
            />
            
            {/* Wishlist Button on Image */}
            <button
              onClick={handleWishlist}
              className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 shadow rounded-full transition-all active:scale-95 cursor-pointer no-nav border border-slate-100 dark:border-slate-700"
            >
              <svg className={`w-6 h-6 ${inWishlist ? 'text-red-500 fill-red-500' : 'text-slate-400 dark:text-slate-500'}`} fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          {/* Product Information Section */}
          <div className="flex flex-col justify-between py-2">
            <div>
              {/* Category tag */}
              <span className={`inline-block text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-4 ${categoryColors[product.category] || 'bg-slate-100 text-slate-700 dark:text-slate-300'}`}>
                {product.category}
              </span>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight mb-3">
                {product.name}
              </h1>

              {/* Rating representation using simple Emoji Stars */}
              <div className="flex items-center gap-2 mb-6">
                <span className="text-amber-500 font-bold text-lg select-none">
                  {getEmojiStars(product.rating)}
                </span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                  {product.rating} / 5.0
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                  (Verified Customer Rating)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 inline-block pr-12">
                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-bold mb-0.5">
                  Best Price Offer
                </span>
                <span className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Description & Technical Specs */}
              <div className="mb-6">
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
                  Product Description
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-semibold mb-5">
                  {description}
                </p>

                <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                  Technical Specifications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
                  {specs.map((spec, index) => (
                    <div key={index} className="flex flex-col p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <span className="text-slate-400 dark:text-slate-500 uppercase tracking-wide text-[10px] font-extrabold mb-1">{spec.label}</span>
                      <span className="text-slate-800 dark:text-slate-200">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Benefits list */}
            <div className="grid grid-cols-2 gap-3 mb-6 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 font-semibold">
              <div className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">✓</span> Free delivery above ₹999
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">✓</span> 7 days replacement warranty
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">✓</span> Secure payments with EMI options
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">✓</span> 100% Genuine product check
              </div>
            </div>

            {/* Add to Cart button */}
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-xl text-base font-extrabold transition-all active:scale-98 cursor-pointer ${
                inCart
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-default font-bold text-center'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/20 hover:scale-[1.01]'
              }`}
            >
              {inCart ? '✓ Already Added to Shopping Cart' : 'Add to Shopping Cart — ₹' + product.price.toLocaleString('en-IN')}
            </button>

          </div>

        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 transition-colors">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <span>🤝</span> Related Products you might like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map(p => (
                <div 
                  key={p.id}
                  onClick={() => navigate(`/product/${p.id}`)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between"
                >
                  <div>
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="w-full h-32 object-cover rounded-xl bg-white dark:bg-slate-700 mb-3 border border-slate-200 dark:border-slate-700"
                      onError={e => e.target.src = `https://placehold.co/200x128/e2e8f0/94a3b8?text=IMG`}
                    />
                    <h4 className="text-xs font-extrabold text-slate-800 dark:text-white line-clamp-2 min-h-8 mb-1 leading-snug">{p.name}</h4>
                    <p className="text-[11px] font-bold text-amber-500 mb-2 select-none">{getEmojiStars(p.rating)}</p>
                  </div>
                  <p className="text-sm font-black text-slate-900 dark:text-white mt-1">₹{p.price.toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Customer Reviews comment panel */}
        <div className="mt-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 transition-colors grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Write a Review Box (col-span-2) */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-1 pb-1 border-b border-slate-100 dark:border-slate-800">
              ✍️ Write a Review
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs mb-4">Share your shopping experience with other buyers</p>
            
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1.5 uppercase tracking-wide">Reviewer Name</label>
                <input 
                  type="text" 
                  value={user.name} 
                  disabled 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-xl px-4 py-2.5 text-xs outline-none cursor-not-allowed font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1.5 uppercase tracking-wide">Star Rating</label>
                <select 
                  value={reviewRating}
                  onChange={e => setReviewRating(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                  <option value={4}>⭐⭐⭐⭐☆ (4 - Very Good)</option>
                  <option value={3}>⭐⭐⭐☆☆ (3 - Average)</option>
                  <option value={2}>⭐⭐☆☆☆ (2 - Poor)</option>
                  <option value={1}>⭐☆☆☆☆ (1 - Very Bad)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1.5 uppercase tracking-wide">Review Comment</label>
                <textarea 
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  placeholder="Tell us what you like or dislike about this product..."
                  rows={4}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-400 rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-blue-500 font-semibold resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-xl text-xs shadow hover:shadow-blue-500/10 cursor-pointer transition-all active:scale-[0.98]"
              >
                Submit Review Comment
              </button>
            </form>
          </div>

          {/* Customer Feedback lists (col-span-3) */}
          <div className="lg:col-span-3">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-1 pb-1 border-b border-slate-100 dark:border-slate-800">
              💬 Customer Reviews ({reviews.length})
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs mb-4">Latest responses for this item</p>

            {reviews.length > 0 ? (
              <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2 divide-y divide-slate-100 dark:divide-slate-800">
                {reviews.map((r, index) => (
                  <div key={r.id} className={`pt-3 ${index === 0 ? 'pt-0' : ''}`}>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div>
                        <span className="font-extrabold text-slate-800 dark:text-white text-xs block capitalize">{r.reviewerName}</span>
                        <span className="text-[11px] text-amber-500 font-bold select-none">{getEmojiStars(r.rating)}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">{r.date}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed font-semibold">
                      {r.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <span className="text-4xl">📝</span>
                <h4 className="text-sm font-bold text-slate-600 dark:text-slate-400 mt-2">No reviews yet</h4>
                <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">Be the first to share your comments about this item!</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}
