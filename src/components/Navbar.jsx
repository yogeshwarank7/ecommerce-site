import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../slices/authSlice'

export default function Navbar({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, theme, setTheme }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const cartCount = useSelector(state => state.cart.items.length)
  const wishlistCount = useSelector(state => state.wishlist.items.length)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200 shadow-sm">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <span className="text-2xl font-black tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="text-slate-800 dark:text-white">Y</span>
            <span className="text-blue-600 dark:text-blue-400">o</span>
            <span className="text-slate-800 dark:text-white">ki</span>
          </span>
        </Link>

        {/* Search */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search products, brands..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-2.5 pr-10 text-sm outline-none border border-transparent focus:border-blue-500 dark:focus:border-blue-400 transition-all font-medium"
          />
          <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Desktop Nav Icons */}
        <div className="hidden md:flex items-center gap-1">
          {/* Home navigation Link */}
          <NavLink to="/" label="Home" icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          } />
          
          <NavLink to="/wishlist" label="Wishlist" count={wishlistCount} icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          } />
          
          <NavLink to="/orders" label="Orders" icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          } />
          
          <NavLink to="/cart" label="Cart" count={cartCount} icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          } />
          
          <NavLink to="/profile" label="Profile" icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          } />

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex flex-col items-center gap-0.5 px-3 py-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-xs font-semibold cursor-pointer"
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? (
              <>
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
                <span>Light</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <span>Dark</span>
              </>
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-0.5 px-3 py-2 text-red-500 hover:text-red-650 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all text-xs font-semibold cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>

        {/* Mobile Buttons */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-slate-700 dark:text-slate-200 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-3 flex flex-col gap-2 shadow-inner">
          {[['Home', '/'], ['Wishlist', '/wishlist', wishlistCount], ['Orders', '/orders'], ['Cart', '/cart', cartCount], ['Profile', '/profile']].map(([label, path, count]) => (
            <Link
              key={label}
              to={path}
              onClick={() => setMenuOpen(false)}
              className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-2.5 text-sm font-bold flex items-center justify-between px-1 transition-colors"
            >
              <span>{label}</span>
              {count > 0 && <span className="bg-amber-400 text-slate-900 text-xs font-black px-2 py-0.5 rounded-full">{count}</span>}
            </Link>
          ))}
          <hr className="border-slate-100 dark:border-slate-800" />
          <button
            onClick={() => { setMenuOpen(false); handleLogout() }}
            className="text-left text-red-500 hover:text-red-650 py-2.5 text-sm font-bold px-1 cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}

function NavLink({ to, label, icon, count }) {
  return (
    <Link
      to={to}
      className="relative flex flex-col items-center gap-0.5 px-3.5 py-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all text-xs font-bold"
    >
      {icon}
      <span>{label}</span>
      {count > 0 && (
        <span className="absolute top-1 right-2.5 bg-amber-400 text-slate-900 text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center leading-none shadow-sm">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Link>
  )
}
