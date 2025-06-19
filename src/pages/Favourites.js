import React, { useEffect, useState } from 'react';

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
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favourites;
