import React from 'react';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const NavBar = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const currentUser = isAuthenticated ? JSON.parse(localStorage.getItem('currentUser')) : null;

  return (
    <nav
      className="navbar custom-navbar mb-4"
      style={{ top: 0, position: 'fixed', zIndex: 1020, width: '100%' }}
    >
      <div className="container d-flex justify-content-between align-items-center">
        <span
          className="navbar-brand mb-0 h1 text-white fw-semibold"
          style={{ fontSize: '1.7rem', letterSpacing: '1px', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Shopora
        </span>
        <div className="d-flex align-items-center gap-4">
          <span
            className="nav-link text-white d-flex align-items-center"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/cart')}
          >
            <FaShoppingCart size={20} className="me-1" />
            My Cart
          </span>
          <span
            className="nav-link text-white d-flex align-items-center"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/favourites')}
          >
            <FaHeart size={20} className="me-1" />
            Favourites
          </span>
          {isAuthenticated && currentUser ? (
            <span
              className="nav-link text-white d-flex align-items-center"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/profile')}
            >
              Hi, {currentUser.name}
            </span>
          ) : (
            <span
              className="nav-link text-white d-flex align-items-center"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/login')}
            >
              Login
            </span>
          )}
        </div>
      </div>
      <style>
        {`
          .custom-navbar {
            background: linear-gradient(90deg, #0a2342 60%, #185adb 100%);
            box-shadow: 0 4px 16px rgba(10,35,66,0.12);
            padding: 0.5rem 0;
            min-height: 48px;
            width: 100vw;
            left: 0;
          }
          .custom-navbar .navbar-brand {
            color: #fff !important;
            display: flex;
            align-items: center;
          }
          .custom-navbar .navbar-brand i {
            font-size: 1.5rem;
          }
          .custom-navbar .nav-link {
            color: #fff !important;
            font-weight: 500;
            font-size: 1.08rem;
            transition: color 0.2s;
          }
          .custom-navbar .nav-link:hover {
            color: #ffd700 !important;
          }
        `}
      </style>
    </nav>
  );
};

export default NavBar;

