import React, { useState } from 'react';
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.email.includes('@')) newErrors.email = 'Неверный формат почты';
    if (formData.password.length < 6) newErrors.password = 'Минимум 6 символов';
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
      if (isLogin) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(
          (u) => u.email === formData.email && u.password === formData.password
        );
        if (user) {
          onAuthSuccess(user);
        } else {
          setErrors({ email: 'Неверный email или пароль' });
        }
      } else {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const exists = users.find((u) => u.email === formData.email);
        if (exists) {
          setErrors({ email: 'Этот email уже зарегистрирован' });
          return;
        }
        const newUser = { ...formData };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        onAuthSuccess(newUser);
      }
    }
  };

  return (
    <div className="auth-wrapper">

      {/* ЛЕВАЯ ЧАСТЬ — форма */}
      <div className="auth-left">
        <div className="auth-card">
          <h2 className="auth-title">{isLogin ? 'Вход в аккаунт' : 'Создать аккаунт'}</h2>
          <p className="auth-subtitle">
            {isLogin ? 'Введите данные для входа' : 'Заполните данные для регистрации'}
          </p>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="auth-input-group">
                  <label className="auth-label">ФИО</label>
                  <input className="auth-input" type="text" name="fullName" placeholder="Иванов Иван Иванович" onChange={handleChange} />
                  {errors.fullName && <span className="auth-error">{errors.fullName}</span>}
                </div>

                <div className="auth-input-group">
                  <label className="auth-label">Номер телефона</label>
                  <input className="auth-input" type="tel" name="phone" placeholder="+7 (___) ___-__-__" onChange={handleChange} />
                  {errors.phone && <span className="auth-error">{errors.phone}</span>}
                </div>

                <div className="auth-input-group">
                  <label className="auth-label">ИИН</label>
                  <input className="auth-input" type="text" name="iin" maxLength="12" placeholder="000000000000" onChange={handleChange} />
                  {errors.iin && <span className="auth-error">{errors.iin}</span>}
                </div>
              </>
            )}

            <div className="auth-input-group">
              <label className="auth-label">Email</label>
              <input className="auth-input" type="email" name="email" placeholder="example@gmail.com" onChange={handleChange} />
              {errors.email && <span className="auth-error">{errors.email}</span>}
            </div>

            <div className="auth-input-group">
              <label className="auth-label">Пароль</label>
              <input className="auth-input" type="password" name="password" placeholder="Минимум 6 символов" onChange={handleChange} />
              {errors.password && <span className="auth-error">{errors.password}</span>}
            </div>

            <button type="submit" className="auth-submit-btn">
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </form>

          <div className="auth-toggle">
            <p>
              {isLogin ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
              <button className="auth-link-btn" onClick={() => { setIsLogin(!isLogin); setErrors({}); }}>
                {isLogin ? 'Зарегистрироваться' : 'Войти'}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* ПРАВАЯ ЧАСТЬ — декор */}
      <div className="auth-right">
        <div className="auth-right-icon">🏥</div>
        <h2 className="auth-right-title">MedApp</h2>
        <p className="auth-right-sub">
          Ваш личный медицинский помощник. Прикрепляйтесь к больницам Астаны и управляйте своим здоровьем.
        </p>
        <div className="auth-right-features">
          <div className="auth-right-feature">✅ Выбор больницы в пару кликов</div>
          <div className="auth-right-feature">⭐ Рейтинги и отзывы пациентов</div>
          <div className="auth-right-feature">📞 Контакты и время работы</div>
          <div className="auth-right-feature">🔒 Безопасное хранение данных</div>
        </div>
      </div>

    </div>
  );
};

export default RegistrationForm;