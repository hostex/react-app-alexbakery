import React from 'react';
import { Card, Button } from 'react-bootstrap';

const Item = ({ item, onAddToCart }) => {
  return (
    <Card className="item-card h-100">
      <Card.Img 
        variant="top" 
        src={`/img/${item.img}`}  // ← ИЗМЕНИТЕ С /images/ НА /img/
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://via.placeholder.com/300x200?text=Нет+изображения';
        }}
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <Card.Body>
        <Card.Title>{item.title}</Card.Title>
        <Card.Text className="description">
          {item.description}
        </Card.Text>
        <Card.Text className="category text-muted">
          {item.category}
        </Card.Text>
        <Card.Text className="price h4 text-primary">
          {item.price} ₽
        </Card.Text>
        <Button 
          variant="primary" 
          onClick={() => onAddToCart(item.id)}
          className="w-100"
        >
          В корзину
        </Button>
      </Card.Body>
    </Card>
  );
};

export default Item;