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
import PrivateRoute from './components/PrivateRoute';

const categories = [...new Set(products.map(p => p.category))];

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    const matchesSearch = p.title.toLowerCase().includes(searchValue.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
                  searchValue={searchValue}
                  onSearchChange={setSearchValue}
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
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/favourites" element={<PrivateRoute><Favourites /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

