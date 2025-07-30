# Shopora React E-Commerce App

A modern, responsive e-commerce web application built with React.  
Features user authentication (including Google OAuth), product browsing, cart, favourites, profile management, and PDF invoice generation.

---

## 🚀 Live Demo

[Live Demo: https://react-app-ivory-six.vercel.app](https://react-app-ivory-six.vercel.app)

---

## Features

- **User Registration & Login**  
  Secure registration and login with validation.
- **Google OAuth Authentication**  
  Login with your Google account using Firebase Authentication.
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

3. **Set up Firebase for Google OAuth**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Enable Google Sign-In in the Authentication section.
   - Add your Firebase config to environment variables as described below.

### Environment Variables Setup

For local development, create a `.env` file in the root directory:

```bash
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

For Vercel deployment:
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable with the same names as above
4. Redeploy your application

4. **Run the app locally**
   ```bash
   npm start
   ```

5. **Build for production**
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
-Firebase Authentication (Google OAuth)

---

## Folder Structure

```
src/
  components/      # Reusable UI components (NavBar, ProductCard, Filter, etc.)
  data/            # Static product data
  pages/           # Page components (Login, Register, Profile, Cart, Favourites, ProductDetails)
  firebase.js      # Firebase config and initialization for OAuth
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

## Troubleshooting OAuth2 Issues

### Common Issues and Solutions:

1. **"Google Login Failed" Error**
   - Ensure all Firebase environment variables are correctly set
   - Check that Google Sign-In is enabled in Firebase Console
   - Verify your domain is authorized in Firebase Authentication settings

2. **"Popup was blocked" Error**
   - Allow popups for your domain in browser settings
   - Try using a different browser
   - Check if ad-blockers are interfering

3. **"Unauthorized domain" Error**
   - Add your domain to authorized domains in Firebase Console
   - For localhost: add `localhost` and `127.0.0.1`
   - For production: add your Vercel domain

4. **Environment Variables Not Working**
   - Restart your development server after adding `.env` file
   - For Vercel: redeploy after adding environment variables
   - Ensure variable names start with `REACT_APP_`

5. **Firebase Configuration Issues**
   - Double-check your Firebase project settings
   - Ensure the Firebase project is in the correct region
   - Verify API keys and project IDs match

### Getting Firebase Configuration:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon (⚙️) next to "Project Overview"
4. Select "Project settings"
5. Scroll down to "Your apps" section
6. Click the web app icon (</>)
7. Copy the configuration values

---

## License

MIT

---

## Author

- [Oshadha Pathiraja](https://github.com/oshadha2k01)

---
