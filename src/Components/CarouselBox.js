import React, { Component } from 'react';
import  Carousel  from 'react-bootstrap/Carousel';
import  Image  from '../assets/image.png';
import  IImage  from '../assets/Group 42.png';
import '../Styles/CarouselBox.css';
import  { Button, Container }  from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default class CarouselBox extends Component {
  render() {
    return (
      <Container>
    <div>
        <div className='header-container'>
            <h1 className='left-title'>FitBakery</h1>
            <p className='right-text'>Сладости, что душу греют.<br/>В каждом кусочке - настроение!<br/>Попробуй - и мир станет ярче!</p>
        </div>
      <Carousel className='carousel-with-padding' controls={false}>
        <Carousel.Item>
            <img
            className='d-block w-100'
            src={Image}
            alt='Image'
            />
        </Carousel.Item>
        <Carousel.Item>
            <img
            className='d-block w-100'
            src={IImage}
            alt='Image'
            />
            <Carousel.Caption className='custom-caption-left-top'>
                <h3>Мы готовим торты на заказ<br/> для ваших важных событий</h3>
                <p>Незабываемый праздник с FitBakery <br/>Окунись в мир вкуса и гармонии!</p>
            </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      <div className='bottom-container'>
        <p className='bottom-text'>Готовим торты на заказ.<br/>При первом заказе - консультация <br/>Бесплатно!</p>
        <div className='button-group'>
            <Link to="/ourproducts">
            <Button className="custom-btn">Выбрать торт</Button>
            </Link>
            <Link to="/contacts">
            <Button className="custom-btn secondary">Консультация</Button> 
            </Link>
        </div>
      </div>
    </div>
    </Container>
    )
  }
}
