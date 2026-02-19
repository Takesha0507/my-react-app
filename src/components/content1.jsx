import React from 'react';
import { useNavigate } from 'react-router-dom';
import './content2.css';

const CLINICS_DATA = [
  {
    id: 1,
    name: 'Национальный научный медицинский центр',
    description: 'Ведущий многопрофильный медицинский центр Казахстана, оснащённый современным оборудованием и укомплектованный высококвалифицированными специалистами. Центр специализируется на сложных хирургических операциях, кардиологии и неврологии.',
    image: 'https://files.medelement.com/uploads/co/693892091429093755/information/0dc89c3f0141a1376849abd8811d4be0.JPG',
    specialties: ['Хирургия', 'Кардиология', 'Неврология', 'Онкология'],
    features: ['Круглосуточная скорая помощь', 'Современные операционные', 'Реанимация', 'МРТ и КТ диагностика'],
    rating: 4.8,
    address: 'пр. Абылай хана, 42',
  },
  {
    id: 2,
    name: 'Tesla-Med Диагностический центр',
    description: 'Специализированный диагностический центр с новейшим оборудованием для МРТ, КТ и УЗИ исследований. Быстрые и точные результаты, квалифицированные врачи-диагносты с международным опытом.',
    image: 'https://avatars.mds.yandex.net/get-altay/13947802/2a00000193000c1ff944300733daf7dacd9f/orig',
    specialties: ['МРТ', 'КТ', 'УЗИ', 'Рентген'],
    features: ['Аппараты последнего поколения', 'Результаты в день обращения', 'Онлайн-запись', 'Удобная парковка'],
    rating: 4.9,
    address: 'ул. Петрова, 30',
  },
  {
    id: 3,
    name: 'Alanda Clinic',
    description: 'Современная частная клиника европейского уровня. Специализируется на эстетической медицине, косметологии и женском здоровье. Индивидуальный подход к каждому пациенту.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1U2op46KTBGPjk6qovXtSca4YKMsrAOzy3w&s',
    specialties: ['Косметология', 'Гинекология', 'УЗИ', 'Эстетическая хирургия'],
    features: ['Безопасные процедуры', 'VIP-палаты', 'Консультации онлайн', 'Программы check-up'],
    rating: 4.7,
    address: 'пр. Тауелсыздык, 33',
  },
  {
    id: 4,
    name: 'НЦМД — Центр материнства и детства',
    description: 'Крупнейший перинатальный центр Казахстана. Специализируется на ведении беременности, родовспоможении и педиатрии. Комфортные условия для мам и малышей.',
    image: 'data:image/jpeg;base64,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',
    specialties: ['Педиатрия', 'Роддом', 'Неонатология', 'Акушерство'],
    features: ['Современный роддом', 'Отделение реанимации новорождённых', 'Семейные палаты', 'Школа материнства'],
    rating: 4.5,
    address: 'пр. Туран, 34/1',
  },
  {
    id: 5,
    name: 'Stanford Medical Clinic',
    description: 'Многопрофильная клиника с фокусом на терапию, эндокринологию и диагностику. Врачи с опытом работы в США и Европе. Современные протоколы лечения.',
    image: 'https://files.medelement.com/uploads/co/476224371616744222/gallery_photos/4aa53a0ea53cd6059c208ea17dd1fc0a.JPG',
    specialties: ['Диагностика', 'Терапия', 'Эндокринология', 'Кардиология'],
    features: ['Комплексные программы обследования', 'Лаборатория на месте', 'Телемедицина', 'Персональный менеджер здоровья'],
    rating: 4.6,
    address: 'пр. Кабанбай батыра, 28',
  },
  {
    id: 6,
    name: 'НЦТО им. академика Батпенова',
    description: 'Национальный центр травматологии и ортопедии. Лидер в области лечения травм, протезирования суставов и реабилитации. Уникальные операции мирового уровня.',
    image: 'https://avatars.mds.yandex.net/get-altay/15346589/2a000001976145982a539f310071ad30fdd7/L_height',
    specialties: ['Травматология', 'Ортопедия', 'Реабилитация', 'Протезирование'],
    features: ['Эндопротезирование суставов', 'Спортивная медицина', 'Реабилитационный центр', 'Артроскопия'],
    rating: 4.6,
    address: 'ул. Кенесары, 82',
  },
];

const Clinics = ({ onLogout, user }) => {
  const navigate = useNavigate();
  const currentUser = user || JSON.parse(localStorage.getItem('activeUser') || 'null');

  return (
    <div className="clinics-wrapper">
      <header className="clinics-header">
        <div className="clinics-header-left">
          <button className="back-btn" onClick={() => navigate('/home')}>← Назад</button>
          <div className="clinics-logo">MedApp</div>
        </div>
        <div className="clinics-header-right">
          {currentUser && <span className="clinics-email">{currentUser.email}</span>}
          {currentUser && <button className="clinics-profile-btn" onClick={() => navigate('/profile')}>👤 Профиль</button>}
          {currentUser && <button className="clinics-logout-btn" onClick={onLogout}>Выйти</button>}
          {!currentUser && <button className="clinics-login-btn" onClick={() => navigate('/register')}>Войти</button>}
        </div>
      </header>

      <main className="clinics-main">
        {/* Герой-секция */}
        <div className="clinics-hero">
          <h1 className="clinics-hero-title">🏥 Клиники Астаны</h1>
          <p className="clinics-hero-subtitle">
            Лучшие медицинские учреждения столицы с современным оборудованием и квалифицированными специалистами
          </p>
        </div>

        {/* Список клиник */}
        <div className="clinics-list">
          {CLINICS_DATA.map((clinic) => (
            <div key={clinic.id} className="clinic-detail-card">
              <div className="clinic-image-wrapper">
                <img src={clinic.image} alt={clinic.name} className="clinic-image" />
                <div className="clinic-rating-badge">
                  ⭐ {clinic.rating}
                </div>
              </div>

              <div className="clinic-content">
                <h2 className="clinic-detail-name">{clinic.name}</h2>
                <p className="clinic-address">📍 {clinic.address}</p>
                <p className="clinic-description">{clinic.description}</p>

                <div className="clinic-specialties">
                  <h4>Специализации:</h4>
                  <div className="clinic-tags">
                    {clinic.specialties.map(spec => (
                      <span key={spec} className="clinic-tag">{spec}</span>
                    ))}
                  </div>
                </div>

                <div className="clinic-features">
                  <h4>Особенности:</h4>
                  <ul>
                    {clinic.features.map((feature, idx) => (
                      <li key={idx}>✓ {feature}</li>
                    ))}
                  </ul>
                </div>

                <button className="clinic-book-btn" onClick={() => navigate('/home')}>
                  Прикрепиться к клинике
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Футер */}
      <footer className="clinics-footer">
        <p>© 2026 MedApp. Все права защищены.</p>
        <div className="footer-links">
          <button onClick={() => navigate('/about')}>О сервисе</button>
          <button onClick={() => navigate('/clinics')}>Клиники</button>
          <button onClick={() => navigate('/home')}>Главная</button>
        </div>
      </footer>
    </div>
  );
};

export default Clinics;