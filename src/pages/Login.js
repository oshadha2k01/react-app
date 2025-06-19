import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

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
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              className={`form-control ${passwordError && submitted ? 'is-invalid' : ''}`}
              value={password}
              onChange={handlePasswordChange}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              tabIndex={-1}
              onClick={() => setShowPassword(v => !v)}
              style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {passwordError && (
              <div className="invalid-feedback d-block">{passwordError}</div>
            )}
          </div>
        </div>
        <button className="btn btn-primary w-100" type="submit">
          Login
        </button>
        <div className="mt-3 text-center">
          Haven't your account?{' '}
          <Link to="/register">Signup</Link>
        </div>
      </form>
    </div>
  );
};

Login.propTypes = {
  // If Login receives props, define them here. If not, leave this as an empty object.
};

export default Login;
