import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { FaTimesCircle } from 'react-icons/fa';
import jsPDF from 'jspdf';

const paymentOptions = [
  { value: 'credit', label: 'Credit Card' },
  { value: 'debit', label: 'Debit Card' },
  { value: 'cod', label: 'Cash on Delivery' },
];

const getCurrentUserKey = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  return currentUser ? `cart_${currentUser.username}` : null;
};

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [payment, setPayment] = useState(paymentOptions[0].value);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expDate, setExpDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardErrors, setCardErrors] = useState({});
  const [billing, setBilling] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: ''
  });
  const [billingErrors, setBillingErrors] = useState({});

  // Load cart for current user
  useEffect(() => {
    const key = getCurrentUserKey();
    if (key) {
      const stored = JSON.parse(localStorage.getItem(key)) || [];
      setCart(stored);
      const qtyObj = {};
      stored.forEach(item => {
        qtyObj[item.id] = item.quantity || 1;
      });
      setQuantities(qtyObj);
    } else {
      setCart([]);
      setQuantities({});
    }
  }, []);

  // Save cart for current user on change
  useEffect(() => {
    const key = getCurrentUserKey();
    if (key) {
      localStorage.setItem(key, JSON.stringify(cart));
    }
  }, [cart]);

  const getTotal = () =>
    cart.reduce((sum, item) => sum + item.price * (quantities[item.id] || 1), 0);

  const handleProceedToPay = () => {
    if (!cart.length) {
      Swal.fire({
        icon: 'info',
        title: 'Cart is empty',
        text: 'Please add products to cart before proceeding to pay.',
      });
      return;
    }
    setShowModal(true);
  };

  const handleQuantityChange = (id, value) => {
    const qty = Math.max(1, Number(value));
    setQuantities(prev => ({ ...prev, [id]: qty }));
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, quantity: qty } : item
      )
    );
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
    doc.text('Products:', 14, 86);
    let y = 92;
    cart.forEach(item => {
      doc.setFontSize(11);
      doc.text(`${item.title} (${item.category})`, 14, y);
      doc.text(`Qty: ${quantities[item.id] || 1}`, 120, y);
      doc.text(`$${(item.price * (quantities[item.id] || 1)).toFixed(2)}`, 160, y, { align: 'right' });
      y += 7;
    });

    doc.setFontSize(12);
    doc.text(`Total: $${getTotal().toFixed(2)}`, 14, y + 6);
    doc.text(`Payment Method: ${paymentOptions.find(opt => opt.value === payment).label}`, 14, y + 13);

    doc.setFontSize(10);
    doc.text('Thank you for shopping with Shopora!', 105, y + 25, { align: 'center' });

    doc.save(`Shopora_Invoice_${orderId}.pdf`);

    Swal.fire({
      icon: 'success',
      title: 'Purchase Confirmed!',
      html: `<div>
        <b>Thank you for your purchase!</b><br/>
        Total: $${getTotal().toFixed(2)}<br/>
        Payment: ${paymentOptions.find(opt => opt.value === payment).label}<br/>
        <small>Your invoice has been downloaded.</small>
      </div>`,
      timer: 2500,
      showConfirmButton: false,
    });
    // Optionally, clear cart or redirect
  };

  return (
    <div className="container">
      <h3 className="mb-4 text-center">My Cart</h3>
      {cart.length === 0 ? (
        <div className="text-center">Your cart is empty.</div>
      ) : (
        <div className="row justify-content-center">
          <div className="col-md-8">
            <ul className="list-group mb-3">
              {cart.map(item => (
                <li key={item.id} className="list-group-item d-flex align-items-center">
                  <img src={item.image} alt={item.title} style={{ width: 60, height: 60, objectFit: 'contain', marginRight: 16 }} />
                  <div className="flex-grow-1">
                    <div className="fw-bold">{item.title}</div>
                    <div className="text-muted">${item.price} x {quantities[item.id] || 1}</div>
                  </div>
                  <div className="fw-bold fs-5">${(item.price * (quantities[item.id] || 1)).toFixed(2)}</div>
                </li>
              ))}
            </ul>
            <div className="text-end fs-5 mb-3">
              <strong>Total: ${getTotal().toFixed(2)}</strong>
            </div>
            <div className="text-end">
              <button
                className="btn btn-primary text-white"
                onClick={handleProceedToPay}
              >
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for payment and quantity adjustment */}
      {showModal && (
        <div
          className="modal fade show"
          style={{
            display: 'block',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1050,
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
          }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 1100, margin: 'auto', width: '95%' }}>
            <div className="modal-content" style={{ borderRadius: 18, boxShadow: '0 8px 32px rgba(24,90,219,0.15)' }}>
              <div className="modal-header border-0 pb-0" style={{ position: 'relative' }}>
                <h4 className="modal-title fw-bold" style={{ color: '#185adb' }}>Billing & Confirmation</h4>
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
                  <div className="col-12 col-md-4 border-end mb-3 mb-md-0" style={{ overflowX: 'auto' }}>
                    <ul className="list-group mb-3">
                      {cart.map(item => (
                        <li key={item.id} className="list-group-item d-flex align-items-center">
                          <img src={item.image} alt={item.title} style={{ width: 50, height: 50, objectFit: 'contain', marginRight: 12 }} />
                          <div className="flex-grow-1">
                            <div className="fw-bold">{item.title}</div>
                            <div className="text-muted">${item.price}</div>
                          </div>
                          <input
                            type="number"
                            min={1}
                            value={quantities[item.id] || 1}
                            onChange={e => handleQuantityChange(item.id, e.target.value)}
                            className="form-control"
                            style={{ width: 70, marginRight: 8 }}
                          />
                          <div className="fw-bold fs-6">${(item.price * (quantities[item.id] || 1)).toFixed(2)}</div>
                        </li>
                      ))}
                    </ul>
                    <div className="mb-2 fs-5">
                      <strong>Total:</strong> <span className="text-success">${getTotal().toFixed(2)}</span>
                    </div>
                  </div>
                  {/* Column 2: Billing Information */}
                  <div className="col-12 col-md-4 border-end mb-3 mb-md-0">
                    <div className="border rounded p-3 mb-3" style={{ background: '#f8f9fa' }}>
                      <h6 className="fw-bold mb-3">Billing Information</h6>
                      <div className="mb-2">
                        <label className="form-label">Full Name</label>
                        <input
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
        </div>
      )}
    </div>
  );
};

export default Cart;
