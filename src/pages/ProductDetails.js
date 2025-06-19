import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import products from '../data/products';
import Swal from 'sweetalert2';
import { FaCreditCard, FaMoneyBillWave, FaRegCreditCard, FaTimesCircle } from 'react-icons/fa';
import jsPDF from 'jspdf';
import PropTypes from 'prop-types';

const paymentOptions = [
  { value: 'credit', label: 'Credit Card', icon: <FaCreditCard /> },
  { value: 'debit', label: 'Debit Card', icon: <FaRegCreditCard /> },
  { value: 'cod', label: 'Cash on Delivery', icon: <FaMoneyBillWave /> },
];

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === parseInt(id));
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [payment, setPayment] = useState(paymentOptions[0].value);

  // Card payment fields
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expDate, setExpDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardErrors, setCardErrors] = useState({});
  // Billing info
  const [billing, setBilling] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: ''
  });
  const [billingErrors, setBillingErrors] = useState({});

  const firstInputRef = useRef();

  useEffect(() => {
    if (showModal && firstInputRef.current) {
      firstInputRef.current.focus();
    }
    function handleEsc(e) {
      if (e.key === 'Escape' && showModal) {
        setShowModal(false);
      }
    }
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [showModal]);

  if (!product) {
    return <div className="text-center mt-5">Product not found.</div>;
  }

  const handleProcessBuy = () => {
    setShowModal(true);
  };

  const validateBillingFields = () => {
    const errors = {};
    if (!billing.fullName) errors.fullName = 'Full name required';
    if (!billing.email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(billing.email)) errors.email = 'Valid email required';
    if (!billing.phone || !/^\d{7,15}$/.test(billing.phone)) errors.phone = 'Valid phone required';
    if (!billing.address) errors.address = 'Address required';
    return errors;
  };

  const validateCardFields = () => {
    const errors = {};
    if (!cardName) errors.cardName = 'Account holder name required';
    if (!cardNumber || !/^\d{16}$/.test(cardNumber)) errors.cardNumber = 'Valid 16-digit card number required';
    if (!expDate || !/^\d{2}\/\d{2}$/.test(expDate)) errors.expDate = 'Valid expiry (MM/YY) required';
    if (!cvv || !/^\d{3,4}$/.test(cvv)) errors.cvv = 'Valid CVV required';
    return errors;
  };

  const handleBillingChange = e => {
    setBilling({ ...billing, [e.target.name]: e.target.value });
  };

  const handleConfirm = () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      Swal.fire({
        icon: 'warning',
        title: 'Please Register or Login',
        text: 'You must be registered and logged in to confirm purchase.',
        showCancelButton: true,
        confirmButtonText: 'Register',
        cancelButtonText: 'Cancel',
      }).then(result => {
        if (result.isConfirmed) {
          navigate('/register');
        }
      });
      return;
    }
    const billingErrs = validateBillingFields();
    setBillingErrors(billingErrs);
    if (Object.keys(billingErrs).length > 0) return;

    if (payment === 'credit' || payment === 'debit') {
      const errors = validateCardFields();
      setCardErrors(errors);
      if (Object.keys(errors).length > 0) return;
    }
    setShowModal(false);

    // Generate Invoice PDF
    const doc = new jsPDF();
    const orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const now = new Date();
    const dateStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();

    doc.setFontSize(22);
    doc.text('Shopora', 105, 18, { align: 'center' });
    doc.setFontSize(14);
    doc.text(`Invoice`, 105, 28, { align: 'center' });
    doc.setFontSize(11);
    doc.text(`Order ID: ${orderId}`, 14, 38);
    doc.text(`Date: ${dateStr}`, 150, 38);

    doc.setFontSize(13);
    doc.text('Billing Information:', 14, 50);
    doc.setFontSize(11);
    doc.text(`Name: ${billing.fullName}`, 14, 56);
    doc.text(`Email: ${billing.email}`, 14, 62);
    doc.text(`Phone: ${billing.phone}`, 14, 68);
    doc.text(`Address: ${billing.address}`, 14, 74);

    doc.setFontSize(13);
    doc.text('Product:', 14, 86);
    let y = 92;
    doc.setFontSize(11);
    doc.text(`${product.title} (${product.category})`, 14, y);
    doc.text(`Qty: ${quantity}`, 120, y);
    doc.text(`$${(product.price * quantity).toFixed(2)}`, 160, y, { align: 'right' });

    doc.setFontSize(12);
    doc.text(`Total: $${(product.price * quantity).toFixed(2)}`, 14, y + 10);
    doc.text(`Payment Method: ${paymentOptions.find(opt => opt.value === payment).label}`, 14, y + 17);

    doc.setFontSize(10);
    doc.text('Thank you for shopping with Shopora!', 105, y + 29, { align: 'center' });

    doc.save(`Shopora_Invoice_${orderId}.pdf`);

    Swal.fire({
      icon: 'success',
      title: 'Purchase Confirmed!',
      html: `<div>
        <b>${product.title}</b><br/>
        Quantity: ${quantity}<br/>
        Total: $${(product.price * quantity).toFixed(2)}<br/>
        Payment: ${paymentOptions.find(opt => opt.value === payment).label}<br/>
        <small>Your invoice has been downloaded.</small>
      </div>`,
      timer: 2500,
      showConfirmButton: false,
    });
    setTimeout(() => navigate('/'), 2500);
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card shadow p-3">
          <img
            src={product.image}
            alt={product.title}
            className="card-img-top mb-3"
            style={{ maxHeight: 300, objectFit: 'contain' }}
          />
          <div className="card-body">
            <h3 className="card-title mb-3">{product.title}</h3>
            <h5 className="card-text mb-2 text-primary">${product.price}</h5>
            <div className="mb-2"><strong>Category:</strong> {product.category}</div>
            <button className="btn btn-primary w-100 mt-3" onClick={handleProcessBuy}>
              Process to Buy
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Modal */}
      {showModal && (
        <div
          className="modal fade show"
          role="dialog"
          aria-modal="true"
          aria-labelledby="billingModalTitle"
          style={{
            display: 'block',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1050,
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
          }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 1100, width: '100%', maxWidth: '98vw', margin: 'auto' }}>
            <div className="modal-content" style={{ borderRadius: 18, boxShadow: '0 8px 32px rgba(24,90,219,0.15)', padding: 16, maxHeight: '90vh', overflowY: 'auto' }}>
              <div className="modal-header border-0 pb-0" style={{ position: 'relative' }}>
                <h4 id="billingModalTitle" className="modal-title fw-bold" style={{ color: '#185adb' }}>Billing & Confirmation</h4>
                <button
                  type="button"
                  className="btn btn-link p-0"
                  style={{ position: 'absolute', right: 16, top: 8, fontSize: 26, color: '#888' }}
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                >
                  <FaTimesCircle />
                </button>
              </div>
              <div className="modal-body pt-0">
                <div className="row flex-wrap">
                  {/* Column 1: Product Details & Quantity */}
                  <div className="col-12 col-md-4 border-end mb-3 mb-md-0">
                    <div className="d-flex align-items-center mb-3">
                      <img src={product.image} alt={product.title} style={{ width: 60, height: 60, objectFit: 'contain', borderRadius: 8, marginRight: 16, border: '1px solid #eee' }} />
                      <div>
                        <div className="fw-bold" style={{ fontSize: 18 }}>{product.title}</div>
                        <div className="text-muted" style={{ fontSize: 14 }}>{product.category}</div>
                      </div>
                    </div>
                    <div className="mb-2"><strong>Price per item:</strong> ${product.price}</div>
                    <div className="mb-3">
                      <label className="form-label"><strong>Quantity:</strong></label>
                      <input
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
                        className="form-control"
                        style={{ width: 100, display: 'inline-block', marginLeft: 10 }}
                      />
                    </div>
                    <div className="mb-2 fs-5">
                      <strong>Total:</strong> <span className="text-success">${(product.price * quantity).toFixed(2)}</span>
                    </div>
                  </div>
                  {/* Column 2: Billing Information */}
                  <div className="col-12 col-md-4 border-end mb-3 mb-md-0">
                    <div className="border rounded p-3 mb-3" style={{ background: '#f8f9fa' }}>
                      <h6 className="fw-bold mb-3">Billing Information</h6>
                      <div className="mb-2">
                        <label className="form-label">Full Name</label>
                        <input
                          ref={firstInputRef}
                          type="text"
                          className={`form-control ${billingErrors.fullName ? 'is-invalid' : ''}`}
                          name="fullName"
                          value={billing.fullName}
                          onChange={handleBillingChange}
                          placeholder="Enter your full name"
                        />
                        {billingErrors.fullName && <div className="invalid-feedback">{billingErrors.fullName}</div>}
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className={`form-control ${billingErrors.email ? 'is-invalid' : ''}`}
                          name="email"
                          value={billing.email}
                          onChange={handleBillingChange}
                          placeholder="Enter your email"
                        />
                        {billingErrors.email && <div className="invalid-feedback">{billingErrors.email}</div>}
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Phone Number</label>
                        <input
                          type="tel"
                          className={`form-control ${billingErrors.phone ? 'is-invalid' : ''}`}
                          name="phone"
                          value={billing.phone}
                          onChange={handleBillingChange}
                          placeholder="Enter your phone number"
                        />
                        {billingErrors.phone && <div className="invalid-feedback">{billingErrors.phone}</div>}
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Address</label>
                        <input
                          type="text"
                          className={`form-control ${billingErrors.address ? 'is-invalid' : ''}`}
                          name="address"
                          value={billing.address}
                          onChange={handleBillingChange}
                          placeholder="Enter your address"
                        />
                        {billingErrors.address && <div className="invalid-feedback">{billingErrors.address}</div>}
                      </div>
                    </div>
                  </div>
                  {/* Column 3: Payment Options and Card Fields */}
                  <div className="col-12 col-md-4">
                    <div className="mb-3">
                      <label className="form-label"><strong>Payment Option:</strong></label>
                      <div className="d-flex gap-3 mt-2 flex-wrap">
                        {paymentOptions.map(opt => (
                          <label
                            key={opt.value}
                            className={`d-flex align-items-center border rounded px-3 py-2 shadow-sm ${payment === opt.value ? 'border-primary bg-light' : 'border-secondary'}`}
                            style={{ cursor: 'pointer', minWidth: 150, transition: 'box-shadow 0.2s' }}
                          >
                            <input
                              type="checkbox"
                              checked={payment === opt.value}
                              onChange={() => setPayment(opt.value)}
                              style={{ marginRight: 8 }}
                            />
                            <span style={{ fontSize: 20, marginRight: 8 }}>{opt.icon}</span>
                            <span className="fw-semibold">{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    {(payment === 'credit' || payment === 'debit') && (
                      <div className="border rounded p-3 mb-3" style={{ background: '#f8f9fa' }}>
                        <div className="mb-2">
                          <label className="form-label">Account Holder Name</label>
                          <input
                            type="text"
                            className={`form-control ${cardErrors.cardName ? 'is-invalid' : ''}`}
                            value={cardName}
                            onChange={e => setCardName(e.target.value)}
                            placeholder="Name on Card"
                          />
                          {cardErrors.cardName && <div className="invalid-feedback">{cardErrors.cardName}</div>}
                        </div>
                        <div className="mb-2">
                          <label className="form-label">Card Number</label>
                          <input
                            type="text"
                            className={`form-control ${cardErrors.cardNumber ? 'is-invalid' : ''}`}
                            value={cardNumber}
                            onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').slice(0,16))}
                            placeholder="1234 5678 9012 3456"
                            maxLength={16}
                          />
                          {cardErrors.cardNumber && <div className="invalid-feedback">{cardErrors.cardNumber}</div>}
                        </div>
                        <div className="row">
                          <div className="col">
                            <label className="form-label">Expiry (MM/YY)</label>
                            <input
                              type="text"
                              className={`form-control ${cardErrors.expDate ? 'is-invalid' : ''}`}
                              value={expDate}
                              onChange={e => setExpDate(e.target.value.replace(/[^0-9/]/g, '').slice(0,5))}
                              placeholder="MM/YY"
                              maxLength={5}
                            />
                            {cardErrors.expDate && <div className="invalid-feedback">{cardErrors.expDate}</div>}
                          </div>
                          <div className="col">
                            <label className="form-label">CVV</label>
                            <input
                              type="password"
                              className={`form-control ${cardErrors.cvv ? 'is-invalid' : ''}`}
                              value={cvv}
                              onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0,4))}
                              placeholder="CVV"
                              maxLength={4}
                            />
                            {cardErrors.cvv && <div className="invalid-feedback">{cardErrors.cvv}</div>}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0 d-flex justify-content-between">
                <button className="btn btn-outline-secondary px-4" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary px-4" onClick={handleConfirm}>
                  Confirm & Pay
                </button>
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

ProductDetails.propTypes = {
  // If ProductDetails receives props, define them here. If not, leave this as an empty object.
};

export default ProductDetails;
