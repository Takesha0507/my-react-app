import React, { useState } from 'react';
import '../App.css';
import authService from '../services/authService';

const Login = ({ onAuthSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.email.includes('@')) {
      newErrors.email = 'Неверный формат почты';
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await authService.login(formData.email, formData.password);
      if (response.user) {
        onAuthSuccess(response.user);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Ошибка при входе';
      setErrors({ submit: errorMessage });
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registration-card">
      <h2>Вход в аккаунт</h2>
      <form onSubmit={handleSubmit}>
        
        {errors.submit && <div className="error-text" style={{marginBottom: '15px', padding: '10px', backgroundColor: '#ffe0e0', borderRadius: '4px'}}>{errors.submit}</div>}
        
        <div className="input-group">
          <label>Электронная почта</label>
          <input 
            type="email" 
            name="email" 
            placeholder="example@gmail.com" 
            value={formData.email}
            onChange={handleChange} 
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="input-group">
          <label>Пароль</label>
          <input 
            type="password" 
            name="password" 
            placeholder="Введите пароль" 
            value={formData.password}
            onChange={handleChange} 
          />
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? 'Загрузка...' : 'Войти'}
        </button>
        
        <div className="auth-footer">
          <p>Нет аккаунта? <a href="/registration">Зарегистрироваться</a></p>
        </div>
      </form>
    </div>
  );
};

export default Login;