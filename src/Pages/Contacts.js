import React from 'react';
import MiniMap from './MiniMap';
import '../Styles/Contacts.css';
import logos from '../assets/image 71.png';
import logoss from '../assets/image 72.png';
import { Container } from 'react-bootstrap';

export default function ContactCard() {
  const latitude = 55.034523;
  const longitude = 82.922891;
  return (
    <Container>
    <div className="contact-container">
      <div className="contact-text">
        <h2>Ждем вас в гости</h2>
        <p> <strong>ул. Мичурина 9, Новосибирск</strong></p>
        <p>Телефон: +7 969 228 94 77</p>
        <p>Email: Hostex179@yandex.ru</p>
        <p>
          <a href="https://www.openstreetmap.org/?mlat=55.034523&mlon=82.922891#map=18/55.034523/82.922891" target="_blank" rel="noopener noreferrer">
            Посмотреть на карте
          </a>
        </p>
      </div>
      <div className="contact-map">
        <MiniMap latitude={latitude} longitude={longitude} />
      </div>
    </div>
    </Container>
  );
}