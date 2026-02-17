import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './profile.css';

const Profile = ({ onLogout, user }) => {
  const currentUser = user || JSON.parse(localStorage.getItem('activeUser') || 'null');
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [hospital, setHospital] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: '', time: '', doctor: '', reason: '' });

  useEffect(() => {
    const savedAppointment = localStorage.getItem('appointment');
    const savedHospital = localStorage.getItem('confirmedHospital');
    if (savedAppointment) setAppointment(JSON.parse(savedAppointment));
    if (savedHospital) setHospital(JSON.parse(savedHospital));
  }, []);

  if (!currentUser) return <div style={{ padding: 40 }}>Загрузка...</div>;

  const handleSaveAppointment = () => {
    if (!form.date || !form.time) return;
    const newAppointment = { ...form, createdAt: new Date().toLocaleDateString('ru-RU') };
    setAppointment(newAppointment);
    localStorage.setItem('appointment', JSON.stringify(newAppointment));
    setShowForm(false);
  };

  const handleCancelAppointment = () => {
    setAppointment(null);
    localStorage.removeItem('appointment');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="profile-wrapper">
      {/* Шапка */}
      <header className="profile-header">
        <div className="profile-header-left">
          <button className="back-btn" onClick={() => navigate('/home')}>← Назад</button>
          <div className="profile-logo">MedApp</div>
        </div>
        <div className="profile-header-right">
          <span className="profile-email">{currentUser.email}</span>
          <button className="profile-logout-btn" onClick={onLogout}>Выйти</button>
        </div>
      </header>

      <main className="profile-main">

        {/* Верхний блок — аватар + имя */}
        <div className="profile-hero">
          <div className="profile-avatar">{getInitials(currentUser.fullName)}</div>
          <div className="profile-hero-info">
            <h1 className="profile-name">{currentUser.fullName || 'Пользователь'}</h1>
            <p className="profile-meta-text">{currentUser.email}</p>
            <span className="profile-status">✅ Аккаунт подтверждён</span>
          </div>
        </div>

        <div className="profile-grid">

          {/* Личные данные */}
          <div className="profile-card">
            <div className="profile-card-header">
              <span className="profile-card-icon">👤</span>
              <h3>Личные данные</h3>
            </div>
            <div className="profile-fields">
              <ProfileField label="ФИО" value={currentUser.fullName} />
              <ProfileField label="Email" value={currentUser.email} />
              <ProfileField label="Телефон" value={currentUser.phone} />
              <ProfileField label="ИИН" value={currentUser.iin} />
            </div>
          </div>

          {/* Прикреплённая больница */}
          <div className="profile-card">
            <div className="profile-card-header">
              <span className="profile-card-icon">🏥</span>
              <h3>Прикреплённая больница</h3>
            </div>
            {hospital ? (
              <div className="hospital-info">
                <div className="hospital-info-name">{hospital.name}</div>
                <div className="hospital-info-row">📍 {hospital.address}</div>
                <div className="hospital-info-row">📞 {hospital.phone}</div>
                <div className="hospital-info-row">🕐 {hospital.workTime}</div>
                <div className="hospital-info-tags">
                  {hospital.tags?.map(tag => (
                    <span key={tag} className="profile-tag">{tag}</span>
                  ))}
                </div>
                <button className="change-hospital-btn" onClick={() => navigate('/home')}>
                  Сменить больницу
                </button>
              </div>
            ) : (
              <div className="no-hospital">
                <p>Вы ещё не прикреплены к больнице</p>
                <button className="change-hospital-btn" onClick={() => navigate('/home')}>
                  Выбрать больницу
                </button>
              </div>
            )}
          </div>

          {/* Запись на приём */}
          <div className="profile-card profile-card-wide">
            <div className="profile-card-header">
              <span className="profile-card-icon">📅</span>
              <h3>Запись на приём</h3>
            </div>

            {appointment ? (
              <div className="appointment-block">
                <div className="appointment-status">✅ Вы записаны</div>
                <div className="appointment-grid">
                  <AppointmentField icon="📅" label="Дата" value={appointment.date} />
                  <AppointmentField icon="🕐" label="Время" value={appointment.time} />
                  <AppointmentField icon="👨‍⚕️" label="Врач" value={appointment.doctor || 'Не указан'} />
                  <AppointmentField icon="📋" label="Причина" value={appointment.reason || 'Не указана'} />
                </div>
                <div className="appointment-actions">
                  <button className="edit-appointment-btn" onClick={() => { setForm(appointment); setShowForm(true); }}>
                    ✏️ Изменить
                  </button>
                  <button className="cancel-appointment-btn" onClick={handleCancelAppointment}>
                    🗑️ Отменить запись
                  </button>
                </div>
              </div>
            ) : (
              <div className="no-appointment">
                <p>У вас нет активной записи</p>
                <button className="add-appointment-btn" onClick={() => setShowForm(true)}>
                  + Записаться на приём
                </button>
              </div>
            )}

            {/* Форма записи */}
            {showForm && (
              <div className="appointment-form">
                <h4>📝 {appointment ? 'Изменить запись' : 'Новая запись'}</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Дата *</label>
                    <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Время *</label>
                    <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Врач</label>
                  <input type="text" placeholder="Терапевт, Кардиолог..." value={form.doctor} onChange={e => setForm({ ...form, doctor: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Причина визита</label>
                  <input type="text" placeholder="Плановый осмотр, жалобы..." value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} />
                </div>
                <div className="form-btns">
                  <button className="save-btn" onClick={handleSaveAppointment}>Сохранить</button>
                  <button className="cancel-btn" onClick={() => setShowForm(false)}>Отмена</button>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

const ProfileField = ({ label, value }) => (
  <div className="profile-field">
    <span className="profile-field-label">{label}</span>
    <span className="profile-field-value">{value || '—'}</span>
  </div>
);

const AppointmentField = ({ icon, label, value }) => (
  <div className="appointment-field">
    <span className="appointment-field-icon">{icon}</span>
    <div>
      <div className="appointment-field-label">{label}</div>
      <div className="appointment-field-value">{value}</div>
    </div>
  </div>
);

export default Profile;