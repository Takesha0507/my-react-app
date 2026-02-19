import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';

const HOSPITALS = [
  {
    id: 1,
    name: 'Национальный научный медицинский центр',
    address: 'пр. Абылай хана, 42',
    type: 'Многопрофильный',
    rating: 4.8,
    reviews: 312,
    phone: '+7 (7172) 69-71-98',
    workTime: 'Круглосуточно',
    tags: ['Хирургия', 'Кардиология', 'Неврология'],
  },
  {
    id: 2,
    name: 'Городская больница №2',
    address: 'ул. Бейбитшилик, 54',
    type: 'Государственная',
    rating: 4.2,
    reviews: 187,
    phone: '+7 (7172) 32-44-78',
    workTime: 'Круглосуточно',
    tags: ['Терапия', 'Хирургия', 'Педиатрия'],
  },
  {
    id: 3,
    name: 'Alanda Clinic',
    address: 'пр. Тауелсыздык, 33',
    type: 'Частная',
    rating: 4.7,
    reviews: 254,
    phone: '+7 (7172) 51-53-00',
    workTime: 'Пн–Сб 8:00–20:00',
    tags: ['Косметология', 'Гинекология', 'УЗИ'],
  },
  {
    id: 4,
    name: 'Stanford Medical Clinic',
    address: 'пр. Кабанбай батыра, 28',
    type: 'Частная',
    rating: 4.6,
    reviews: 198,
    phone: '+7 (7172) 51-53-53',
    workTime: 'Пн–Пт 9:00–19:00',
    tags: ['Диагностика', 'Терапия', 'Эндокринология'],
  },
  {
    id: 5,
    name: 'НЦМД — Центр материнства и детства',
    address: 'пр. Туран, 34/1',
    type: 'Государственная',
    rating: 4.5,
    reviews: 423,
    phone: '+7 (7172) 79-36-23',
    workTime: 'Круглосуточно',
    tags: ['Педиатрия', 'Роддом', 'Неонатология'],
  },
  {
    id: 6,
    name: 'Tesla-Med Диагностический центр',
    address: 'ул. Петрова, 30',
    type: 'Частная',
    rating: 4.9,
    reviews: 341,
    phone: '+7 (700) 836-91-77',
    workTime: 'Круглосуточно',
    tags: ['МРТ', 'КТ', 'УЗИ'],
  },
  {
    id: 7,
    name: 'Медицинский центр Самрук',
    address: 'пр. Кабанбай батыра, 58Б',
    type: 'Частная',
    rating: 4.4,
    reviews: 134,
    phone: '+7 (701) 026-94-54',
    workTime: 'Пн–Сб 8:00–21:00',
    tags: ['Терапия', 'Лабораторная диагностика'],
  },
  {
    id: 8,
    name: 'НЦТО им. академика Батпенова',
    address: 'ул. Кенесары, 82',
    type: 'Государственная',
    rating: 4.6,
    reviews: 276,
    phone: '+7 (7172) 69-71-99',
    workTime: 'Пн–Пт 8:00–18:00',
    tags: ['Травматология', 'Ортопедия', 'Реабилитация'],
  },
];

const Stars = ({ rating }) => {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= Math.round(rating) ? 'star filled' : 'star'}
        >★</span>
      ))}
      <span className="rating-num">{rating.toFixed(1)}</span>
    </div>
  );
};

const Home = ({ onLogout, user }) => {
  const currentUser = user || JSON.parse(localStorage.getItem('activeUser') || 'null');
  const navigate = useNavigate();
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('Все');
  const [confirmedHospital, setConfirmedHospital] = useState(() => {
    const saved = localStorage.getItem('confirmedHospital');
    return saved ? JSON.parse(saved) : null;
  });

  if (!currentUser) return <div style={{ padding: 40 }}>Загрузка...</div>;

  const types = ['Все', 'Государственная', 'Частная', 'Многопрофильный'];

  const filtered = HOSPITALS.filter((h) => {
    const matchSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchType = filterType === 'Все' || h.type === filterType;
    return matchSearch && matchType;
  });

  const handleSelect = (hospital) => {
    setSelectedHospital(hospital);
  };

  const handleConfirm = () => {
    setConfirmedHospital(selectedHospital);
    localStorage.setItem('confirmedHospital', JSON.stringify(selectedHospital));
    setSelectedHospital(null);
  };

  return (
    <div className="home-wrapper">

      <header className="home-header">
        <div className="home-logo">MedApp</div>
        <div className="home-header-right">
          <button className="home-nav-btn" onClick={() => navigate('/clinics')}>🏥 Клиники</button>
          <button className="home-nav-btn" onClick={() => navigate('/about')}>ℹ️ О сервисе</button>
          <span className="home-user-email">{currentUser.email}</span>
          <button className="home-profile-btn" onClick={() => navigate('/profile')}>👤 Профиль</button>
          <button className="home-logout-btn" onClick={onLogout}>Выйти</button>
        </div>
      </header>

      <main className="home-main">

        <div className="home-banner">
          <h1 className="home-banner-title">
            Добро пожаловать, {currentUser.fullName || 'пользователь'}! 👋
          </h1>
          <p className="home-banner-sub">
            {confirmedHospital
              ? `Ваша больница: ${confirmedHospital.name}`
              : 'Выберите больницу для прикрепления'}
          </p>
        </div>


        <div className="home-cards-grid">
          <InfoCard label="ФИО" value={currentUser.fullName || '—'} icon="👤" />
          <InfoCard label="Email" value={currentUser.email} icon="📧" />
          <InfoCard label="Телефон" value={currentUser.phone || '—'} icon="📞" />
          <InfoCard label="ИИН" value={currentUser.iin || '—'} icon="🪪" />
        </div>


        <div className="hospital-section">
          <div className="hospital-section-header">
            <h2 className="hospital-section-title">🏥 Больницы Астаны</h2>
            {confirmedHospital && (
              <span className="hospital-selected-badge">
                ✓ Прикреплено: {confirmedHospital.name}
              </span>
            )}
          </div>


          <div className="hospital-controls">
            <input
              className="hospital-search"
              type="text"
              placeholder="Поиск по названию, адресу, специализации..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="hospital-filters">
              {types.map((type) => (
                <button
                  key={type}
                  className={`filter-btn ${filterType === type ? 'active' : ''}`}
                  onClick={() => setFilterType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

 
          <div className="hospital-list">
            {filtered.length === 0 && (
              <p className="hospital-empty">Ничего не найдено</p>
            )}
            {filtered.map((hospital) => (
              <div
                key={hospital.id}
                className={`hospital-card ${selectedHospital?.id === hospital.id ? 'selected' : ''} ${confirmedHospital?.id === hospital.id ? 'confirmed' : ''}`}
                onClick={() => handleSelect(hospital)}
              >
                <div className="hospital-card-top">
                  <div>
                    <div className="hospital-name">{hospital.name}</div>
                    <div className="hospital-address">📍 {hospital.address}</div>
                  </div>
                  <div className="hospital-card-right">
                    <span className={`hospital-type-badge type-${hospital.type === 'Частная' ? 'private' : hospital.type === 'Государственная' ? 'state' : 'multi'}`}>
                      {hospital.type}
                    </span>
                    {confirmedHospital?.id === hospital.id && (
                      <span className="confirmed-mark">✓</span>
                    )}
                  </div>
                </div>

                <Stars rating={hospital.rating} />
                <div className="hospital-reviews">{hospital.reviews} отзывов</div>

                <div className="hospital-tags">
                  {hospital.tags.map((tag) => (
                    <span key={tag} className="hospital-tag">{tag}</span>
                  ))}
                </div>

                <div className="hospital-meta">
                  <span>📞 {hospital.phone}</span>
                  <span>🕐 {hospital.workTime}</span>
                </div>

                {selectedHospital?.id === hospital.id && (
                  <button className="hospital-confirm-btn" onClick={(e) => { e.stopPropagation(); handleConfirm(); }}>
                    Прикрепиться к этой больнице
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

const InfoCard = ({ label, value, icon }) => (
  <div className="info-card">
    <span className="info-card-icon">{icon}</span>
    <div>
      <div className="info-card-label">{label}</div>
      <div className="info-card-value">{value}</div>
    </div>
  </div>
);

export default Home;