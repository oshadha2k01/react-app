import React from 'react';
import PropTypes from 'prop-types';

const Filter = ({ categories, selectedCategory, onCategoryChange, searchValue, onSearchChange }) => {
  return (
    <div className="mb-4 d-flex flex-wrap align-items-center gap-3">
      <input
        type="text"
        className="form-control"
        style={{ maxWidth: 250 }}
        placeholder="Search products..."
        value={searchValue}
        onChange={e => onSearchChange(e.target.value)}
        aria-label="Search products"
      />
      <select
        className="form-select"
        style={{ maxWidth: 200 }}
        value={selectedCategory}
        onChange={e => onCategoryChange(e.target.value)}
        aria-label="Filter by category"
      >
        <option value="">All Categories</option>
        {categories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
    </div>
  );
};

Filter.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedCategory: PropTypes.string.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  searchValue: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

export default Filter;
