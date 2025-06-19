import React from 'react';
import { FaCartPlus, FaHeart } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const getCurrentUserKey = (type) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  return currentUser ? `${type}_${currentUser.username}` : null;
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleAddToCart = () => {
    const key = getCurrentUserKey('cart');
    if (!key) {
      Swal.fire({
        icon: 'warning',
        title: 'Please Login',
        text: 'You must be logged in to add to cart.',
        timer: 1200,
        showConfirmButton: false,
      });
      return;
    }
    let cart = JSON.parse(localStorage.getItem(key)) || [];
    const exists = cart.find(item => item.id === product.id);
    if (!exists) {
      cart.push({ ...product, quantity: 1 });
      localStorage.setItem(key, JSON.stringify(cart));
      Swal.fire({
        icon: 'success',
        title: 'Added to Cart!',
        text: `${product.title} has been added to your cart.`,
        timer: 1200,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Already in Cart',
        text: `${product.title} is already in your cart.`,
        timer: 1200,
        showConfirmButton: false,
      });
    }
  };

  const handleAddToFavourites = () => {
    const key = getCurrentUserKey('favourites');
    if (!key) {
      Swal.fire({
        icon: 'warning',
        title: 'Please Login',
        text: 'You must be logged in to add to favourites.',
        timer: 1200,
        showConfirmButton: false,
      });
      return;
    }
    let favs = JSON.parse(localStorage.getItem(key)) || [];
    const exists = favs.find(item => item.id === product.id);
    if (!exists) {
      favs.push(product);
      localStorage.setItem(key, JSON.stringify(favs));
      Swal.fire({
        icon: 'success',
        title: 'Added to Favourites!',
        text: `${product.title} has been added to your favourites.`,
        timer: 1200,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Already in Favourites',
        text: `${product.title} is already in your favourites.`,
        timer: 1200,
        showConfirmButton: false,
      });
    }
  };

  const handleBuy = () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      Swal.fire({
        icon: 'warning',
        title: 'Please Login',
        text: 'You must be logged in to buy products.',
        timer: 1800,
        showConfirmButton: false,
      }).then(() => {
        navigate(`/login?redirect=/product/${product.id}`);
      });
      return;
    }
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex">
      <div className="card product-card h-100 w-100 position-relative d-flex flex-column">
        <div className="product-image-wrapper">
          <img
            src={product.image}
            className="card-img-top product-image"
            alt={product.title}
          />
          <div className="product-icons position-absolute top-0 end-0 p-2 d-flex flex-column gap-2">
            <button
              className="btn btn-light btn-sm rounded-circle shadow-sm mb-1"
              title="Add to Cart"
              onClick={handleAddToCart}
            >
              <FaCartPlus size={16} color="#185adb" />
            </button>
            <button
              className="btn btn-light btn-sm rounded-circle shadow-sm"
              title="Add to Favourites"
              onClick={handleAddToFavourites}
            >
              <FaHeart size={16} color="#185adb" />
            </button>
          </div>
        </div>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{product.title}</h5>
          <p className="card-text">${product.price}</p>
          <button className="btn btn-primary mt-auto" onClick={handleBuy}>
            Buy Now 
          </button>
        </div>
      </div>
      <style>
        {`
          .product-card {
            transition: box-shadow 0.3s, transform 0.3s;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            cursor: pointer;
          }
          .product-card:hover {
            box-shadow: 0 8px 24px rgba(0,0,0,0.18);
            transform: scale(1.03);
          }
          .product-image-wrapper {
            width: 100%;
            height: 220px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            background: #fff;
            position: relative;
          }
          .product-image {
            max-width: 100%;
            max-height: 100%;
            width: auto;
            height: 100%;
            object-fit: contain;
            transition: transform 0.3s;
          }
          .product-card:hover .product-image {
            transform: scale(1.08);
          }
          .product-icons button {
            background: rgba(255,255,255,0.95);
            border: none;
          }
          .product-icons button:hover svg {
            color: #0a2342;
          }
        `}
      </style>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    image: PropTypes.string.isRequired,
    category: PropTypes.string,
    // Add other product fields as needed
  }).isRequired,
};

export default ProductCard;
