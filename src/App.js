import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "./Components/Header";
import Home from './Pages/Home';
import Ourproducts from './Pages/Ourproducts';
import About from './Pages/About';
import Contacts from './Pages/Contacts';
import Cart from './Pages/Cart';
import Profile from './Pages/Profile';
import { CartProvider } from './context/CartContext';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    if (userId) {
      setUser({ id: parseInt(userId), name: userName });
    }
  }, []);

  const handleLogin = (userData) => {
    setUser({ id: userData.id, name: userData.name });
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <BrowserRouter>
      <CartProvider>
        <Header 
          user={user}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ourproducts" element={<Ourproducts />} />
          <Route path="/about" element={<About />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;