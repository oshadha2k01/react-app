import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

const validateName = name => {
  if (!name) return 'Name is required';
  if (name.length < 2) return 'Name must be at least 2 characters';
  return '';
};

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

const Register = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleNameChange = e => {
    setName(e.target.value);
    setNameError(validateName(e.target.value));
  };

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
    const nErr = validateName(name);
    const uErr = validateUsername(username);
    const pErr = validatePassword(password);
    setNameError(nErr);
    setUsernameError(uErr);
    setPasswordError(pErr);
    setSubmitted(true);
    if (!nErr && !uErr && !pErr) {
      // Save user to users array in localStorage
      const user = { name, username, password };
      let users = JSON.parse(localStorage.getItem('users')) || [];
      if (users.find(u => u.username === username)) {
        Swal.fire({
          icon: 'error',
          title: 'Username Exists',
          text: 'This username is already registered.',
        });
        return;
      }
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful!',
        text: 'You can now login with your credentials.',
        timer: 1800,
        showConfirmButton: false,
      });
      setTimeout(() => navigate('/login'), 1800);
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
        <h3 className="mb-3 text-center">Register</h3>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className={`form-control ${nameError && submitted ? 'is-invalid' : ''}`}
            value={name}
            onChange={handleNameChange}
            autoFocus
          />
          {nameError && (
            <div className="invalid-feedback">{nameError}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className={`form-control ${usernameError && submitted ? 'is-invalid' : ''}`}
            value={username}
            onChange={handleUsernameChange}
          />
          {usernameError && (
            <div className="invalid-feedback">{usernameError}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className={`form-control ${passwordError && submitted ? 'is-invalid' : ''}`}
            value={password}
            onChange={handlePasswordChange}
          />
          {passwordError && (
            <div className="invalid-feedback">{passwordError}</div>
          )}
        </div>
        <button className="btn btn-primary w-100" type="submit">
          Register
        </button>
        <div className="mt-3 text-center">
          Have your account?{' '}
          <Link to="/login">SignIn</Link>
        </div>
      </form>
    </div>
  );
};

Register.propTypes = {
  // If Register receives props, define them here. If not, leave this as an empty object.
};

export default Register;
