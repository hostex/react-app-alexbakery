import React, { useState } from 'react';
import { Container, Button, Spinner, Row, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import CheckoutModal from '../Components/CheckoutModal';

const Cart = () => {
  const { cart, total, loading, updateQuantity, removeFromCart, loadCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCheckout = async (orderData) => {
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      setError('Пожалуйста, войдите в аккаунт');
      return;
    }
    
    setCheckoutLoading(true);
    setError('');
    
    try {
      const result = await api.createOrder(parseInt(userId), orderData);
      
      if (result.success) {
        alert(`✅ Заказ №${result.orderId} успешно оформлен!`);
        setShowCheckout(false);
        await loadCart();
        navigate('/profile');
      } else {
        setError(result.error || 'Ошибка оформления заказа');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setError('Ошибка при оформлении заказа. Попробуйте позже.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Загрузка корзины...</p>
      </Container>
    );
  }

  if (cart.length === 0) {
    return (
      <Container className="text-center mt-5">
        <h2> Ваша корзина пуста</h2>
        <p>Добавьте товары из каталога</p>
        <Link to="/ourproducts">
          <Button variant="primary">Перейти к товарам</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h1>Корзина</h1>
      
      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}
      
      {cart.map(item => (
        <div key={item.id} className="border rounded p-3 mb-3">
          <Row className="align-items-center">
            <Col xs={3} md={2}>
              <img 
                src={`/img/${item.img}`} 
                alt={item.title} 
                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                onError={(e) => e.target.src = '/img/placeholder.png'}
                className="rounded"
              />
            </Col>
            <Col xs={5} md={4}>
              <h5>{item.title}</h5>
              <p className="text-muted mb-0">{item.price} ₽</p>
            </Col>
            <Col xs={2} md={2}>
              <div className="d-flex align-items-center">
                <Button 
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </Button>
                <span className="mx-2">{item.quantity}</span>
                <Button 
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                >
                  +
                </Button>
              </div>
            </Col>
            <Col xs={2} md={2}>
              <strong>{item.price * item.quantity} ₽</strong>
            </Col>
            <Col xs={2} md={2}>
              <Button 
                variant="danger"
                size="sm"
                onClick={() => removeFromCart(item.product_id)}
              >
                Удалить
              </Button>
            </Col>
          </Row>
        </div>
      ))}
      
      <div className="mt-4 p-3 bg-light rounded d-flex justify-content-between align-items-center">
        <h3>Итого: {total} ₽</h3>
        <Button variant="success" size="lg" onClick={() => setShowCheckout(true)}>
          Оформить заказ
        </Button>
      </div>

      <CheckoutModal
        show={showCheckout}
        onClose={() => setShowCheckout(false)}
        onSubmit={handleCheckout}
        loading={checkoutLoading}
      />
    </Container>
  );
};

export default Cart;