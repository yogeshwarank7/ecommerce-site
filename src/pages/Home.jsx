import { useState, useEffect } from 'react'
import { products } from '../data/products'
import ProductCard from '../components/ProductCard'
import CategoryFilter from '../components/CategoryFilter'
import SortProducts from '../components/SortProducts'
import OfferSlider from '../components/OfferSlider'

export default function Home({ searchQuery, selectedCategory, setSelectedCategory }) {
  // Reset scroll to top on page mount
  useEffect(() => {
    document.documentElement.scrollTop = 0
  }, [])
  const [sortBy, setSortBy] = useState('')
  const [popup, setPopup] = useState(false)

  const showAlreadyInCart = () => {
    setPopup(true)
    setTimeout(() => setPopup(false), 2500)
  }

  let filtered = products.filter(p => {
    const matchCat = !selectedCategory || p.category === selectedCategory
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  if (sortBy === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price)
  else if (sortBy === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price)
  else if (sortBy === 'name-asc') filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))
  else if (sortBy === 'name-desc') filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name))

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-250">
      {/* Already in cart popup */}
      {popup && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 dark:bg-slate-800 text-white px-6 py-3 rounded-2xl shadow-2xl text-sm font-semibold flex items-center gap-2 animate-bounce">
          <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Product already in cart
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Offer Slider - pass setSelectedCategory to support deals redirection */}
        <OfferSlider setSelectedCategory={setSelectedCategory} />

        {/* Hero sub-text */}
        <div className="text-center py-2">
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Shop the <span className="text-blue-600 dark:text-blue-400">Best Deals</span> Today
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-semibold">Free delivery on orders above ₹999 · Easy returns · Secure payments</p>
        </div>

        {/* Filter & Sort Bar (Target ID for slider scrolling) */}
        <div 
          id="products-section"
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200/60 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between transition-all"
        >
          <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
          <SortProducts value={sortBy} onChange={setSortBy} />
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between px-1">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">
            Showing <span className="font-extrabold text-slate-800 dark:text-slate-200">{filtered.length}</span> products
            {selectedCategory && <span> in <span className="font-extrabold text-blue-600 dark:text-blue-400">{selectedCategory}</span></span>}
            {searchQuery && <span> for "<span className="font-extrabold text-blue-600 dark:text-blue-400">{searchQuery}</span>"</span>}
          </p>
        </div>

        {/* Products Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} onAlreadyInCart={showAlreadyInCart} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No products found</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Try a different search or category filter</p>
          </div>
        )}
      </div>
    </div>
  )
}
