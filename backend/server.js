const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Подключение к базе данных
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bakery'
});

const promiseDb = db.promise();

db.connect(err => {
  if (err) {
    console.error('❌ Ошибка подключения к БД:', err);
    return;
  }
  console.log('✅ Подключено к MySQL');
});

// ========== ТЕСТОВЫЙ МАРШРУТ ==========
app.get('/test', (req, res) => {
  res.json({ message: 'Сервер работает!' });
});

// ========== ТОВАРЫ ==========
app.get('/api/products', (req, res) => {
  console.log('📦 Запрос товаров');
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      console.error('Ошибка:', err);
      return res.status(500).json({ error: err.message });
    }
    console.log('✅ Отправлено товаров:', results.length);
    res.json(results);
  });
});

// ========== РЕГИСТРАЦИЯ ==========
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  
  console.log('📝 Регистрация:', email);
  
  // Проверяем, существует ли пользователь
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error('Ошибка запроса:', err);
      return res.json({ success: false, error: 'Ошибка базы данных' });
    }
    
    if (results.length > 0) {
      return res.json({ success: false, error: 'Email уже занят' });
    }
    
    // Хешируем пароль
    const hash = await bcrypt.hash(password, 10);
    
    // Сохраняем пользователя
    db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
      [name, email, hash], 
      (err, result) => {
        if (err) {
          console.error('Ошибка сохранения:', err);
          return res.json({ success: false, error: 'Ошибка при регистрации' });
        }
        console.log('✅ Пользователь зарегистрирован:', email);
        res.json({ success: true, userId: result.insertId });
      }
    );
  });
});

// ========== ВХОД ==========
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('🔐 Вход:', email);
  
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Ошибка запроса:', err);
      return res.json({ success: false, error: 'Ошибка базы данных' });
    }
    
    if (results.length === 0) {
      console.log('❌ Пользователь не найден:', email);
      return res.json({ success: false, error: 'Пользователь не найден' });
    }
    
    const user = results[0];
    
    bcrypt.compare(password, user.password, (err, isValid) => {
      if (err) {
        console.error('Ошибка сравнения:', err);
        return res.json({ success: false, error: 'Ошибка проверки пароля' });
      }
      
      if (!isValid) {
        console.log('❌ Неверный пароль для:', email);
        return res.json({ success: false, error: 'Неверный пароль' });
      }
      
      console.log('✅ Вход выполнен:', email);
      res.json({ 
        success: true, 
        userId: user.id, 
        name: user.name, 
        email: user.email 
      });
    });
  });
});

// ========== КОРЗИНА - ПОЛУЧЕНИЕ ==========
app.get('/api/cart/:userId', (req, res) => {
  const { userId } = req.params;
  
  db.query('SELECT id FROM carts WHERE user_id = ?', [userId], (err, cart) => {
    if (err) {
      console.error('Ошибка:', err);
      return res.status(500).json({ error: 'Ошибка' });
    }
    
    if (cart.length === 0) {
      return res.json({ items: [], total: 0 });
    }
    
    const cartId = cart[0].id;
    db.query(`
      SELECT ci.id, ci.product_id, ci.quantity, p.title, p.price, p.img
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = ?
    `, [cartId], (err, items) => {
      if (err) {
        console.error('Ошибка:', err);
        return res.status(500).json({ error: 'Ошибка' });
      }
      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      res.json({ items, total });
    });
  });
});

// ========== КОРЗИНА - ДОБАВЛЕНИЕ ==========
app.post('/api/cart/add', (req, res) => {
  const { userId, productId, quantity = 1 } = req.body;
  
  db.query('SELECT id FROM carts WHERE user_id = ?', [userId], (err, cart) => {
    if (err) {
      console.error('Ошибка:', err);
      return res.status(500).json({ error: 'Ошибка' });
    }
    
    if (cart.length === 0) {
      db.query('INSERT INTO carts (user_id) VALUES (?)', [userId], (err, result) => {
        if (err) {
          console.error('Ошибка создания корзины:', err);
          return res.status(500).json({ error: 'Ошибка' });
        }
        addToCartItem(result.insertId, productId, quantity, res);
      });
    } else {
      addToCartItem(cart[0].id, productId, quantity, res);
    }
  });
});

function addToCartItem(cartId, productId, quantity, res) {
  db.query(`
    INSERT INTO cart_items (cart_id, product_id, quantity)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE quantity = quantity + ?
  `, [cartId, productId, quantity, quantity], (err) => {
    if (err) {
      console.error('Ошибка добавления:', err);
      return res.status(500).json({ error: 'Ошибка' });
    }
    res.json({ success: true });
  });
}

// ========== КОРЗИНА - ОБНОВЛЕНИЕ ==========
app.put('/api/cart/update', (req, res) => {
  const { userId, productId, quantity } = req.body;
  
  db.query('SELECT id FROM carts WHERE user_id = ?', [userId], (err, cart) => {
    if (err) return res.status(500).json({ error: 'Ошибка' });
    if (cart.length === 0) return res.status(404).json({ error: 'Корзина не найдена' });
    
    if (quantity <= 0) {
      db.query('DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?', 
        [cart[0].id, productId], (err) => {
          if (err) return res.status(500).json({ error: 'Ошибка' });
          res.json({ success: true });
        });
    } else {
      db.query('UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?',
        [quantity, cart[0].id, productId], (err) => {
          if (err) return res.status(500).json({ error: 'Ошибка' });
          res.json({ success: true });
        });
    }
  });
});

// ========== КОРЗИНА - УДАЛЕНИЕ ==========
app.delete('/api/cart/remove', (req, res) => {
  const { userId, productId } = req.body;
  
  db.query('SELECT id FROM carts WHERE user_id = ?', [userId], (err, cart) => {
    if (err) return res.status(500).json({ error: 'Ошибка' });
    if (cart.length === 0) return res.status(404).json({ error: 'Корзина не найдена' });
    
    db.query('DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [cart[0].id, productId], (err) => {
        if (err) return res.status(500).json({ error: 'Ошибка' });
        res.json({ success: true });
      });
  });
});

// ========== ЗАКАЗЫ - СОЗДАНИЕ ==========
app.post('/api/orders/create', async (req, res) => {
  const { userId, address, phone, comment } = req.body;
  
  console.log('🔥 ПОЛУЧЕН ЗАКАЗ:', { userId, address, phone });
  
  if (!userId || !address || !phone) {
    return res.status(400).json({ error: 'Заполните все поля' });
  }
  
  try {
    const [cart] = await promiseDb.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
    if (cart.length === 0) {
      return res.status(400).json({ error: 'Корзина пуста' });
    }
    
    const [items] = await promiseDb.query(`
      SELECT ci.product_id, ci.quantity, p.price
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = ?
    `, [cart[0].id]);
    
    if (items.length === 0) {
      return res.status(400).json({ error: 'Корзина пуста' });
    }
    
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const [order] = await promiseDb.query(`
      INSERT INTO orders (user_id, total, address, phone, comment, status)
      VALUES (?, ?, ?, ?, ?, 'new')
    `, [userId, total, address, phone, comment || '']);
    
    for (const item of items) {
      await promiseDb.query(`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?)
      `, [order.insertId, item.product_id, item.quantity, item.price]);
    }
    
    await promiseDb.query('DELETE FROM cart_items WHERE cart_id = ?', [cart[0].id]);
    
    console.log('✅ ЗАКАЗ СОЗДАН! ID:', order.insertId);
    res.json({ success: true, orderId: order.insertId });
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
    res.status(500).json({ error: 'Ошибка: ' + error.message });
  }
});

// ========== ЗАКАЗЫ - ПОЛУЧЕНИЕ ==========
app.get('/api/orders/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const [orders] = await promiseDb.query(`
      SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC
    `, [userId]);
    
    for (let order of orders) {
      const [items] = await promiseDb.query(`
        SELECT oi.*, p.title, p.img
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [order.id]);
      order.items = items;
    }
    
    res.json(orders);
  } catch (error) {
    console.error('Ошибка:', error);
    res.status(500).json({ error: 'Ошибка получения заказов' });
  }
});

// ========== ЗАПУСК СЕРВЕРА ==========
app.listen(5000, () => {
  console.log('🚀 Сервер запущен на http://localhost:5000');
  console.log('✅ Готов к работе!');
});