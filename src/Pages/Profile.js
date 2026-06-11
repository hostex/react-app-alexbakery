import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab, Spinner, Card, Badge, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const Profile = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    
    if (userId) {
      setUser({ id: parseInt(userId), name: userName, email: userEmail });
      loadOrders(userId);
    } else {
      setLoading(false);
    }
  }, []);

  const loadOrders = async (userId) => {
    try {
      const data = await api.getOrders(parseInt(userId));
      setOrders(data);
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status) => {
    const statuses = {
      'new': { text: 'Новый', color: 'warning' },
      'processing': { text: 'В обработке', color: 'info' },
      'delivering': { text: 'Доставляется', color: 'primary' },
      'completed': { text: 'Выполнен', color: 'success' },
      'cancelled': { text: 'Отменён', color: 'danger' }
    };
    return statuses[status] || { text: status, color: 'secondary' };
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Загрузка...</p>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="text-center mt-5">
        <h2>🔒 Войдите в аккаунт</h2>
        <p>Чтобы просматривать историю заказов, пожалуйста, войдите в профиль</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h1 className="mb-4">👤 Личный кабинет</h1>
      
      <Tabs defaultActiveKey="orders" className="mb-4">
        <Tab eventKey="orders" title="📦 Мои заказы">
          {orders.length === 0 ? (
            <div className="text-center mt-5">
              <h3>У вас пока нет заказов</h3>
              <p>Перейдите в каталог и сделайте первый заказ!</p>
              <Link to="/ourproducts">
                <Button variant="primary">Перейти к товарам</Button>
              </Link>
            </div>
          ) : (
            orders.map(order => {
              const status = getStatusText(order.status);
              return (
                <Card key={order.id} className="mb-4">
                  <Card.Header className="d-flex justify-content-between align-items-center flex-wrap">
                    <strong>Заказ №{order.id}</strong>
                    <Badge bg={status.color}>{status.text}</Badge>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={5}>
                        <p><strong>📅 Дата:</strong> {new Date(order.created_at).toLocaleString('ru-RU')}</p>
                        <p><strong>📍 Адрес:</strong> {order.address}</p>
                        <p><strong>📞 Телефон:</strong> {order.phone}</p>
                        {order.comment && (
                          <p><strong>💬 Комментарий:</strong> {order.comment}</p>
                        )}
                      </Col>
                      <Col md={7}>
                        <strong>🛍️ Состав заказа:</strong>
                        <div className="mt-2">
                          {order.items && order.items.map(item => (
                            <div key={item.id} className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                              <div>
                                <span>{item.title}</span>
                                <span className="text-muted ms-2">× {item.quantity} шт.</span>
                              </div>
                              <span>{item.price * item.quantity} ₽</span>
                            </div>
                          ))}
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between align-items-center">
                          <strong>Итого:</strong>
                          <h5 className="mb-0 text-primary">{order.total} ₽</h5>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              );
            })
          )}
        </Tab>
        
        <Tab eventKey="profile" title="👤 Мои данные">
          <Card>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p><strong>Имя:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email || 'Не указан'}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Profile;