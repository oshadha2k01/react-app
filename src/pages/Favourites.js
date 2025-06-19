import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FaTrashAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';

const getCurrentUserKey = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  return currentUser ? `favourites_${currentUser.username}` : null;
};

const Favourites = () => {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    const key = getCurrentUserKey();
    if (key) {
      const stored = JSON.parse(localStorage.getItem(key)) || [];
      setFavourites(stored);
    } else {
      setFavourites([]);
    }
  }, []);

  const handleRemoveFavourite = (id) => {
    const key = getCurrentUserKey();
    const updatedFavs = favourites.filter(item => item.id !== id);
    setFavourites(updatedFavs);
    if (key) {
      localStorage.setItem(key, JSON.stringify(updatedFavs));
    }
    Swal.fire({
      icon: 'success',
      title: 'Removed!',
      text: 'Product removed from favourites.',
      timer: 1200,
      showConfirmButton: false,
    });
  };

  return (
    <div className="container">
      <h3 className="mb-4 text-center">My Favourites</h3>
      {favourites.length === 0 ? (
        <div className="text-center">You have no favourite products.</div>
      ) : (
        <div className="row justify-content-center">
          <div className="col-12 col-md-8">
            <ul className="list-group mb-3">
              {favourites.map(item => (
                <li key={item.id} className="list-group-item d-flex align-items-center flex-wrap">
                  <img src={item.image} alt={item.title} style={{ width: 60, height: 60, objectFit: 'contain', marginRight: 16 }} />
                  <div className="flex-grow-1">
                    <div className="fw-bold">{item.title}</div>
                    <div className="text-muted">${item.price}</div>
                  </div>
                  <div className="fw-bold fs-5">{item.category}</div>
                  <button
                    className="btn btn-link text-danger ms-2"
                    title="Remove from Favourites"
                    style={{ fontSize: 20 }}
                    onClick={() => handleRemoveFavourite(item.id)}
                  >
                    <FaTrashAlt />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

Favourites.propTypes = {
  // If Favourites receives props, define them here. If not, leave this as an empty object.
};

export default Favourites;
