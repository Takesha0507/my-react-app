import React, { useState } from 'react';
import '../App.css';

const AuthForm = () => {
  // Состояние: true — вход, false — регистрация
  const [isLogin, setIsLogin] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    iin: '',
    password: '' // Добавили поле пароля
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    let newErrors = {};
    
    // Общая валидация для обоих режимов
    if (!formData.email.includes('@')) newErrors.email = 'Неверный формат почты';
    if (formData.password.length < 6) newErrors.password = 'Минимум 6 символов';

    // Валидация только для регистрации
    if (!isLogin) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Введите ФИО';
      if (formData.iin.length !== 12) newErrors.iin = 'ИИН должен быть 12 цифр';
      if (!formData.phone) newErrors.phone = 'Введите номер';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const action = isLogin ? 'Вход...' : 'Регистрация...';
      alert(`Успех! Действие: ${action}`);
      console.log(formData);
    }
  };

  return (
    <div className="registration-card">
      <h2>{isLogin ? 'Вход в аккаунт' : 'Создать аккаунт'}</h2>
      
      <form onSubmit={handleSubmit}>
        
        {/* Поля, которые видны ТОЛЬКО при регистрации */}
        {!isLogin && (
          <>
            <div className="input-group">
              <label>ФИО</label>
              <input type="text" name="fullName" placeholder="Иванов Иван" onChange={handleChange} />
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>

            <div className="input-group">
              <label>Номер телефона</label>
              <input type="tel" name="phone" placeholder="+7 (___) ___-__-__" onChange={handleChange} />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            <div className="input-group">
              <label>ИИН</label>
              <input type="text" name="iin" maxLength="12" placeholder="000000000000" onChange={handleChange} />
              {errors.iin && <span className="error-text">{errors.iin}</span>}
            </div>
          </>
        )}

        {/* Общие поля для входа и регистрации */}
        <div className="input-group">
          <label>Email</label>
          <input type="email" name="email" placeholder="example@gmail.com" onChange={handleChange} />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="input-group">
          <label>Пароль</label>
          <input type="password" name="password" placeholder="******" onChange={handleChange} />
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>

        <button type="submit" className="submit-btn">
          {isLogin ? 'Войти' : 'Зарегистрироваться'}
        </button>
      </form>

      {/* Переключатель внизу */}
      <div className="toggle-auth">
        <p>
          {isLogin ? 'Еще нет аккаунта?' : 'Уже есть аккаунт?'}
          <button 
            className="link-btn" 
            onClick={() => {
              setIsLogin(!isLogin);
              setErrors({}); // Сбрасываем ошибки при переключении
            }}
          >
            {isLogin ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;