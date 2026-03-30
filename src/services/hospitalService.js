import api from './api';

const hospitalService = {
  // Получить все больницы
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.city) params.append('city', filters.city);
    if (filters.rating) params.append('rating', filters.rating);
    if (filters.search) params.append('search', filters.search);

    const response = await api.get(`/hospitals?${params.toString()}`);
    return response.data;
  },

  // Получить больницу по ID
  getById: async (id) => {
    const response = await api.get(`/hospitals/${id}`);
    return response.data;
  },

  // Создать больницу (admin)
  create: async (hospitalData) => {
    const response = await api.post('/hospitals', hospitalData);
    return response.data;
  },

  // Обновить больницу
  update: async (id, hospitalData) => {
    const response = await api.put(`/hospitals/${id}`, hospitalData);
    return response.data;
  },

  // Удалить больницу
  delete: async (id) => {
    const response = await api.delete(`/hospitals/${id}`);
    return response.data;
  }
};

export default hospitalService;
