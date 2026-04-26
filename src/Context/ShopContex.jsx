import React, { createContext, useEffect, useState } from "react";
import { useToast } from "../Components/ToastContext/ToastContext";
//import all_product from "../Components/Assets/all_product";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index < 300 + 1; index++) {
    cart[index] = 0;
  }
  return cart;
};

const ShopContextProvider = (props) => {
const {showToast} = useToast();
  const [all_product,setAll_Product] = useState([]);

  const [cartItems, setCartItems] = useState(getDefaultCart());

  useEffect(() => {
  // ✅ fetch all products
  fetch('http://localhost:4000/allproducts')
    .then((response) => response.json())
    .then((data) => setAll_Product(data))
    .catch((err) => console.error('Products fetch error:', err));

  // ✅ fetch cart only if user is logged in
  if (localStorage.getItem('auth-token')) {
    fetch('http://localhost:4000/getcart', {
      method: 'POST',
      headers: {
        Accept: 'application/json',             
        'auth-token': localStorage.getItem('auth-token'), 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),                  
    })
      .then((response) => response.json())
      .then((data) => setCartItems(data))
      .catch((err) => console.error('Cart fetch error:', err));
  }
}, []);

  const addToCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    if(localStorage.getItem('auth-token')){
      fetch('http://localhost:4000/addtocart',{
        method:'POST',
        headers:{
          Accept:'application/form-data',
          'auth-token':`${localStorage.getItem('auth-token')}`,
          'Content-Type':'application/json',
        },
        body:JSON.stringify({"itemId":itemId}),
      })
      .then((response)=>response.json())
      .then((data)=>console.log(data));
       showToast('success', 'Added to Cart!', 'The item has been added to your cart.');
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if(localStorage.getItem('auth-token')){
      fetch('http://localhost:4000/removefromcart',{
        method:'POST',
        headers:{
          Accept:'application/form-data',
          'auth-token':`${localStorage.getItem('auth-token')}`,
          'Content-Type':'application/json',
        },
        body:JSON.stringify({"itemId":itemId}),
      })
      .then((response)=>response.json())
      .then((data)=>console.log(data));
      showToast('success', 'Removed from Cart', 'The item has been removed from your cart.');
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = all_product.find((product) => product.id === Number(item));
        totalAmount += itemInfo.new_price * cartItems[item];
      }
    }
    return totalAmount; 
  }

  const getTotalCartItems = () => {
    let totalItem = 0;
    for(const item in cartItems) {
      if(cartItems[item] > 0) {
      
        totalItem += cartItems[item]; 
      }
    }
    return totalItem;
  }

 
  const contextValue = {
    getTotalCartItems, 
    getTotalCartAmount, 
    all_product, 
    cartItems, 
    addToCart, 
    removeFromCart
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;