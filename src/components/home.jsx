import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HospitalModal from './HospitalModal';
import hospitalService from '../services/hospitalService';
import authService from '../services/authService';
import './home.css';

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
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [modalHospital, setModalHospital] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('Все');
  const [confirmedHospital, setConfirmedHospital] = useState(null);
  const [loadingAttached, setLoadingAttached] = useState(true);

  // Загружаем больницы из API при монтировании
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setLoading(true);
        const response = await hospitalService.getAll();
        if (response && response.hospitals) {
          setHospitals(response.hospitals);
        } else if (response && Array.isArray(response)) {
          setHospitals(response);
        } else {
          setHospitals([]);
        }
      } catch (err) {
        console.error('Ошибка загрузки больниц:', err);
        setError('Не удалось загрузить список больниц');
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  // Загружаем информацию о прикреплённой больнице
  useEffect(() => {
    const fetchAttachedHospital = async () => {
      try {
        setLoadingAttached(true);
        const response = await authService.getAttachedHospital();
        if (response && response.hospital) {
          setConfirmedHospital(response.hospital);
        }
      } catch (err) {
        console.error('Ошибка загрузки прикреплённой больницы:', err);
      } finally {
        setLoadingAttached(false);
      }
    };

    fetchAttachedHospital();
  }, []);

  if (!currentUser) return <div style={{ padding: 40 }}>Загрузка...</div>;

  const types = ['Все', 'Государственная', 'Частная', 'Многопрофильный'];

  const filtered = hospitals.filter((h) => {
    const matchSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (h.tags && h.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchType = filterType === 'Все' || h.type === filterType;
    return matchSearch && matchType;
  });

  const handleSelect = (hospital) => {
    setSelectedHospital(hospital);
  };

  const handleOpenModal = (hospital) => {
    setModalHospital(hospital);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalHospital(null);
  };

  const handleConfirm = async () => {
    if (modalHospital) {
      try {
        // Сохраняем в БД через API
        const response = await authService.attachHospital(modalHospital._id);
        if (response.success) {
          // Обновляем состояние с сохранённой больницей
          setConfirmedHospital(modalHospital);
          setSelectedHospital(null);
          setIsModalOpen(false);
        }
      } catch (err) {
        console.error('Ошибка при прикреплении:', err);
      }
    }
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
            Добро пожаловать, {currentUser.name || currentUser.fullName || 'пользователь'}! 👋
          </h1>
          <p className="home-banner-sub">
            {confirmedHospital
              ? `Ваша больница: ${confirmedHospital.name}`
              : 'Выберите больницу для прикрепления'}
          </p>
        </div>


        <div className="home-cards-grid">
          <InfoCard label="ФИО" value={currentUser.name || currentUser.fullName || '—'} icon="👤" />
          <InfoCard label="Email" value={currentUser.email} icon="📧" />
          <InfoCard label="Телефон" value={currentUser.phone || '—'} icon="📞" />
          <InfoCard label="ИИН" value={currentUser.iin || '—'} icon="🪪" />
        </div>

        {/* Раздел прикреплённой больницы */}
        <div className="attached-hospital-section">
          <div className="attached-hospital-header">
            <h2 className="attached-hospital-title">🏥 Прикреплённная больница</h2>
          </div>
          
          {loadingAttached ? (
            <p className="attached-hospital-loading">⏳ Загрузка...</p>
          ) : confirmedHospital ? (
            <div className="attached-hospital-card">
              <div className="attached-hospital-top">
                <div>
                  <h3 className="attached-hospital-name">{confirmedHospital.name}</h3>
                  <p className="attached-hospital-address">📍 {confirmedHospital.address}</p>
                </div>
                <span className={`attached-type-badge type-${confirmedHospital.type === 'Частная' ? 'private' : confirmedHospital.type === 'Государственная' ? 'state' : 'multi'}`}>
                  {confirmedHospital.type}
                </span>
              </div>

              <Stars rating={confirmedHospital.rating} />
              <p className="attached-hospital-reviews">{confirmedHospital.reviews} отзывов</p>

              <div className="attached-hospital-info">
                <div className="attached-info-item">
                  <span className="attached-info-label">📞 Телефон:</span>
                  <a href={`tel:${confirmedHospital.phone}`} className="attached-info-value">
                    {confirmedHospital.phone}
                  </a>
                </div>
                <div className="attached-info-item">
                  <span className="attached-info-label">🕐 Рабочее время:</span>
                  <span className="attached-info-value">{confirmedHospital.workingHours}</span>
                </div>
              </div>

              {confirmedHospital.tags && (
                <div className="attached-hospital-tags">
                  <span className="attached-tags-label">💊 Сервисы:</span>
                  <div className="attached-tags-list">
                    {confirmedHospital.tags.map((tag) => (
                      <span key={tag} className="attached-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              <button 
                className="attached-hospital-change-btn"
                onClick={() => {
                  setSelectedHospital(null);
                  document.querySelector('.hospital-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                ✏️ Изменить больницу
              </button>
            </div>
          ) : (
            <div className="attached-hospital-empty">
              <p className="attached-empty-text">Вы ещё не прикреплены к больнице</p>
              <button 
                className="attached-empty-btn"
                onClick={() => document.querySelector('.hospital-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Выбрать больницу
              </button>
            </div>
          )}
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
            {loading && (
              <p className="hospital-empty">⏳ Загрузка больниц...</p>
            )}
            {error && (
              <p className="hospital-empty">❌ {error}</p>
            )}
            {!loading && filtered.length === 0 && (
              <p className="hospital-empty">Ничего не найдено</p>
            )}
            {!loading && filtered.map((hospital) => (
              <div
                key={hospital._id}
                className={`hospital-card ${selectedHospital?._id === hospital._id ? 'selected' : ''} ${confirmedHospital?._id === hospital._id ? 'confirmed' : ''}`}
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
                    {confirmedHospital?._id === hospital._id && (
                      <span className="confirmed-mark">✓</span>
                    )}
                  </div>
                </div>

                <Stars rating={hospital.rating} />
                <div className="hospital-reviews">{hospital.reviews} отзывов</div>

                <div className="hospital-tags">
                  {hospital.tags && hospital.tags.map((tag) => (
                    <span key={tag} className="hospital-tag">{tag}</span>
                  ))}
                </div>

                <div className="hospital-meta">
                  <span>📞 {hospital.phone}</span>
                  <span>🕐 {hospital.workingHours}</span>
                </div>

                {selectedHospital?._id === hospital._id && (
                  <button className="hospital-confirm-btn" onClick={(e) => { e.stopPropagation(); handleOpenModal(hospital); }}>
                    Прикрепиться к этой больнице
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      <HospitalModal
        hospital={modalHospital}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
      />
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