import React, { useState, useContext, useRef } from 'react';
import './Navbar.css';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';
import { Link } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContex'; 
import nav_dropdown from '../Assets/nav_dropdown.png'

const Navbar = () => {

    const [menu, setMenu] = useState("shop");
    // දැන් useContext සහ ShopContext නිවැරදිව වැඩ කරාවි
    const {getTotalCartItems} = useContext(ShopContext);
    const menuRef = useRef();

    const dropdown_toggle =(e)=>{
        menuRef.current.classList.toggle('nav-menu-visible');
        e.target.classList.toggle('open');
    }


  return (
    <div className='navbar'>
        
        <div className="nav-logo">
            <img src={logo} alt="" />
            <p>WARENOVA</p>
        </div>
        <img className='nav-dropdown' onClick={dropdown_toggle} src={nav_dropdown} alt="" />
       <ul ref={menuRef} className="nav-menu">
  <li onClick={() => setMenu("shop")}>
    <Link style={{ textDecoration: 'none' }} to="/">Shop</Link>
    {menu === "shop" ? <hr /> : <></>}
  </li>
  <li onClick={() => setMenu("GOV")}>
    <Link style={{ textDecoration: 'none' }} to="/government">Gove</Link>
    {menu === "GOV" ? <hr /> : <></>}
  </li>
  <li onClick={() => setMenu("PRI")}>
    <Link style={{ textDecoration: 'none' }} to="/private">Priv</Link>
    {menu === "PRI" ? <hr /> : <></>}
  </li>
  <li onClick={() => setMenu("OTH")}>
    <Link style={{ textDecoration: 'none' }} to="/other">Other</Link>
    {menu === "OTH" ? <hr /> : <></>}
  </li>
</ul>

        <div className="nav-login-cart">
            {localStorage.getItem('auth-token')?<button  onClick={()=>{localStorage.removeItem('auth-token');
                window.location.replace('/')}}>Logout</button>:<Link to='/login'><button>login</button></Link>}
             
            <Link to='/cart'><img src={cart_icon} alt="" /></Link> 
            <div className="nav-cart-count">{getTotalCartItems()}</div>
        </div>
    </div>
  )
}

export default Navbar;