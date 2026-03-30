import React from 'react';
import './HospitalModal.css';

const HospitalModal = ({ hospital, isOpen, onClose, onConfirm }) => {
  if (!isOpen || !hospital) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Закрыть модаль */}
        <button className="modal-close-btn" onClick={onClose}>✕</button>

        {/* Шапка модали */}
        <div className="modal-header">
          <h2 className="modal-title">{hospital.name}</h2>
          <span className={`modal-type-badge type-${hospital.type === 'Частная' ? 'private' : hospital.type === 'Государственная' ? 'state' : 'multi'}`}>
            {hospital.type}
          </span>
        </div>

        {/* Контент модали */}
        <div className="modal-body">
          {/* Рейтинг и отзывы */}
          <div className="modal-section">
            <div className="modal-rating">
              <div className="stars-large">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={star <= Math.round(hospital.rating) ? 'star-large filled' : 'star-large'}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="modal-rating-value">{hospital.rating.toFixed(1)}</span>
              <span className="modal-reviews-count">({hospital.reviews} отзывов)</span>
            </div>
          </div>

          {/* Адрес */}
          <div className="modal-section">
            <h3 className="modal-section-title">📍 Адрес</h3>
            <p className="modal-section-content">{hospital.address}</p>
          </div>

          {/* Рабочее время */}
          <div className="modal-section">
            <h3 className="modal-section-title">🕐 Рабочее время</h3>
            <p className="modal-section-content">{hospital.workingHours}</p>
          </div>

          {/* Контакты */}
          <div className="modal-section">
            <h3 className="modal-section-title">📞 Контакты</h3>
            <a href={`tel:${hospital.phone}`} className="modal-phone">
              {hospital.phone}
            </a>
          </div>

          {/* Доступные сервисы */}
          <div className="modal-section">
            <h3 className="modal-section-title">💊 Доступные сервисы</h3>
            <div className="modal-services">
              {hospital.tags.map((tag) => (
                <span key={tag} className="modal-service-tag">{tag}</span>
              ))}
            </div>
          </div>

          {/* Описание типа */}
          <div className="modal-section">
            <h3 className="modal-section-title">📋 Информация</h3>
            <p className="modal-section-content">
              {hospital.type === 'Частная'
                ? 'Частное медицинское учреждение с повышенными стандартами обслуживания.'
                : hospital.type === 'Государственная'
                ? 'Государственное медицинское учреждение, заботящееся о здоровье граждан.'
                : 'Многопрофильное медицинское учреждение с широким спектром услуг.'}
            </p>
          </div>
        </div>

        {/* Кнопки действия */}
        <div className="modal-footer">
          <button className="modal-btn-cancel" onClick={onClose}>
            Отмена
          </button>
          <button className="modal-btn-confirm" onClick={() => {
            onConfirm();
            onClose();
          }}>
            Прикрепиться к этой больнице
          </button>
        </div>
      </div>
    </div>
  );
};

export default HospitalModal;
