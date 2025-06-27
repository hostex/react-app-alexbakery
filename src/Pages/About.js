import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import '../Styles/About.css';

export default class About extends Component {
  render() {
    return (
      <Container className='About-us-block'>
        <div>
          <h3>FitBakery — сладкое искусство Новосибирска</h3>
          <p className='About-us-text'>
            Мы не просто печём десерты — мы создаём эмоции. 
            Каждый наш торт, пирожное и эклер наполнен любовью к кондитерскому искусству и уважением к сибирским традициям качества.</p>
        </div>
        <div>
          <h6 className='About-us-texth'>Наша история</h6>
          <p className='About-us-text'>
             Рождённая в 2015 году в сердце Новосибирска, кондитерская FitBakery начиналась с маленькой домашней пекарни.
             Сегодня — это современное производство, где ручная работа сочетается с профессиональными технологиями. 
             Наш секрет — в балансе: мы сохраняем тепло домашней выпечки, добавляя к ней филигранную точность шеф-кондитеров.</p>
        </div>
      </Container>
    )
  }
}
