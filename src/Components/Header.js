import React, { Component } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import logo from '../assets/image 57.png';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Home from '../Pages/Home';
import Ourproducts from '../Pages/Ourproducts';
import About from '../Pages/About';
import Contacts from '../Pages/Contacts';
import AuthModal from './AuthModal'; // 👈 ИЗМЕНИТЕ ЗДЕСЬ (было RegistrationForm)

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAuth: false,  // 👈 ИЗМЕНИТЕ НА showAuth
            user: null
        };
    }

    handleShowAuth = () => {  // 👈 ИЗМЕНИТЕ
        this.setState({ showAuth: true });
    }

    handleCloseAuth = () => {  // 👈 ИЗМЕНИТЕ
        this.setState({ showAuth: false });
    }

    handleLogin = (user) => {
        this.setState({ user: user, showAuth: false });
    }

    handleLogout = () => {
        localStorage.removeItem('user');
        this.setState({ user: null });
        alert('Вы вышли из системы');
    }

    componentDidMount() {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            this.setState({ user: JSON.parse(savedUser) });
        }
    }

    render() {
        const { user } = this.state;
        
        return (
            <>
                <Router>
                    <Navbar className="brown" sticky="top" collapseOnSelect expand="md" variant="light">
                        <Container>
                            <Navbar.Brand as={Link} to="/" >
                                <img
                                    src={logo}
                                    height="30"
                                    width="30"
                                    className="d-inline-block align-top"
                                    alt="Logo"
                                />
                            </Navbar.Brand>
                            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                            <Navbar.Collapse id="responsive-navbar-nav">
                                <Nav className="ms-auto">
                                    <Nav.Link as={Link} to="/"> Главная </Nav.Link>
                                    <Nav.Link as={Link} to="/about"> О нас </Nav.Link>
                                    <Nav.Link as={Link} to="/ourproducts"> Наши изделия </Nav.Link>
                                    <Nav.Link as={Link} to="/contacts"> Контакты </Nav.Link>
                                    
                                    {user ? (
                                        <>
                                            <Nav.Link style={{ color: '#5C3E2D' }}>
                                                Привет, {user.name}!
                                            </Nav.Link>
                                            <Nav.Link onClick={this.handleLogout} style={{ cursor: 'pointer' }}>
                                                Выйти
                                            </Nav.Link>
                                        </>
                                    ) : (
                                        <Nav.Link onClick={this.handleShowAuth} style={{ cursor: 'pointer' }}>
                                            Войти
                                        </Nav.Link>
                                    )}
                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/ourproducts" element={<Ourproducts />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contacts" element={<Contacts />} />
                    </Routes>
                </Router>
                
                {/* Используем AuthModal вместо RegistrationForm */}
                {this.state.showAuth && (
                    <AuthModal 
                        onClose={this.handleCloseAuth}
                        onLogin={this.handleLogin}
                    />
                )}
            </>
        )
    }
}