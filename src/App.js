
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import ShopCategory from './Pages/ShopCategory';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import Shop from './Pages/Shop';
import Product from './Pages/Product';
import Footer from './Components/Footer/Footer';
import men_banner from './Components/Assets/banner_mens.png'
import women_banner from './Components/Assets/banner_women.png'
import kid_banner from './Components/Assets/banner_kids.png'
import WhatsAppButton from './Components/WhatsApp/WhatsAppButton';
import { ToastProvider } from './Components/ToastContext/ToastContext';
import ShopContextProvider from './Context/ShopContex';

function App() {
  return (
     
      
    <div className='App'>
     
      <BrowserRouter>
  
      <Navbar/>
      <Routes>
        <Route path='/' element={<Shop/>}/>
        <Route path='/government' element={<ShopCategory banner={men_banner} category="GOV"/>}/>
        <Route path='/private' element={<ShopCategory banner={women_banner} category="PRI"/>}/> 
        <Route path='/other' element={<ShopCategory banner={kid_banner} category="OTH"/>}/>
        <Route path="/product" element={<Product/>}>
        <Route path=':productId' element={<Product/>}/>
        
           </Route>
           <Route path='/cart' element={<Cart/>}/>
           <Route path='/login' element={<LoginSignup/>}/>

           
      </Routes>
      <Footer/>

      <WhatsAppButton/>

      </BrowserRouter>

    </div>
   
  );
}

export default App;
