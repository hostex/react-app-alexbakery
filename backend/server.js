const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Подключение к MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',        // Ваш пользователь MySQL
  password: '',        // Ваш пароль (по умолчанию пустая строка)
  database: 'bakery'   // Название базы данных
});

db.connect(err => { 
  if (err) {
    console.error('❌ Ошибка подключения к БД:', err);
    return;
  }
  console.log('✅ Подключено к MySQL');
});

// Регистрация
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      return res.json({ success: false, error: 'Ошибка базы данных' });
    }
    
    if (results.length > 0) {
      return res.json({ success: false, error: 'Email уже занят' });
    }
    
    const hash = await bcrypt.hash(password, 10);
    db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
      [name, email, hash], 
      (err) => {
        if (err) {
          return res.json({ success: false, error: 'Ошибка при регистрации' });
        }
        res.json({ success: true });
      }
    );
  });
});

// Вход
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      return res.json({ success: false, error: 'Ошибка базы данных' });
    }
    
    if (results.length === 0) {
      return res.json({ success: false, error: 'Пользователь не найден' });
    }
    
    const user = results[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.json({ success: false, error: 'Неверный пароль' });
    }
    
    res.json({ 
      success: true, 
      userId: user.id,
      name: user.name,
      email: user.email
    });
  });
});

app.listen(5000, () => console.log('🚀 Сервер запущен: http://localhost:5000'));