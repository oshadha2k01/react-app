import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import products from './data/products';
import ProductCard from './components/ProductCard';
import Filter from './components/Filter';
import NavBar from './components/NavBar';
import Login from '././pages/Login';
import Register from '././pages/Register';
import Profile from '././pages/Profile';
import ProductDetails from '././pages/ProductDetails';
import Cart from '././pages/Cart';
import Favourites from '././pages/Favourites';

const categories = [...new Set(products.map(p => p.category))];

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : products;

  return (
    <Router>
      <NavBar />
      <div className="container" style={{ marginTop: '80px' }}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Filter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
                <div className="row">
                  {filteredProducts.map(product => (
                    <ProductCard product={product} key={product.id} />
                  ))}
                </div>
              </>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/favourites" element={<Favourites />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

