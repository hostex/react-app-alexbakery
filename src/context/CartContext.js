import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const checkUser = () => {
      const uid = localStorage.getItem('userId');
      if (uid) {
        setUserId(parseInt(uid));
      } else {
        setUserId(null);
      }
    };

    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  useEffect(() => {
    if (userId) {
      loadCart();
    } else {
      setCart([]);
      setTotal(0);
    }
  }, [userId]);

  const loadCart = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await api.getCart(userId);
      setCart(data.items || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Ошибка загрузки корзины:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    const currentUserId = localStorage.getItem('userId');
    
    if (!currentUserId) {
      alert('Пожалуйста, войдите в аккаунт');
      return false;
    }
    
    try {
      await api.addToCart(parseInt(currentUserId), productId, quantity);
      await loadCart();
      return true;
    } catch (error) {
      console.error('Ошибка добавления:', error);
      alert('Ошибка при добавлении товара');
      return false;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!userId) return;
    try {
      await api.updateCartItem(userId, productId, quantity);
      await loadCart();
    } catch (error) {
      console.error('Ошибка обновления:', error);
    }
  };

  const removeFromCart = async (productId) => {
    if (!userId) return;
    try {
      await api.removeFromCart(userId, productId);
      await loadCart();
    } catch (error) {
      console.error('Ошибка удаления:', error);
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      total,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      loadCart
    }}>
      {children}
    </CartContext.Provider>
  );
};