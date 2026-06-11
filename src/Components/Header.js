import React, { Component } from 'react';
import { Container, Nav, Navbar, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AuthModal from './AuthModal';
import { useCart } from '../context/CartContext';

// Обертка для использования хука в класс-компоненте
const HeaderWrapper = (props) => {
  const { cart } = useCart();
  return <Header {...props} cart={cart} />;
};

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAuth: false,
            user: null
        };
    }

    handleShowAuth = () => {
        this.setState({ showAuth: true });
    }

    handleCloseAuth = () => {
        this.setState({ showAuth: false });
    }

    handleLogin = (user) => {
        this.setState({ user: user, showAuth: false });
        if (this.props.onLogin) {
            this.props.onLogin(user);
        }
    }

    handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        this.setState({ user: null });
        if (this.props.onLogout) {
            this.props.onLogout();
        }
        alert('Вы вышли из системы');
    }

    componentDidMount() {
        const userId = localStorage.getItem('userId');
        const userName = localStorage.getItem('userName');
        if (userId) {
            this.setState({ user: { id: parseInt(userId), name: userName } });
        }
    }

    render() {
        const { user } = this.state;
        const { cart } = this.props;
        const cartItemsCount = cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        
        return (
            <>
                <Navbar className="brown" sticky="top" collapseOnSelect expand="md" variant="light">
                    <Container>
                        <Navbar.Brand as={Link} to="/" >
                            <img
                                src="/img/image 57.png"
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
                                        <Nav.Link as={Link} to="/profile">
                                            👤 {user.name}
                                        </Nav.Link>
                                        <Nav.Link as={Link} to="/cart">
                                            🛒 Корзина
                                            {cartItemsCount > 0 && (
                                                <Badge bg="secondary" pill className="ms-1">
                                                    {cartItemsCount}
                                                </Badge>
                                            )}
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

export default HeaderWrapper;