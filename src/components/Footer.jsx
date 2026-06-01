export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 mt-16 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-slate-800 dark:text-white font-bold text-lg mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Y<span className="text-blue-600 dark:text-blue-400">o</span>ki
          </h3>
          <p className="text-sm leading-relaxed">India's most trusted online shopping destination. Premium products, unbeatable prices.</p>
        </div>
        <div>
          <h4 className="text-slate-800 dark:text-white font-extrabold mb-3 text-xs uppercase tracking-wider">Company</h4>
          <ul className="space-y-2 text-sm font-semibold">
            {['About Us', 'Careers', 'Press', 'Blog'].map(item => (
              <li key={item}><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{item}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-slate-800 dark:text-white font-extrabold mb-3 text-xs uppercase tracking-wider">Support</h4>
          <ul className="space-y-2 text-sm font-semibold">
            {['Help Center', 'Contact Us', 'Returns', 'Track Order'].map(item => (
              <li key={item}><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{item}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-slate-800 dark:text-white font-extrabold mb-3 text-xs uppercase tracking-wider">Legal</h4>
          <ul className="space-y-2 text-sm font-semibold">
            {['Terms & Conditions', 'Privacy Policy', 'Cookie Policy', 'Refund Policy'].map(item => (
              <li key={item}><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{item}</a></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-100 dark:border-slate-800/80 px-4 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-semibold">© 2025 Yoki Shop. All rights reserved.</p>
          <div className="flex gap-4 font-semibold">
            {['Twitter', 'Instagram', 'Facebook', 'YouTube'].map(social => (
              <a key={social} href="#" className="text-xs hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{social}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
