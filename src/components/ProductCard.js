import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="col-md-3 mb-4">
      <div className="card product-card h-100">
        <div className="product-image-wrapper">
          <img
            src={product.image}
            className="card-img-top product-image"
            alt={product.title}
          />
        </div>
        <div className="card-body">
          <h5 className="card-title">{product.title}</h5>
          <p className="card-text">${product.price}</p>
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
        `}
      </style>
    </div>
  );
};

export default ProductCard;
