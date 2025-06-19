import React, { useState, useRef, useEffect } from 'react';
import { FaShoppingCart, FaHeart, FaBars, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

const NavBar = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const currentUser = isAuthenticated ? JSON.parse(localStorage.getItem('currentUser')) : null;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef();
  const mobileMenuRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const NavLinks = (
    <>
      <span
        className="nav-link text-white d-flex align-items-center"
        style={{ cursor: 'pointer' }}
        onClick={() => { setMobileMenuOpen(false); navigate('/cart'); }}
      >
        <FaShoppingCart size={20} className="me-1" />
        My Cart
      </span>
      <span
        className="nav-link text-white d-flex align-items-center"
        style={{ cursor: 'pointer' }}
        onClick={() => { setMobileMenuOpen(false); navigate('/favourites'); }}
      >
        <FaHeart size={20} className="me-1" />
        Favourites
      </span>
      {isAuthenticated && currentUser ? (
        <div className="position-relative" ref={dropdownRef}>
          <button
            className="btn btn-light d-flex align-items-center mt-2 mt-md-0"
            type="button"
            onClick={() => setDropdownOpen((open) => !open)}
          >
            <span className="me-2">
              <img src={`https://ui-avatars.com/api/?name=${currentUser.name || currentUser.username}`} alt="avatar" style={{ width: 28, height: 28, borderRadius: '50%' }} />
            </span>
            {currentUser.name || currentUser.username}
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu show dropdown-menu-end" style={{ position: 'absolute', right: 0 }}>
              <button className="dropdown-item" type="button" onClick={() => { setDropdownOpen(false); setMobileMenuOpen(false); navigate('/profile'); }}>
                Profile
              </button>
              <button className="dropdown-item" type="button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <button className="btn btn-outline-primary me-2 mt-2 mt-md-0" onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}>Login</button>
          <button className="btn btn-primary mt-2 mt-md-0" onClick={() => { setMobileMenuOpen(false); navigate('/register'); }}>Sign Up</button>
        </>
      )}
    </>
  );

  return (
    <nav
      className="navbar custom-navbar mb-4"
      style={{ top: 0, position: 'fixed', zIndex: 1020, width: '100%' }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center px-4">
        <span
          className="navbar-brand mb-0 h1 text-white fw-semibold"
          style={{ fontSize: 'clamp(1.2rem, 4vw, 1.7rem)', letterSpacing: '1px', cursor: 'pointer' }}
          onClick={() => { setMobileMenuOpen(false); navigate('/'); }}
        >
          Shopora
        </span>
        {/* Hamburger for mobile */}
        <button
          className="btn d-md-none text-white"
          style={{ fontSize: 26 }}
          onClick={() => setMobileMenuOpen(open => !open)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        {/* Desktop nav links */}
        <div className="d-none d-md-flex align-items-center gap-4">
          {NavLinks}
        </div>
      </div>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div ref={mobileMenuRef} className="d-md-none bg-white w-100 position-absolute start-0 px-4 pt-3 pb-2 shadow" style={{ top: '100%', left: 0, zIndex: 1050 }}>
          <div className="d-flex flex-column align-items-start gap-2">
            {NavLinks}
          </div>
        </div>
      )}
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
            font-size: clamp(1rem, 2.5vw, 1.08rem);
            transition: color 0.2s;
          }
          .custom-navbar .nav-link:hover {
            color: #ffd700 !important;
          }
          @media (max-width: 767.98px) {
            .custom-navbar .navbar-brand {
              font-size: clamp(1.1rem, 5vw, 1.4rem) !important;
            }
            .custom-navbar .nav-link, .btn {
              font-size: clamp(0.95rem, 3vw, 1.05rem) !important;
            }
          }
        `}
      </style>
    </nav>
  );
};

NavBar.propTypes = {
  // If NavBar receives props, define them here. If not, leave this as an empty object.
};

export default NavBar;

