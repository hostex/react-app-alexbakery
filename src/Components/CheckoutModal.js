import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const CheckoutModal = ({ show, onClose, onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        address: '',
        phone: '',
        comment: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        
        if (!formData.address.trim()) newErrors.address = 'Введите адрес доставки';
        if (!formData.phone.trim()) newErrors.phone = 'Введите номер телефона';
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        onSubmit(formData);
    };

    return (
        <Modal show={show} onHide={onClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Оформление заказа</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>📍 Адрес доставки *</Form.Label>
                        <Form.Control
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Введите ваш адрес"
                            isInvalid={!!errors.address}
                            disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.address}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>📞 Телефон *</Form.Label>
                        <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+7 (999) 123-45-67"
                            isInvalid={!!errors.phone}
                            disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.phone}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>💬 Комментарий к заказу</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="comment"
                            rows={3}
                            value={formData.comment}
                            onChange={handleChange}
                            placeholder="Пожелания к заказу, время доставки и т.д."
                            disabled={loading}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose} disabled={loading}>
                        Отмена
                    </Button>
                    <Button variant="success" type="submit" disabled={loading}>
                        {loading ? 'Оформление...' : 'Подтвердить заказ'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default CheckoutModal;