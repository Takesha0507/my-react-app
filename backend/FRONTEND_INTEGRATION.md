# 🔗 ИНТЕГРАЦИЯ REACT С BACKEND

Пошаговая инструкция по подключению твоего React-приложения к созданному backend API.

---

## ШАГ 1: УСТАНОВКА AXIOS

Axios — библиотека для HTTP-запросов к API.

```bash
cd my-react-app
npm install axios
```

---

## ШАГ 2: СОЗДАНИЕ API СЕРВИСА

Создай файл `src/services/api.js`:

```javascript
import axios from 'axios';

// Базовый URL API
const API_URL = 'http://localhost:5000/api';

// Создаём экземпляр axios с настройками
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor для автоматического добавления токена
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
```

---

## ШАГ 3: СОЗДАНИЕ AUTH SERVICE

Создай файл `src/services/authService.js`:

```javascript
import api from './api';

const authService = {
  // Регистрация
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Вход
  login: async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Выход
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Получить текущего пользователя
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Получить токен
  getToken: () => {
    return localStorage.getItem('token');
  }
};

export default authService;
```

---

## ШАГ 4: ОБНОВЛЕНИЕ RegistrationForm.jsx

Замени старый код на новый с API:

```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './RegistrationForm.css';

const RegistrationForm = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    iin: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Очищаем ошибку при вводе
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.email.includes('@')) {
      newErrors.email = 'Неверный формат почты';
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Минимум 6 символов';
    }
    if (!isLogin) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Введите ФИО';
      }
      if (formData.iin.length !== 12) {
        newErrors.iin = 'ИИН должен быть 12 цифр';
      }
      if (!formData.phone) {
        newErrors.phone = 'Введите номер';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      let response;
      
      if (isLogin) {
        // Вход через API
        response = await authService.login(formData.email, formData.password);
      } else {
        // Регистрация через API
        response = await authService.register(formData);
      }

      // Успешная авторизация
      onAuthSuccess(response.user);
      navigate('/home');
      
    } catch (error) {
      console.error('Ошибка авторизации:', error);
      
      // Обработка ошибок от сервера
      if (error.response && error.response.data) {
        setErrors({ 
          email: error.response.data.message || 'Ошибка сервера' 
        });
      } else {
        setErrors({ 
          email: 'Не удалось подключиться к серверу' 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <div className="auth-card">
          <h2 className="auth-title">
            {isLogin ? 'Вход в аккаунт' : 'Создать аккаунт'}
          </h2>
          <p className="auth-subtitle">
            {isLogin ? 'Введите данные для входа' : 'Заполните данные для регистрации'}
          </p>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="auth-input-group">
                  <label className="auth-label">ФИО</label>
                  <input 
                    className="auth-input" 
                    type="text" 
                    name="fullName" 
                    value={formData.fullName}
                    placeholder="Иванов Иван Иванович" 
                    onChange={handleChange} 
                  />
                  {errors.fullName && <span className="auth-error">{errors.fullName}</span>}
                </div>

                <div className="auth-input-group">
                  <label className="auth-label">Номер телефона</label>
                  <input 
                    className="auth-input" 
                    type="tel" 
                    name="phone" 
                    value={formData.phone}
                    placeholder="+7 (___) ___-__-__" 
                    onChange={handleChange} 
                  />
                  {errors.phone && <span className="auth-error">{errors.phone}</span>}
                </div>

                <div className="auth-input-group">
                  <label className="auth-label">ИИН</label>
                  <input 
                    className="auth-input" 
                    type="text" 
                    name="iin" 
                    value={formData.iin}
                    maxLength="12" 
                    placeholder="000000000000" 
                    onChange={handleChange} 
                  />
                  {errors.iin && <span className="auth-error">{errors.iin}</span>}
                </div>
              </>
            )}

            <div className="auth-input-group">
              <label className="auth-label">Email</label>
              <input 
                className="auth-input" 
                type="email" 
                name="email" 
                value={formData.email}
                placeholder="example@gmail.com" 
                onChange={handleChange} 
              />
              {errors.email && <span className="auth-error">{errors.email}</span>}
            </div>

            <div className="auth-input-group">
              <label className="auth-label">Пароль</label>
              <input 
                className="auth-input" 
                type="password" 
                name="password" 
                value={formData.password}
                placeholder="Минимум 6 символов" 
                onChange={handleChange} 
              />
              {errors.password && <span className="auth-error">{errors.password}</span>}
            </div>

            <button 
              type="submit" 
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
            </button>
          </form>

          <div className="auth-toggle">
            <p>
              {isLogin ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
              <button 
                className="auth-link-btn" 
                onClick={() => { 
                  setIsLogin(!isLogin); 
                  setErrors({}); 
                  setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    iin: '',
                    password: ''
                  });
                }}
              >
                {isLogin ? 'Зарегистрироваться' : 'Войти'}
              </button>
            </p>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-right-icon">🏥</div>
        <h2 className="auth-right-title">MedApp</h2>
        <p className="auth-right-sub">
          Ваш личный медицинский помощник
        </p>
      </div>
    </div>
  );
};

export default RegistrationForm;
```

---

## ШАГ 5: ОБНОВЛЕНИЕ App.jsx

```javascript
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RegistrationForm from "./components/RegistrationForm";
import Home from "./components/home";
import Profile from "./components/Profile";
import authService from "./services/authService";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    // Проверяем токен при загрузке
    const token = authService.getToken();
    const user = authService.getCurrentUser();
    
    if (token && user) {
      setActiveUser(user);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setActiveUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    authService.logout();
    setActiveUser(null);
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/home"
          element={isLoggedIn ? <Home onLogout={handleLogout} user={activeUser} /> : <Navigate to="/register" />}
        />
        <Route
          path="/profile"
          element={isLoggedIn ? <Profile onLogout={handleLogout} user={activeUser} /> : <Navigate to="/register" />}
        />
        <Route
          path="/register"
          element={!isLoggedIn ? <RegistrationForm onAuthSuccess={handleLogin} /> : <Navigate to="/home" />}
        />
        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
}

export default App;
```

---

## ШАГ 6: ЗАПУСК

### Терминал 1 — Backend:
```bash
cd backend
npm run dev
```

### Терминал 2 — Frontend:
```bash
cd my-react-app
npm run dev
```

---

## ПРОВЕРКА ИНТЕГРАЦИИ

1. Открой `http://localhost:5173`
2. Зарегистрируй нового пользователя
3. Проверь в MongoDB Compass — появился новый user!
4. Войди с этими данными
5. Перезагрузи страницу — сессия сохранилась (благодаря токену)

---

## TROUBLESHOOTING

### Ошибка CORS:
```
Access to XMLHttpRequest at 'http://localhost:5000' from origin 'http://localhost:5173' has been blocked by CORS
```

**Решение:** Проверь, что в `server.js` есть:
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Backend не запускается:
```
Error: connect ECONNREFUSED ::1:27017
```

**Решение:** MongoDB не запущен. Запусти:
```bash
net start MongoDB
```

---

## ГОТОВО! 🎉

Теперь твой React подключен к MongoDB через Express backend!
