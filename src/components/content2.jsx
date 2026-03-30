import React from 'react';
import { useNavigate } from 'react-router-dom';
import './content1.css';

const About = ({ onLogout, user }) => {
  const navigate = useNavigate();
  const currentUser = user || JSON.parse(localStorage.getItem('activeUser') || 'null');

  return (
    <div className="about-wrapper">

      <header className="about-header">
        <div className="about-header-left">
          <button className="back-btn" onClick={() => navigate('/home')}>← Назад</button>
          <div className="about-logo">MedApp</div>
        </div>
        <div className="about-header-right">
          {currentUser && <span className="about-email">{currentUser.email}</span>}
          {currentUser && <button className="about-profile-btn" onClick={() => navigate('/profile')}>👤 Профиль</button>}
          {currentUser && <button className="about-logout-btn" onClick={onLogout}>Выйти</button>}
          {!currentUser && <button className="about-register-btn" onClick={() => navigate('/register')}>Регистрация</button>}
        </div>
      </header>

      <main className="about-main">

        <div className="about-hero">
          <div className="about-hero-content">
            <h1 className="about-hero-title">Ваше здоровье — в надёжных руках 🩺</h1>
            <p className="about-hero-text">
              MedApp — это современный цифровой помощник для управления вашим здоровьем. 
              Прикрепляйтесь к лучшим клиникам Астаны, записывайтесь на приём и храните все медицинские данные в одном месте.
            </p>
            <button className="about-cta-btn" onClick={() => navigate('/register')}>
              Начать сейчас — это бесплатно →
            </button>
          </div>
          <div className="about-hero-image">
            <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800" alt="Medical" />
          </div>
        </div>


        <section className="about-features">
          <h2 className="section-title">Почему выбирают MedApp?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🏥</div>
              <h3>8+ ведущих клиник</h3>
              <p>Лучшие государственные и частные медицинские учреждения Астаны в одном приложении</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Онлайн-запись 24/7</h3>
              <p>Записывайтесь на приём в любое время, выбирайте врача и удобное время визита</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💾</div>
              <h3>Единая медкарта</h3>
              <p>Храните всю историю посещений, анализы и назначения в одном безопасном месте</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Рейтинги и отзывы</h3>
              <p>Читайте реальные отзывы пациентов и выбирайте лучшие клиники по рейтингу</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3>Напоминания</h3>
              <p>Не забывайте о визитах — мы пришлём уведомления о предстоящих приёмах</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Безопасность данных</h3>
              <p>Ваши медицинские данные защищены современным шифрованием</p>
            </div>
          </div>
        </section>

        <section className="about-how">
          <h2 className="section-title">Как это работает?</h2>
          <div className="how-steps">
            <div className="how-step">
              <div className="step-number">1</div>
              <h3>Регистрация</h3>
              <p>Создайте аккаунт за 2 минуты — нужен только email и базовые данные</p>
            </div>
            <div className="how-arrow">→</div>
            <div className="how-step">
              <div className="step-number">2</div>
              <h3>Выбор клиники</h3>
              <p>Изучите рейтинги, отзывы и прикрепитесь к понравившейся клинике</p>
            </div>
            <div className="how-arrow">→</div>
            <div className="how-step">
              <div className="step-number">3</div>
              <h3>Запись на приём</h3>
              <p>Выберите дату, время и врача — готово, вы записаны!</p>
            </div>
          </div>
        </section>


        <section className="about-stats">
          <div className="stat-item">
            <div className="stat-number">8+</div>
            <div className="stat-label">Клиник в базе</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">1500+</div>
            <div className="stat-label">Довольных пациентов</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">4.7★</div>
            <div className="stat-label">Средний рейтинг</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Доступность</div>
          </div>
        </section>


        <section className="about-cta">
          <h2>Готовы начать?</h2>
          <p>Присоединяйтесь к тысячам пользователей, которые уже управляют своим здоровьем с MedApp</p>
          <button className="cta-large-btn" onClick={() => navigate('/register')}>
            Зарегистрироваться бесплатно
          </button>
        </section>
      </main>



      <footer className="about-footer">
        <div className="footer-content">
          <div className="footer-col">
            <h4>MedApp</h4>
            <p>Ваш цифровой медицинский помощник</p>
          </div>
          <div className="footer-col">
            <h4>Навигация</h4>
            <button onClick={() => navigate('/home')}>Главная</button>
            <button onClick={() => navigate('/clinics')}>Клиники</button>
            <button onClick={() => navigate('/about')}>О нас</button>
          </div>
          <div className="footer-col">
            <h4>Поддержка</h4>
            <p>Email: support@medapp.kz</p>
            <p>Телефон: +7 (777) 123-45-67</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 MedApp. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;