import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from '../firebase'; // Make sure you have firebase.js configured and exported as 'app'
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { FcGoogle } from 'react-icons/fc';

const validateUsername = username => {
  if (!username) return 'Username is required';
  if (username.length < 3) return 'Username must be at least 3 characters';
  return '';
};

const validatePassword = password => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain a number';
  return '';
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const showPasswordTemporarily = () => {
    setShowPassword(true);
    setTimeout(() => setShowPassword(false), 1500);
  };
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const redirect = searchParams.get('redirect');

  const handleUsernameChange = e => {
    setUsername(e.target.value);
    setUsernameError(validateUsername(e.target.value));
  };

  const handlePasswordChange = e => {
    setPassword(e.target.value);
    setPasswordError(validatePassword(e.target.value));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const uErr = validateUsername(username);
    const pErr = validatePassword(password);
    setUsernameError(uErr);
    setPasswordError(pErr);
    setSubmitted(true);

    if (!uErr && !pErr) {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('currentUser', JSON.stringify(user));
        Swal.fire({
          icon: 'success',
          title: `Welcome, ${user.name}!`,
          text: 'Login successful.',
          timer: 1500,
          showConfirmButton: false,
        });
        setTimeout(() => {
          if (redirect) {
            navigate(redirect);
          } else {
            navigate('/');
          }
        }, 1500);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Invalid username or password.',
        });
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      
      // Add custom parameters for better OAuth experience
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Save user info in localStorage for your app logic
      const userData = {
        name: user.displayName,
        username: user.email,
        password: '', // Not used for Google users
        photoURL: user.photoURL,
        google: true
      };
      
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      // Optionally add to users array if not present
      let users = JSON.parse(localStorage.getItem('users')) || [];
      if (!users.find(u => u.username === user.email)) {
        users.push(userData);
        localStorage.setItem('users', JSON.stringify(users));
      }
      
      Swal.fire({
        icon: 'success',
        title: `Welcome, ${user.displayName || user.email}!`,
        text: 'Google login successful.',
        timer: 1500,
        showConfirmButton: false,
      });
      
      setTimeout(() => {
        if (redirect) {
          navigate(redirect);
        } else {
          navigate('/');
        }
      }, 1500);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      
      let errorMessage = 'Google login failed. Please try again.';
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Login was cancelled. Please try again.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked. Please allow popups for this site and try again.';
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = 'This domain is not authorized for Google login. Please contact support.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Google Login Failed',
        text: errorMessage,
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <form
        className="p-4 rounded shadow w-100"
        style={{ maxWidth: 400, background: '#fff' }}
        onSubmit={handleSubmit}
        noValidate
      >
        <h3 className="mb-3 text-center">Login</h3>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className={`form-control ${usernameError && submitted ? 'is-invalid' : ''}`}
            value={username}
            onChange={handleUsernameChange}
            autoFocus
          />
          {usernameError && (
            <div className="invalid-feedback">{usernameError}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <div className="position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className={`form-control ${passwordError && submitted ? 'is-invalid' : ''}`}
              value={password}
              onChange={handlePasswordChange}
              style={{ paddingRight: 40 }}
            />
            <span
              style={{
                position: 'absolute',
                top: '50%', // increased from 50% for more top margin
                right: 10,
                transform: 'translateY(-50%)',
                zIndex: 2,
                color: '#888',
                fontSize: 22,
                background: 'none',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                cursor: 'pointer'
              }}
              onClick={showPasswordTemporarily}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </span>
            {passwordError && (
              <div className="invalid-feedback d-block">{passwordError}</div>
            )}
          </div>
        </div>
        <button className="btn btn-primary w-100" type="submit">
          Login
        </button>

        {/* Oauthentication button with Google */}
        <div className="d-flex align-items-center my-4">
          <hr className="flex-grow border-gray-300" style={{ flexGrow: 1, borderColor: '#dee2e6' }} />
          <span className="px-3 text-sm text-gray-500 bg-white" style={{ fontSize: 14, color: '#888' }}>or</span>
          <hr className="flex-grow border-gray-300" style={{ flexGrow: 1, borderColor: '#dee2e6' }} />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-100 py-2 font-semibold text-gray-700 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-all duration-300 d-flex align-items-center justify-content-center gap-3 shadow-sm"
          style={{
            borderRadius: "5px",
            fontWeight: 500,
            border: '2px solid #e0e0e0',
            background: '#fff',
            color: '#444',
            transition: 'all 0.2s',
            boxShadow: '0 1px 2px rgba(60,64,67,.08)',
            marginBottom: 8,
            marginTop: 0,
            height: 44,
            fontSize: 15,
            gap: 8
          }}
        >
          <FcGoogle size={20} />
          Continue with Google
        </button>

        <div className="mt-3 text-center">
          Haven't your account?{' '}
          <Link to="/register" className="text-decoration-none">Register</Link>
        </div>
      </form>
    </div>
  );
};

Login.propTypes = {
};

export default Login;

