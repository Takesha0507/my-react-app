import api from './api';

const appointmentService = {
  // Получить все приёмы пользователя
  getAll: async () => {
    const response = await api.get('/appointments');
    return response.data;
  },

  // Получить приём по ID
  getById: async (id) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  // Создать приём
  create: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  // Обновить приём
  update: async (id, appointmentData) => {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    return response.data;
  },

  // Отменить приём
  cancel: async (id) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  }
};

export default appointmentService;
