# 📚 Интеграция MongoDB с Frontend

## ✅ Что было сделано

### 1️⃣ Создан Seed Файл (`backend/seed.js`)
- Содержит 8 больниц с полной информацией
- Команда запуска: `npm run seed`
- Автоматически подключается к MongoDB и добавляет данные

### 2️⃣ Обновлена Model Hospital (`backend/models/Hospital.js`)
Добавлены поля:
```javascript
type: String // 'Государственная', 'Частная', 'Многопрофильный'
reviews: Number // Количество отзывов
tags: [String] // Специализации ['Хирургия', 'Кардиология', ...]
```

### 3️⃣ Обновлен Backend
- CORS конфигурация поддерживает порты 5173 и 5174
- API endpoint `/api/hospitals` возвращает все больницы из БД
- Запуск: `npm run dev` (из папки backend)

### 4️⃣ Обновлен Frontend (`src/components/home.jsx`)
- Удалены статические данные (HOSPITALS массив)
- Добавлен `useEffect` для загрузки данных из API
- Добавлены состояния: `loading`, `error`, `hospitals`
- Все ссылки обновлены: `id` → `_id`, `workTime` → `workingHours`

### 5️⃣ Обновлена Modal (`src/components/HospitalModal.jsx`)
- Использует `workingHours` вместо `workTime`

---

## 🚀 Как запустить

### Шаг 1: Запустить MongoDB
```powershell
# MongoDB должна быть запущена локально на 27017
```

### Шаг 2: Добавить тестовые данные
```powershell
cd backend
npm run seed
```

**Вывод:**
```
✅ Подключено к MongoDB
🗑️  Коллекция больниц очищена
✅ Добавлено 8 больниц

📋 Добавленные больницы:
1. Национальный научный медицинский центр (Астана) - Рейтинг: 4.8
2. Городская больница №2 (Астана) - Рейтинг: 4.2
...
✨ Seed завершен успешно!
```

### Шаг 3: Запустить Backend
```powershell
cd backend
npm run dev
# Слушает на http://localhost:5000
```

### Шаг 4: Запустить Frontend (в новом терминале)
```powershell
npm run dev
# Доступно на http://localhost:5173
```

---

## 📡 API Endpoints

### Получить все больницы
```
GET http://localhost:5000/api/hospitals
```

**Ответ:**
```json
{
  "success": true,
  "count": 8,
  "hospitals": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Национальный научный медицинский центр",
      "city": "Астана",
      "address": "пр. Абылай хана, 42",
      "phone": "+7 (7172) 69-71-98",
      "rating": 4.8,
      "reviews": 312,
      "type": "Многопрофильный",
      "workingHours": "Круглосуточно",
      "tags": ["Хирургия", "Кардиология", "Неврология"],
      "departments": [...],
      "createdAt": "2026-03-30T...",
      "updatedAt": "2026-03-30T..."
    }
    ...
  ]
}
```

### Получить одну больницу
```
GET http://localhost:5000/api/hospitals/:id
```

---

## 🔑 Ключевые изменения

| Файл | Изменение |
|------|-----------|
| `backend/models/Hospital.js` | ➕ `type`, `reviews`, `tags` |
| `backend/seed.js` | ✨ Новый файл с 8 больницами |
| `backend/package.json` | ➕ `"seed": "node seed.js"` |
| `backend/server.js` | 🔧 CORS для портов 5173, 5174 |
| `src/components/home.jsx` | 🔄 API вместо статических данных |
| `src/components/HospitalModal.jsx` | 🔧 `workingHours` вместо `workTime` |

---

## 💾 Поля больницы в БД

```javascript
{
  _id: ObjectId,
  name: String,
  city: String,
  address: String,
  phone: String,
  email: String,
  description: String,
  website: String,
  rating: Number,
  reviews: Number,
  type: String, // Государственная | Частная | Многопрофильный
  workingHours: String,
  tags: [String],
  departments: [{
    name: String,
    specialization: String
  }],
  users: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🐛 Troubleshooting

### Ошибка: `net::ERR_FAILED`
- Убедитесь, что backend запущен на `http://localhost:5000`

### Ошибка: `EADDRINUSE: address already in use :::5000`
```powershell
taskkill /PID <PID> /F
# или
taskkill /F /IM node.exe
```

### MongoDB не подключается
- Убедитесь, что MongoDB запущена: `mongod`
- Проверьте `MONGODB_URI` в `.env`

---

## 📝 Добавление новых больниц

1. Отредактируйте `backend/seed.js` - добавьте объект в `seedHospitals`
2. Запустите `npm run seed` в папке backend
3. Frontend автоматически загрузит новые данные

или

Используйте API POST endpoint:
```
POST http://localhost:5000/api/hospitals
```
