import React, { useState, useEffect } from 'react';
import Items from '../Components/Items';
import { Container, Spinner } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

const Ourproducts = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await api.getProducts();
      setItems(data);
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    const success = await addToCart(productId, 1);
    if (success) {
      alert('Товар добавлен в корзину!');
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Загрузка товаров...</p>
      </Container>
    );
  }

  return (
    <Container>
      <Items 
        items={items} 
        onAddToCart={handleAddToCart}
      />
    </Container>
  );
};

export default Ourproducts;