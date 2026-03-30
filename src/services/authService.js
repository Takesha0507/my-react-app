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
  },

  // Прикрепить пользователя к больнице
  attachHospital: async (hospitalId) => {
    const response = await api.post('/users/attach-hospital', { hospitalId });
    return response.data;
  },

  // Получить прикреплённую больницу пользователя
  getAttachedHospital: async () => {
    const response = await api.get('/users/attached-hospital');
    return response.data;
  },

  // Проверить авторизован ли пользователь
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default authService;
