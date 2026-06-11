import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Item from './Item';

const Items = ({ items, onAddToCart }) => {
  return (
    <Row className="g-4 mt-2">
      {items.map(item => (
        <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
          <Item 
            item={item} 
            onAddToCart={onAddToCart}
          />
        </Col>
      ))}
    </Row>
  );
};

export default Items;