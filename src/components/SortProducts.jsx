const sortOptions = [
  { value: '', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A – Z' },
  { value: 'name-desc', label: 'Name: Z – A' },
]

export default function SortProducts({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-500 font-medium whitespace-nowrap">Sort by:</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="text-sm border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer transition-colors"
      >
        {sortOptions.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}
