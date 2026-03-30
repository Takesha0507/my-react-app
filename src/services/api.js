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

// Interceptor для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Токен истёк или невалиден
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/register';
    }
    return Promise.reject(error);
  }
);

export default api;
