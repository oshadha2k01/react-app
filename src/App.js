import React, { useState } from 'react';
import products from './data/products';
import ProductCard from './components/ProductCard';
import Filter from './components/Filter';

const categories = [...new Set(products.map(p => p.category))];

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : products;

  return (
    <div className="container">
      <h2 className="mb-4 text-center">Product Store</h2>
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
    </div>
  );
};

export default App;

