# 🛒 Yoki E-Commerce

A feature-rich, modern e-commerce web application built with **React**, **Redux Toolkit**, **React Router**, and **Tailwind CSS**. Includes product browsing, cart, wishlist, checkout, order tracking, and user authentication — all with a sleek dark/light mode UI.

---

## 🚀 Features

- 🔐 **User Authentication** — Login with protected routes
- 🏠 **Home Page** — Product listing with search, category filter & sort
- 🛍️ **Product Details** — Detailed product view page
- 🛒 **Cart** — Add, remove, update item quantities
- ❤️ **Wishlist** — Save favourite products
- 💳 **Checkout** — Order placement flow
- 📦 **Orders** — View placed orders
- 🚚 **Order Tracking** — Track order status by Order ID
- 👤 **Profile** — User profile page
- 🌗 **Dark / Light Mode** — Theme toggle with localStorage persistence
- 📱 **Responsive Design** — Mobile-friendly layout

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI Library |
| React Router DOM v6 | Client-side routing |
| Redux Toolkit | Global state management |
| React Redux | Redux bindings |
| Tailwind CSS v4 | Utility-first styling |
| Vite | Build tool & dev server |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── CategoryFilter.jsx
│   ├── OfferSlider.jsx
│   ├── ProductCard.jsx
│   ├── SortProducts.jsx
│   └── ProtectedRoute.jsx
├── pages/
│   ├── Login.jsx
│   ├── Home.jsx
│   ├── ProductDetails.jsx
│   ├── Cart.jsx
│   ├── Wishlist.jsx
│   ├── Checkout.jsx
│   ├── Orders.jsx
│   ├── Tracking.jsx
│   └── Profile.jsx
├── slices/
│   ├── store.js
│   ├── authSlice.js
│   ├── cartSlice.js
│   ├── orderSlice.js
│   └── wishlistSlice.js
├── data/
│   └── products.js
├── App.jsx
└── main.jsx
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- npm

### Installation

```bash

# Navigate into the project
cd yoki-ecommerce

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

---



## 👨‍💻 Author

**Yogeshwaran K** — MERN Stack Developer  
📍 Coimbatore, Tamil Nadu  
🎓 B.Sc. IT | KGiSL MERN Stack Certified

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).