import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { updateProfile } from '../slices/authSlice'

export default function Profile() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.auth.user)
  const orders = useSelector(state => state.orders.list)
  const wishlistCount = useSelector(state => state.wishlist.items.length)
  const cartCount = useSelector(state => state.cart.items.length)

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...user })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    dispatch(updateProfile(form))
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  // Pure React scroll to top on mount (no window references used)
  useEffect(() => {
    document.documentElement.scrollTop = 0
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-250 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {saved && (
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-455 text-sm px-4 py-3 rounded-xl mb-4 font-bold flex items-center gap-2">
            ✓ Profile updated successfully!
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 mb-5 text-white relative overflow-hidden shadow">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-black text-white border-2 border-white/30">
              {user.name ? user.name.charAt(0).toUpperCase() : 'Y'}
            </div>
            <div>
              <h2 className="text-xl font-black capitalize">{user.name}</h2>
              <p className="text-blue-100 text-xs font-semibold mt-0.5">{user.email}</p>
              <p className="text-blue-100 text-xs font-semibold">{user.phone || '+91 99999 xxxxx'}</p>
            </div>
          </div>
        </div>

        {/* Clickable Stats cards connected to respective pages */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Orders', value: orders.length, icon: '📦', link: '/orders' },
            { label: 'Wishlist', value: wishlistCount, icon: '♥', link: '/wishlist' },
            { label: 'In Cart', value: cartCount, icon: '🛒', link: '/cart' },
          ].map(stat => (
            <Link
              key={stat.label}
              to={stat.link}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200/50 dark:border-slate-800 text-center transition-all hover:scale-105 hover:shadow active:scale-95 block cursor-pointer"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <p className="text-2xl font-black text-slate-800 dark:text-white">{stat.value}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5">{stat.label}</p>
            </Link>
          ))}
        </div>

        {/* Profile Form */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-800 transition-colors">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-black text-slate-800 dark:text-white text-lg">Profile Details</h3>
            {!editing && (
              <button
                onClick={() => { setEditing(true); setForm({ ...user }) }}
                className="text-xs bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-400 font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>

          <div className="space-y-4">
            {[
              { label: 'Full Name', key: 'name', type: 'text', icon: '👤' },
              { label: 'Email Address', key: 'email', type: 'email', icon: '📧' },
              { label: 'Phone Number', key: 'phone', type: 'tel', icon: '📞' },
              { label: 'Delivery Address', key: 'address', type: 'textarea', icon: '🏠' },
            ].map(field => (
              <div key={field.key}>
                <label className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">{field.label}</label>
                {editing ? (
                  field.type === 'textarea' ? (
                    <textarea
                      value={form[field.key] || ''}
                      onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                      placeholder="Enter your delivery address"
                      rows={3}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-semibold outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={form[field.key] || ''}
                      onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-semibold outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  )
                ) : (
                  <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3">
                    <span className="text-base mt-0.5">{field.icon}</span>
                    <p className={`text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-pre-wrap ${field.key === 'name' ? 'capitalize' : ''}`}>
                      {user[field.key] || 'Not specified'}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {editing && (
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 hover:bg-blue-755 text-white font-extrabold py-3.5 rounded-xl text-sm transition-all shadow cursor-pointer active:scale-98"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold py-3.5 rounded-xl text-sm transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
