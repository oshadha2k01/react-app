import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaUserEdit, FaTrash, FaSave, FaSignOutAlt, FaUserCircle, FaTimesCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import PropTypes from 'prop-types';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  });
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [password, setPassword] = useState(user?.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const firstInputRef = useRef();

  useEffect(() => {
    if (!user) {
      Swal.fire({
        icon: 'warning',
        title: 'Not logged in',
        text: 'Please login to view your profile.',
      });
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (showModal && firstInputRef.current) {
      firstInputRef.current.focus();
    }
    function handleEsc(e) {
      if (e.key === 'Escape' && showModal) {
        setShowModal(false);
        setEditMode(false);
      }
    }
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [showModal]);

  const validate = () => {
    const errs = {};
    if (!name || name.length < 2) errs.name = 'Name must be at least 2 characters';
    if (!username || username.length < 3) errs.username = 'Username must be at least 3 characters';
    if (!password || password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (password && !/[A-Z]/.test(password)) errs.password = 'Password must contain an uppercase letter';
    if (password && !/[0-9]/.test(password)) errs.password = 'Password must contain a number';
    return errs;
  };

  const handleEdit = () => {
    setEditMode(true);
    setShowModal(true);
  };

  const handleSave = e => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      return;
    }
    const updatedUser = { name, username, password };
    // Update user in users array
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users = users.map(u =>
      u.username === user.username ? updatedUser : u
    );
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setEditMode(false);
    setShowModal(false);
    Swal.fire({
      icon: 'success',
      title: 'Profile Updated',
      timer: 1200,
      showConfirmButton: false,
    });
  };

  const handleDelete = () => {
    Swal.fire({
      icon: 'warning',
      title: 'Delete Account',
      text: 'Are you sure you want to delete your account? This cannot be undone.',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then(result => {
      if (result.isConfirmed) {
        // Remove user from users array
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users = users.filter(u => u.username !== user.username);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isAuthenticated');
        Swal.fire({
          icon: 'success',
          title: 'Account Deleted',
          timer: 1200,
          showConfirmButton: false,
        });
        setTimeout(() => navigate('/register'), 1200);
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <div className="p-4 rounded shadow w-100" style={{ maxWidth: 420, background: '#fff' }}>
        <div className="d-flex flex-column align-items-center mb-4">
          <FaUserCircle size={70} color="#185adb" />
          <h3 className="mt-2 mb-0">{user.name}</h3>
          <div className="text-muted">@{user.username}</div>
        </div>
        <>
          <div className="mb-3"><strong>Name:</strong> {user.name}</div>
          <div className="mb-3"><strong>Username:</strong> {user.username}</div>
          <div className="mb-3"><strong>Password:</strong> ******</div>
          <button className="btn btn-primary w-100 mb-2 d-flex align-items-center justify-content-center" onClick={handleEdit}>
            <FaUserEdit className="me-2" /> Edit Profile
          </button>
          <button className="btn btn-danger w-100 mb-2 d-flex align-items-center justify-content-center" onClick={handleDelete}>
            <FaTrash className="me-2" /> Delete Account
          </button>
          <button className="btn btn-secondary w-100 d-flex align-items-center justify-content-center" onClick={handleLogout}>
            <FaSignOutAlt className="me-2" /> Logout
          </button>
        </>
      </div>

      {/* Modal for Edit Profile */}
      {showModal && (
        <div
          className="modal fade show"
          role="dialog"
          aria-modal="true"
          aria-labelledby="editProfileTitle"
          style={{
            display: 'block',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1050,
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
          }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 500, width: '100%', maxWidth: '95vw', margin: 'auto' }}>
            <div className="modal-content" style={{ borderRadius: 18, boxShadow: '0 8px 32px rgba(24,90,219,0.15)', padding: 16, maxHeight: '90vh', overflowY: 'auto' }}>
              <div className="modal-header border-0 pb-0" style={{ position: 'relative' }}>
                <h4 id="editProfileTitle" className="modal-title fw-bold" style={{ color: '#185adb' }}>Edit Profile</h4>
                <button
                  type="button"
                  className="btn btn-link p-0"
                  style={{ position: 'absolute', right: 16, top: 8, fontSize: 26, color: '#888' }}
                  onClick={() => { setShowModal(false); setEditMode(false); }}
                  aria-label="Close"
                >
                  <FaTimesCircle />
                </button>
              </div>
              <div className="modal-body pt-0">
                <form onSubmit={handleSave}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Name</label>
                    <input
                      ref={firstInputRef}
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      value={name}
                      onChange={e => setName(e.target.value)}
                      autoFocus
                      style={{ background: '#f8f9fa' }}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Username</label>
                    <input
                      className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      style={{ background: '#f8f9fa' }}
                    />
                    {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Password</label>
                    <div className="input-group">
                      <input
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        style={{ background: '#f8f9fa' }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        tabIndex={-1}
                        onClick={() => setShowPassword(v => !v)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                      {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                    </div>
                  </div>
                  <div className="modal-footer border-0 pt-0 d-flex justify-content-between px-0">
                    <button className="btn btn-outline-secondary px-4" type="button" onClick={() => { setShowModal(false); setEditMode(false); }}>
                      Cancel
                    </button>
                    <button className="btn btn-primary px-4" type="submit">
                      <FaSave className="me-2" /> Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <style>{`
            @media (max-width: 600px) {
              .modal-content {
                padding: 8px !important;
                font-size: 0.98rem;
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

Profile.propTypes = {
  // If Profile receives props, define them here. If not, leave this as an empty object.
};

export default Profile;
