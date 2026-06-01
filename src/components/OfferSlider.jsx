import { useState, useEffect } from 'react'

const slides = [
  {
    id: 1,
    title: 'Mega Sale — Up to 70% Off',
    subtitle: 'On Premium Smartphones',
    bg: 'from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-slate-950 border border-blue-100 dark:border-blue-900',
    accent: 'text-blue-700 dark:text-amber-450 bg-blue-100/60 dark:bg-white/10',
    tag: '🔥 Limited Time',
    cta: 'Shop Now',
    category: 'Mobiles'
  },
  {
    id: 2,
    title: 'New Arrivals',
    subtitle: 'Latest TVs — OLED, QLED & More',
    bg: 'from-purple-50 to-pink-100 dark:from-purple-950 dark:to-slate-950 border border-purple-100 dark:border-purple-900',
    accent: 'text-purple-700 dark:text-purple-400 bg-purple-100/60 dark:bg-white/10',
    tag: '✨ Just Launched',
    cta: 'Explore',
    category: 'TVs'
  },
  {
    id: 3,
    title: 'Accessories Fest',
    subtitle: 'Headphones, Watches & Gadgets',
    bg: 'from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-slate-950 border border-emerald-100 dark:border-emerald-900',
    accent: 'text-emerald-700 dark:text-emerald-400 bg-emerald-100/60 dark:bg-white/10',
    tag: '🎧 Top Picks',
    cta: 'Discover',
    category: 'Accessories'
  },
  {
    id: 4,
    title: 'EMI Starting ₹999/mo',
    subtitle: 'No Cost EMI on High-End Laptops',
    bg: 'from-orange-50 to-red-100 dark:from-orange-950 dark:to-slate-950 border border-orange-100 dark:border-orange-900',
    accent: 'text-orange-700 dark:text-orange-400 bg-orange-100/60 dark:bg-white/10',
    tag: '💳 Easy Finance',
    cta: 'Apply Now',
    category: 'Laptops'
  },
]

export default function OfferSlider({ setSelectedCategory }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % slides.length), 4000)
    return () => clearInterval(timer)
  }, [])

  const slide = slides[current]

  const handleSlideClick = () => {
    if (setSelectedCategory) {
      // Set the active category matching the slide
      setSelectedCategory(slide.category)
      
      // Smoothly scroll the user to the products listings section
      setTimeout(() => {
        const element = document.getElementById('products-section')
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 50)
    }
  }

  return (
    <div 
      onClick={handleSlideClick}
      className={`relative rounded-2xl overflow-hidden bg-gradient-to-r ${slide.bg} transition-all duration-700 cursor-pointer hover:shadow-md`} 
      style={{ minHeight: '200px' }}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-12 w-48 h-48 rounded-full border-2 border-slate-400/30" />
        <div className="absolute -bottom-8 right-4 w-72 h-72 rounded-full border border-slate-400/20" />
        <div className="absolute top-0 left-1/2 w-px h-full bg-slate-400/10" />
      </div>
      <div className="relative z-10 px-8 py-10 md:py-14 max-w-2xl">
        <span className={`inline-block text-xs font-bold ${slide.accent} px-3 py-1.5 rounded-full mb-3 uppercase tracking-wider font-extrabold shadow-sm border border-slate-200/20`}>
          {slide.tag}
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white mb-2 leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
          {slide.title}
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg mb-6 font-semibold">{slide.subtitle}</p>
        <button 
          onClick={(e) => {
            // Prevent event double firing but still trigger slide click behavior
            e.stopPropagation()
            handleSlideClick()
          }}
          className="bg-blue-600 hover:bg-blue-750 dark:bg-amber-400 dark:hover:bg-amber-300 text-white dark:text-slate-900 font-extrabold px-7 py-2.5 rounded-xl text-sm transition-all hover:scale-105 active:scale-95 shadow cursor-pointer"
        >
          {slide.cta} →
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 right-6 flex gap-1.5 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation()
              setCurrent(i)
            }}
            className={`rounded-full transition-all cursor-pointer ${i === current ? 'w-6 h-2 bg-blue-600 dark:bg-amber-400' : 'w-2 h-2 bg-slate-400/50 dark:bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  )
}
