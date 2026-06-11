const API_URL = 'http://localhost:5000';

export const api = {
  // Товары
  getProducts: async () => {
    const response = await fetch(`${API_URL}/api/products`);
    if (!response.ok) throw new Error('Ошибка загрузки товаров');
    return response.json();
  },
  
  // Корзина
  getCart: async (userId) => {
    const response = await fetch(`${API_URL}/api/cart/${userId}`);
    if (!response.ok) throw new Error('Ошибка загрузки корзины');
    return response.json();
  },
  
  addToCart: async (userId, productId, quantity = 1) => {
    const response = await fetch(`${API_URL}/api/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, productId, quantity })
    });
    if (!response.ok) throw new Error('Ошибка добавления');
    return response.json();
  },
  
  updateCartItem: async (userId, productId, quantity) => {
    const response = await fetch(`${API_URL}/api/cart/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, productId, quantity })
    });
    if (!response.ok) throw new Error('Ошибка обновления');
    return response.json();
  },
  
  removeFromCart: async (userId, productId) => {
    const response = await fetch(`${API_URL}/api/cart/remove`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, productId })
    });
    if (!response.ok) throw new Error('Ошибка удаления');
    return response.json();
  },

  // Заказы
  createOrder: async (userId, orderData) => {
    const response = await fetch(`${API_URL}/api/orders/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...orderData })
    });
    if (!response.ok) throw new Error('Ошибка оформления заказа');
    return response.json();
  },

  getOrders: async (userId) => {
    const response = await fetch(`${API_URL}/api/orders/${userId}`);
    if (!response.ok) throw new Error('Ошибка получения заказов');
    return response.json();
  }
};