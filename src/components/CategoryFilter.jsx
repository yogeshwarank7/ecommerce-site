const categories = [
  { label: 'All', icon: '🛒' },
  { label: 'Mobiles', icon: '📱' },
  { label: 'Laptops', icon: '💻' },
  { label: 'TVs', icon: '📺' },
  { label: 'Accessories', icon: '🎧' },
]

export default function CategoryFilter({ selected, onSelect }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {categories.map(({ label, icon }) => {
        const active = selected === (label === 'All' ? '' : label)
        return (
          <button
            key={label}
            onClick={() => onSelect(label === 'All' ? '' : label)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              active
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-700'
            }`}
          >
            <span className="text-base">{icon}</span>
            {label}
          </button>
        )
      })}
    </div>
  )
}
