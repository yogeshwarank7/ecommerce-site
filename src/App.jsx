import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from './slices/authSlice'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/Login'
import Home from './pages/Home'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import Orders from './pages/Orders'
import Tracking from './pages/Tracking'
import Profile from './pages/Profile'
import ProductDetails from './pages/ProductDetails'
import Checkout from './pages/Checkout'

function Layout({ children, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, theme, setTheme }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        theme={theme}
        setTheme={setTheme}
      />
      <main className="flex-1">
        {children}
      </main>
      <Footer theme={theme} />
    </div>
  )
}

export default function App() {
  const dispatch = useDispatch()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn)
  const [theme, setTheme] = useState(localStorage.getItem('yoki_theme') || 'light')

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('yoki_theme', theme)
  }, [theme])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/" replace /> : <Login theme={theme} setTheme={setTheme} />} />

        <Route path="/" element={
          <ProtectedRoute>
            <Layout 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
              selectedCategory={selectedCategory} 
              setSelectedCategory={setSelectedCategory}
              theme={theme}
              setTheme={setTheme}
            >
              <Home searchQuery={searchQuery} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/product/:id" element={
          <ProtectedRoute>
            <Layout 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
              selectedCategory={selectedCategory} 
              setSelectedCategory={setSelectedCategory}
              theme={theme}
              setTheme={setTheme}
            >
              <ProductDetails />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/cart" element={
          <ProtectedRoute>
            <Layout 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
              selectedCategory={selectedCategory} 
              setSelectedCategory={setSelectedCategory}
              theme={theme}
              setTheme={setTheme}
            >
              <Cart />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/checkout" element={
          <ProtectedRoute>
            <Layout 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
              selectedCategory={selectedCategory} 
              setSelectedCategory={setSelectedCategory}
              theme={theme}
              setTheme={setTheme}
            >
              <Checkout />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/wishlist" element={
          <ProtectedRoute>
            <Layout 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
              selectedCategory={selectedCategory} 
              setSelectedCategory={setSelectedCategory}
              theme={theme}
              setTheme={setTheme}
            >
              <Wishlist />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/orders" element={
          <ProtectedRoute>
            <Layout 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
              selectedCategory={selectedCategory} 
              setSelectedCategory={setSelectedCategory}
              theme={theme}
              setTheme={setTheme}
            >
              <Orders />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/tracking/:orderId" element={
          <ProtectedRoute>
            <Layout 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
              selectedCategory={selectedCategory} 
              setSelectedCategory={setSelectedCategory}
              theme={theme}
              setTheme={setTheme}
            >
              <Tracking />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
              selectedCategory={selectedCategory} 
              setSelectedCategory={setSelectedCategory}
              theme={theme}
              setTheme={setTheme}
            >
              <Profile />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

