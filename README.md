# Shopora React E-Commerce App

A modern, responsive e-commerce web application built with React.  
Features user authentication, product browsing, cart, favourites, profile management, and PDF invoice generation.

---

## 🚀 Live Demo

[Live Demo: https://react-app-ivory-six.vercel.app](https://react-app-ivory-six.vercel.app)

---

## Features

- **User Registration & Login**  
  Secure registration and login with validation.

- **Product Catalog**  
  Browse products by category, with responsive grid and filtering.

- **Product Details & Purchase**  
  View product details and purchase with billing/payment modal and PDF invoice.

- **Cart & Favourites**  
  Add/remove products to cart and favourites (unique per user).

- **Profile Management**  
  Edit profile in a modal, delete account, and logout.

- **Responsive Design**  
  Fully responsive for all devices.

- **SweetAlert2 Notifications**  
  Friendly alerts for all user actions.

- **PDF Invoice**  
  Download invoice after purchase.

---

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/oshadha2k01/react-app.git
   cd react-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the app locally**
   ```bash
   npm start
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

---

## Tech Stack

- React
- React Router
- SweetAlert2
- jsPDF
- Bootstrap 5 (via CDN or your own setup)
- React Icons

---

## Folder Structure

```
src/
  components/      # Reusable UI components (NavBar, ProductCard, Filter, etc.)
  data/            # Static product data
  pages/           # Page components (Login, Register, Profile, Cart, Favourites, ProductDetails)
  App.js           # Main app component
  index.js         # Entry point
  index.css        # Global styles
```

---

## Customization

- To add products, edit `src/data/products.js`.
- To change branding, update the NavBar and README.
- To deploy, use [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).

---

## License

MIT

---

## Author

- [Oshadha Pathiraja](https://github.com/oshadha2k01)

---
