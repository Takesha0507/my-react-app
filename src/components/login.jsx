import React, { useState } from 'react';
import '../App.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Данные для входа:', formData);
      alert('Вход выполнен успешно!');
      // Здесь обычно вызывается API для авторизации
    }
  };

  return (
    <div className="registration-card">
      <h2>Вход в аккаунт</h2>
      <form onSubmit={handleSubmit}>
        
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

        <button type="submit" className="submit-btn">Войти</button>
        
        <div className="auth-footer">
          <p>Нет аккаунта? <a href="/registration">Зарегистрироваться</a></p>
        </div>
      </form>
    </div>
  );
};

export default Login;