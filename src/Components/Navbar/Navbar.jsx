import React, { useState, useContext, useRef, useEffect } from 'react';
import './Navbar.css';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';
import { Link, useLocation } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContex';

const Navbar = () => {
  const [menuOpen, setMenuOpen]     = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const { getTotalCartItems }       = useContext(ShopContext);
  const menuRef                     = useRef();
  const location                    = useLocation();
  const isLoggedIn                  = !!localStorage.getItem('auth-token');

  // Shrink navbar on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    window.location.replace('/');
  };

  const navLinks = [
    { label: 'Shop',       to: '/',           key: 'shop'   },
    { label: 'Government', to: '/government', key: 'GOV'    },
    { label: 'Private',    to: '/private',    key: 'PRI'    },
    { label: 'Other',      to: '/other',      key: 'OTH'    },
  ];

  const cartCount = getTotalCartItems();

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>

      {/* ── Logo ── */}
      <Link to="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
        <img src={logo} alt="WareNova logo" />
        <span>WARENOVA</span>
      </Link>

      {/* ── Desktop menu ── */}
      <ul className="nav-menu" ref={menuRef}>
        {navLinks.map(link => (
          <li key={link.key} className={location.pathname === link.to ? 'active' : ''}>
            <Link to={link.to}>{link.label}</Link>
          </li>
        ))}
      </ul>

      {/* ── Right section ── */}
      <div className="nav-right">

        {/* Cart */}
        <Link to="/cart" className="nav-cart-btn" aria-label="Cart">
          <img src={cart_icon} alt="cart" />
          {cartCount > 0 && (
            <span className="nav-cart-badge">{cartCount}</span>
          )}
        </Link>

        {/* Auth buttons */}
        {isLoggedIn ? (
          <div className="nav-auth-group">
            <Link to="/myorders" className="nav-orders-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                <rect x="9" y="3" width="6" height="4" rx="1"/>
                <line x1="9" y1="12" x2="15" y2="12"/>
                <line x1="9" y1="16" x2="13" y2="16"/>
              </svg>
              My Orders
            </Link>
            <button className="nav-logout-btn" onClick={handleLogout}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="nav-login-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            Login
          </Link>
        )}

        {/* Mobile hamburger */}
        <button
          className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      <div className={`nav-drawer ${menuOpen ? 'open' : ''}`}>
        <ul>
          {navLinks.map(link => (
            <li key={link.key} className={location.pathname === link.to ? 'active' : ''}>
              <Link to={link.to} onClick={() => setMenuOpen(false)}>{link.label}</Link>
            </li>
          ))}
        </ul>
        <div className="nav-drawer-footer">
          {isLoggedIn ? (
            <>
              <Link to="/myorders" className="drawer-orders-btn" onClick={() => setMenuOpen(false)}>
                My Orders
              </Link>
              <button className="drawer-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="drawer-login-btn" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
          )}
        </div>
      </div>

      {/* ── Mobile overlay ── */}
      {menuOpen && (
        <div className="nav-overlay" onClick={() => setMenuOpen(false)} />
      )}

    </nav>
  );
};

export default Navbar;