import React, { useState, useContext } from 'react'
import './Checkout.css'
import { ShopContext } from '../../Context/ShopContex'
import { useToast } from '../../Components/ToastContext/ToastContext'
import { useNavigate } from 'react-router-dom'



const Checkout = () => {
  const { getTotalCartAmount, cartItems, all_product } = useContext(ShopContext)

  const navigate = useNavigate()

  const { showToast } = useToast();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    postalCode: '',
    paymentMethod: 'card'
  })

  const [step, setStep] = useState(1) // 1 = details, 2 = payment, 3 = confirm

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const subtotal = getTotalCartAmount()
  const shipping = subtotal > 5000 ? 0 : 350
  const total = subtotal + shipping

  const cartProductList = all_product.filter(p => cartItems[p.id] > 0)


  //placeorder function create

  const placeOrder = async () => {
    if (!localStorage.getItem('auth-token')) {
      showToast('warning', 'Not Logged In', 'Please log in to place an order.');
      return;
    }

    // build items array from cart
    const orderItems = all_product
      .filter(p => cartItems[p.id] > 0)
      .map(p => ({
        id: p.id,
        name: p.name,
        image: p.image,
        price: p.new_price,
        quantity: cartItems[p.id],
      }));

    const orderData = {
      items: orderItems,
      delivery: form,
      totalAmount: total,
    };

    try {
      const response = await fetch('http://localhost:4000/placeorder', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('auth-token'),
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.success) {
        showToast('success', 'Order Placed!', 'Your order has been placed successfully.');
        navigate('/');                   // redirect to home after order
      } else {
        showToast('error', 'Failed!', data.error || 'Could not place order.');
      }
    } catch (error) {
      showToast('error', 'Server Error', 'Could not connect. Please try again.');
    }
  };

  return (
    <div className="checkout">

      {/* ── Progress Bar ── */}
      <div className="checkout-progress">
        <div className={`checkout-step ${step >= 1 ? 'active' : ''}`}>
          <div className="step-circle">1</div>
          <span>Delivery</span>
        </div>
        <div className={`checkout-step-line ${step >= 2 ? 'active' : ''}`} />
        <div className={`checkout-step ${step >= 2 ? 'active' : ''}`}>
          <div className="step-circle">2</div>
          <span>Payment</span>
        </div>
        <div className={`checkout-step-line ${step >= 3 ? 'active' : ''}`} />
        <div className={`checkout-step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-circle">3</div>
          <span>Confirm</span>
        </div>
      </div>

      <div className="checkout-body">

        {/* ── Left Panel ── */}
        <div className="checkout-left">

          {/* Step 1 — Delivery */}
          {step === 1 && (
            <div className="checkout-card">
              <h2>Delivery Information</h2>

              <div className="checkout-row">
                <div className="checkout-field">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={changeHandler}
                    placeholder="John"
                  />
                </div>
                <div className="checkout-field">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={changeHandler}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="checkout-row">
                <div className="checkout-field">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={changeHandler}
                    placeholder="john@email.com"
                  />
                </div>
                <div className="checkout-field">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={changeHandler}
                    placeholder="+94 77 123 4567"
                  />
                </div>
              </div>

              <div className="checkout-field full">
                <label>Street Address</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={changeHandler}
                  placeholder="123 Main Street, Colombo"
                />
              </div>

              <div className="checkout-row">
                <div className="checkout-field">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={changeHandler}
                    placeholder="Colombo"
                  />
                </div>
                <div className="checkout-field">
                  <label>District</label>
                  <input
                    type="text"
                    name="district"
                    value={form.district}
                    onChange={changeHandler}
                    placeholder="Western"
                  />
                </div>
                <div className="checkout-field">
                  <label>Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={changeHandler}
                    placeholder="10001"
                  />
                </div>
              </div>

              <button className="checkout-btn" onClick={() => setStep(2)}>
                Continue to Payment →
              </button>
            </div>
          )}

          {/* Step 2 — Payment */}
          {step === 2 && (
            <div className="checkout-card">
              <h2>Payment Method</h2>

              <div className="payment-options">
                <div
                  className={`payment-option ${form.paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, paymentMethod: 'card' })}
                >
                  <div className="payment-option-left">
                    <div className="payment-radio" />
                    <div>
                      <p className="payment-title">Credit / Debit Card</p>
                      <p className="payment-sub">Visa, Mastercard, Amex</p>
                    </div>
                  </div>
                  <span className="payment-badge">Recommended</span>
                </div>

                <div
                  className={`payment-option ${form.paymentMethod === 'cod' ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, paymentMethod: 'cod' })}
                >
                  <div className="payment-option-left">
                    <div className="payment-radio" />
                    <div>
                      <p className="payment-title">Cash on Delivery</p>
                      <p className="payment-sub">Pay when you receive</p>
                    </div>
                  </div>
                </div>

                <div
                  className={`payment-option ${form.paymentMethod === 'bank' ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, paymentMethod: 'bank' })}
                >
                  <div className="payment-option-left">
                    <div className="payment-radio" />
                    <div>
                      <p className="payment-title">Bank Transfer</p>
                      <p className="payment-sub">Direct bank deposit</p>
                    </div>
                  </div>
                </div>
              </div>

              {form.paymentMethod === 'card' && (
                <div className="card-fields">
                  <div className="checkout-field full">
                    <label>Card Number</label>
                    <input type="text" placeholder="1234 5678 9012 3456" maxLength={19} />
                  </div>
                  <div className="checkout-row">
                    <div className="checkout-field">
                      <label>Expiry Date</label>
                      <input type="text" placeholder="MM / YY" maxLength={7} />
                    </div>
                    <div className="checkout-field">
                      <label>CVV</label>
                      <input type="password" placeholder="•••" maxLength={3} />
                    </div>
                  </div>
                  <div className="checkout-field full">
                    <label>Name on Card</label>
                    <input type="text" placeholder="John Doe" />
                  </div>
                </div>
              )}

              {form.paymentMethod === 'bank' && (
                <div className="bank-details">
                  <p className="bank-detail-title">Transfer to this account:</p>
                  <div className="bank-detail-row"><span>Bank</span><strong>Commercial Bank</strong></div>
                  <div className="bank-detail-row"><span>Account Name</span><strong>WareNova Pvt Ltd</strong></div>
                  <div className="bank-detail-row"><span>Account No</span><strong>1234567890</strong></div>
                  <div className="bank-detail-row"><span>Branch</span><strong>Colombo 03</strong></div>
                </div>
              )}

              <div className="checkout-btn-row">
                <button className="checkout-btn-back" onClick={() => setStep(1)}>← Back</button>
                <button className="checkout-btn" onClick={() => setStep(3)}>Review Order →</button>
              </div>
            </div>
          )}

          {/* Step 3 — Confirm */}
          {step === 3 && (
            <div className="checkout-card">
              <h2>Review Your Order</h2>

              <div className="confirm-section">
                <p className="confirm-label">Delivering to</p>
                <p className="confirm-value">{form.firstName} {form.lastName}</p>
                <p className="confirm-value">{form.address}, {form.city}, {form.district} {form.postalCode}</p>
                <p className="confirm-value">{form.email} · {form.phone}</p>
              </div>

              <div className="confirm-section">
                <p className="confirm-label">Payment</p>
                <p className="confirm-value">
                  {form.paymentMethod === 'card' ? 'Credit / Debit Card'
                    : form.paymentMethod === 'cod' ? 'Cash on Delivery'
                      : 'Bank Transfer'}
                </p>
              </div>

              <div className="checkout-btn-row">
                <button className="checkout-btn-back" onClick={() => setStep(2)}>← Back</button>
                <button className="checkout-btn place-order" onClick={placeOrder}>Place Order ✓</button>
              </div>
            </div>
          )}

        </div>

        {/* ── Right Panel — Order Summary ── */}
        <div className="checkout-right">
          <div className="checkout-card">
            <h2>Order Summary</h2>

            <div className="order-items">
              {cartProductList.map((product) => (
                <div key={product.id} className="order-item">
                  <div className="order-item-left">
                    <img src={product.image} alt={product.name} />
                    <div>
                      <p className="order-item-name">{product.name}</p>
                      <p className="order-item-qty">Qty: {cartItems[product.id]}</p>
                    </div>
                  </div>
                  <p className="order-item-price">
                    LKR {(product.new_price * cartItems[product.id]).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="order-totals">
              <div className="order-total-row">
                <span>Subtotal</span>
                <span>LKR {subtotal.toLocaleString()}</span>
              </div>
              <div className="order-total-row">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'free-shipping' : ''}>
                  {shipping === 0 ? 'FREE' : `LKR ${shipping}`}
                </span>
              </div>
              {shipping === 0 && (
                <p className="free-shipping-note">🎉 You qualify for free shipping!</p>
              )}
              <hr />
              <div className="order-total-row total">
                <strong>Total</strong>
                <strong>LKR {total.toLocaleString()}</strong>
              </div>
            </div>

            <div className="secure-badge">
              <span>🔒</span>
              <p>Secured checkout — your data is safe</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Checkout