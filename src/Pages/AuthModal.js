import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import '../Styles/AuthModal.css'; // 👈 ПОДКЛЮЧАЕМ CSS ФАЙЛ

export default class AuthModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogin: true,
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            errors: {},
            isLoading: false
        };
    }

    toggleMode = () => {
        this.setState({
            isLogin: !this.state.isLogin,
            errors: {},
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        const { isLogin, name, email, password, confirmPassword } = this.state;
        const errors = {};

        if (!email) errors.email = 'Введите email';
        if (!password) errors.password = 'Введите пароль';

        if (!isLogin) {
            if (!name) errors.name = 'Введите имя';
            if (password !== confirmPassword) errors.confirmPassword = 'Пароли не совпадают';
            if (password.length < 4) errors.password = 'Пароль должен быть не менее 4 символов';
        }

        if (Object.keys(errors).length > 0) {
            this.setState({ errors });
            return;
        }

        this.setState({ isLoading: true });

        try {
            if (isLogin) {
                // Вход
                const response = await fetch('http://localhost:5000/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await response.json();
                
                if (data.success) {
                    localStorage.setItem('user', JSON.stringify({
                        id: data.userId,
                        name: data.name,
                        email: email
                    }));
                    alert(`Добро пожаловать, ${data.name}!`);
                    this.props.onLogin({ name: data.name, email: email });
                    this.props.onClose();
                } else {
                    this.setState({
                        errors: { general: data.error || 'Неверный email или пароль' }
                    });
                }
            } else {
                // Регистрация
                const response = await fetch('http://localhost:5000/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });
                const data = await response.json();
                
                if (data.success) {
                    alert('✅ Регистрация успешна! Теперь войдите в систему');
                    this.setState({
                        isLogin: true,
                        name: '',
                        email: '',
                        password: '',
                        confirmPassword: '',
                        errors: {}
                    });
                } else {
                    this.setState({
                        errors: { general: data.error || 'Ошибка при регистрации' }
                    });
                }
            }
        } catch (error) {
            console.error('Ошибка:', error);
            this.setState({
                errors: { general: 'Ошибка соединения с сервером. Запустите backend: cd backend && node server.js' }
            });
        } finally {
            this.setState({ isLoading: false });
        }
    }

    render() {
        const { isLogin, name, email, password, confirmPassword, errors, isLoading } = this.state;
        
        return (
            <Modal 
                show={true} 
                onHide={this.props.onClose} 
                centered
                className="custom-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>{isLogin ? 'Вход' : 'Регистрация'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errors.general && (
                        <div className="auth-error-message">
                            {errors.general}
                        </div>
                    )}
                    
                    <Form onSubmit={this.handleSubmit}>
                        {!isLogin && (
                            <Form.Group className="mb-3">
                                <Form.Label>Имя</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={name}
                                    onChange={this.handleChange}
                                    placeholder="Введите ваше имя"
                                    isInvalid={!!errors.name}
                                    disabled={isLoading}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.name}
                                </Form.Control.Feedback>
                            </Form.Group>
                        )}

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={email}
                                onChange={this.handleChange}
                                placeholder="example@mail.com"
                                isInvalid={!!errors.email}
                                disabled={isLoading}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={password}
                                onChange={this.handleChange}
                                placeholder={isLogin ? "Введите пароль" : "Придумайте пароль (мин. 4 символа)"}
                                isInvalid={!!errors.password}
                                disabled={isLoading}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {!isLogin && (
                            <Form.Group className="mb-3">
                                <Form.Label>Подтвердите пароль</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={this.handleChange}
                                    placeholder="Повторите пароль"
                                    isInvalid={!!errors.confirmPassword}
                                    disabled={isLoading}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.confirmPassword}
                                </Form.Control.Feedback>
                            </Form.Group>
                        )}

                        <Button 
                            variant="primary" 
                            type="submit" 
                            className="w-100"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
                        </Button>
                        
                        <div className="auth-switch-link">
                            {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
                            {' '}
                            <span onClick={this.toggleMode}>
                                {isLogin ? 'Зарегистрироваться' : 'Войти'}
                            </span>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        );
    }
}