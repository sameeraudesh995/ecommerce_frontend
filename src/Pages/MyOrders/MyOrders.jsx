import React, { useEffect, useState } from 'react'
import './MyOrders.css'

const STATUS_CONFIG = {
  pending:   { bg: '#fff8e1', color: '#f39c12', border: '#fce08a', icon: '🕐', label: 'Pending' },
  confirmed: { bg: '#e3f2fd', color: '#1565c0', border: '#90caf9', icon: '✅', label: 'Confirmed' },
  shipped:   { bg: '#e8f5e9', color: '#2e7d32', border: '#a5d6a7', icon: '🚚', label: 'Shipped' },
  delivered: { bg: '#e0f7ee', color: '#00796b', border: '#80cbc4', icon: '📦', label: 'Delivered' },
  cancelled: { bg: '#fdecea', color: '#c0392b', border: '#f5c6c6', icon: '✕',  label: 'Cancelled' },
}

const MyOrders = () => {
  const [orders,   setOrders]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [filter,   setFilter]   = useState('all')

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res  = await fetch('http://localhost:4000/myorders', {
        method:  'GET',
        headers: {
          'auth-token':   localStorage.getItem('auth-token'),
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      if (data.success) setOrders(data.orders)
    } catch (err) {
      console.error('Fetch orders error:', err)
    } finally {
      setLoading(false)
    }
  }

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return
    try {
      const res  = await fetch('http://localhost:4000/cancelorder', {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token':   localStorage.getItem('auth-token'),
        },
        body: JSON.stringify({ orderId }),
      })
      const data = await res.json()
      if (data.success) fetchOrders()
    } catch (err) {
      console.error('Cancel error:', err)
    }
  }

  useEffect(() => {
    if (localStorage.getItem('auth-token')) {
      fetchOrders()
    } else {
      setLoading(false)
    }
  }, [])

  const filtered = filter === 'all'
    ? orders
    : orders.filter(o => o.status === filter)

  const counts = {
    all:       orders.length,
    pending:   orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    shipped:   orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  }

  if (!localStorage.getItem('auth-token')) {
    return (
      <div className="myorders-notlogged">
        <div className="myorders-notlogged-box">
          <p className="myorders-notlogged-icon">🔒</p>
          <h2>Please Log In</h2>
          <p>You need to be logged in to view your orders.</p>
          <a href="/login" className="myorders-login-btn">Go to Login</a>
        </div>
      </div>
    )
  }

  return (
    <div className="myorders">

      {/* ── Page Title ── */}
      <div className="myorders-header">
        <div>
          <h1>My Orders</h1>
          <p className="myorders-subtitle">Track and manage your orders</p>
        </div>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="myorders-tabs">
        {Object.entries(counts).map(([key, count]) => (
          <button
            key={key}
            className={`myorders-tab ${filter === key ? 'active' : ''}`}
            onClick={() => setFilter(key)}
          >
            {key === 'all' ? 'All Orders' : STATUS_CONFIG[key]?.label}
            {count > 0 && <span className="myorders-tab-count">{count}</span>}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="myorders-loading">
          <div className="myorders-spinner" />
          <p>Loading your orders...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="myorders-empty">
          <p className="myorders-empty-icon">🛍️</p>
          <h3>No orders found</h3>
          <p>
            {filter === 'all'
              ? "You haven't placed any orders yet."
              : `No ${filter} orders found.`}
          </p>
          <a href="/" className="myorders-shop-btn">Start Shopping</a>
        </div>
      ) : (
        <div className="myorders-list">
          {filtered.map((order) => {
            const cfg    = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
            const isOpen = expanded === order._id

            return (
              <div key={order._id} className="myorder-card">

                {/* ── Card Header ── */}
                <div
                  className="myorder-card-header"
                  onClick={() => setExpanded(isOpen ? null : order._id)}
                >
                  <div className="myorder-header-left">

                    {/* Status Icon */}
                    <div className="myorder-status-icon"
                      style={{ background: cfg.bg, borderColor: cfg.border }}
                    >
                      <span>{cfg.icon}</span>
                    </div>

                    {/* Order Info */}
                    <div className="myorder-info">
                      <div className="myorder-id">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </div>
                      <div className="myorder-date">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit', month: 'long', year: 'numeric'
                        })}
                      </div>
                    </div>

                  </div>

                  <div className="myorder-header-right">
                    {/* Item count */}
                    <div className="myorder-item-count">
                      {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                    </div>

                    {/* Amount */}
                    <div className="myorder-amount">
                      LKR {order.totalAmount?.toLocaleString()}
                    </div>

                    {/* Status Badge */}
                    <div className="myorder-status-badge"
                      style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border }}
                    >
                      {cfg.icon} {cfg.label}
                    </div>

                    {/* Expand */}
                    <span className="myorder-expand">{isOpen ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* ── Progress Bar ── */}
                {order.status !== 'cancelled' && (
                  <div className="myorder-progress">
                    {['pending', 'confirmed', 'shipped', 'delivered'].map((s, i) => {
                      const steps    = ['pending', 'confirmed', 'shipped', 'delivered']
                      const curIndex = steps.indexOf(order.status)
                      const isDone   = i <= curIndex
                      const isCur    = i === curIndex
                      return (
                        <React.Fragment key={s}>
                          <div className="progress-step">
                            <div className={`progress-dot ${isDone ? 'done' : ''} ${isCur ? 'current' : ''}`}>
                              {isDone ? '✓' : i + 1}
                            </div>
                            <span className={`progress-label ${isDone ? 'done' : ''}`}>
                              {STATUS_CONFIG[s]?.label}
                            </span>
                          </div>
                          {i < 3 && (
                            <div className={`progress-line ${i < curIndex ? 'done' : ''}`} />
                          )}
                        </React.Fragment>
                      )
                    })}
                  </div>
                )}

                {order.status === 'cancelled' && (
                  <div className="myorder-cancelled-bar">
                    Order was cancelled
                  </div>
                )}

                {/* ── Expanded Body ── */}
                {isOpen && (
                  <div className="myorder-card-body">

                    <div className="myorder-body-grid">

                      {/* Items */}
                      <div className="myorder-section">
                        <h3>Items</h3>
                        <div className="myorder-items">
                          {order.items?.map((item, i) => (
                            <div key={i} className="myorder-item">
                              <img src={item.image} alt={item.name} />
                              <div className="myorder-item-details">
                                <p className="myorder-item-name">{item.name}</p>
                                <p className="myorder-item-qty">
                                  Qty: {item.quantity} × LKR {item.price?.toLocaleString()}
                                </p>
                              </div>
                              <p className="myorder-item-price">
                                LKR {(item.price * item.quantity)?.toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Total */}
                        <div className="myorder-total">
                          <div className="myorder-total-row">
                            <span>Subtotal</span>
                            <span>LKR {order.totalAmount?.toLocaleString()}</span>
                          </div>
                          <div className="myorder-total-row">
                            <span>Shipping</span>
                            <span className="myorder-free">FREE</span>
                          </div>
                          <div className="myorder-total-row bold">
                            <strong>Total</strong>
                            <strong>LKR {order.totalAmount?.toLocaleString()}</strong>
                          </div>
                          <div className="myorder-payment-tag">
                            💵 Cash on Delivery
                          </div>
                        </div>
                      </div>

                      {/* Delivery + Actions */}
                      <div className="myorder-section">
                        <h3>Delivery Address</h3>
                        <div className="myorder-address-card">
                          <p className="myorder-address-name">
                            {order.delivery?.firstName} {order.delivery?.lastName}
                          </p>
                          <p>{order.delivery?.address}</p>
                          <p>{order.delivery?.city}, {order.delivery?.district} {order.delivery?.postalCode}</p>
                          <p>{order.delivery?.phone}</p>
                          <p>{order.delivery?.email}</p>
                        </div>

                        {/* Cancel Button */}
                        {order.status === 'pending' && (
                          <button
                            className="myorder-cancel-btn"
                            onClick={() => cancelOrder(order._id)}
                          >
                            Cancel Order
                          </button>
                        )}

                        {/* Delivered Message */}
                        {order.status === 'delivered' && (
                          <div className="myorder-delivered-msg">
                            ✅ Your order has been delivered. Thank you for shopping with us!
                          </div>
                        )}

                        {/* Shipped Message */}
                        {order.status === 'shipped' && (
                          <div className="myorder-shipped-msg">
                            🚚 Your order is on the way! Please be available to receive it.
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                )}

              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}

export default MyOrders