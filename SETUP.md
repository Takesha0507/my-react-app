# 🏥 MedApp - Руководство по запуску

Полное руководство по запуску и использованию приложения MedApp (Система онлайн записи к врачам).

---

## 📋 Требования

- **Node.js** v14+ и **npm** v6+
- **MongoDB** запущенный локально или облачная версия (MongoDB Atlas)
- **Git**

---

## 🚀 Быстрый старт

### 1️⃣ Клонирование и установка

```bash
# Клонируем проект (если необходимо)
git clone <repository-url>
cd my-react-app

# Устанавливаем зависимости фронтенда
npm install

# Переходим в папку backend и устанавливаем зависимости
cd backend
npm install
cd ..
```

---

### 2️⃣ Настройка окружения

#### Frontend (.env файл не требуется)
API URL жестко прописан: `http://localhost:5000/api`

#### Backend (backend/.env)
```env
MONGODB_URI=mongodb://localhost:27017/MedApp
JWT_SECRET=MedApp2026_Secret_Key_For_Production_Use_Only
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

### 3️⃣ Запуск MongoDB

**Вариант 1: Локальный MongoDB**
```bash
# Windows
mongod

# Mac/Linux
brew services start mongodb-community
```

**Вариант 2: MongoDB Atlas (облако)**
```env
# Замените в backend/.env:
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/MedApp
```

---

### 4️⃣ Запуск приложения

**Терминал 1 - Запуск Backend**
```bash
cd backend
npm run dev
# или
npm start
```

Вывод:
```
╔════════════════════════════════════════╗
║     🏥 MedApp Backend Server         ║
╠════════════════════════════════════════╣
║  Сервер запущен на порту: 5000        ║
║  Режим: development                   ║
╚════════════════════════════════════════╝
```

**Терминал 2 - Запуск Frontend**
```bash
npm run dev
```

Вывод:
```
  VITE v4.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

---

## 📚 Архитектура проекта

### Структура Frontend (React + Vite)
```
src/
├── components/          # React компоненты
│   ├── login.jsx       # Форма входа
│   ├── RegistrationForm.jsx  # Форма регистрации
│   ├── home.jsx        # Главная страница
│   ├── profile.jsx     # Профиль пользователя
│   ├── content1.jsx    # Страница клиник
│   └── content2.jsx    # Страница о приложении
├── services/           # Сервисы API
│   ├── api.js          # Axios конфигурация
│   ├── authService.js  # Сервис аутентификации
│   ├── hospitalService.js  # Сервис работы с больницами
│   └── appointmentService.js # Сервис работы с приёмами
├── App.jsx            # Главный компонент
└── main.jsx           # Точка входа
```

### Структура Backend (Express + MongoDB)
```
backend/
├── config/
│   └── db.js          # Конфигурация MongoDB
├── models/
│   ├── User.js        # Схема пользователя
│   ├── Hospital.js    # Схема больницы
│   └── Appointment.js # Схема приёма
├── routes/
│   ├── authRoutes.js       # Маршруты аутентификации
│   ├── hospitalRoutes.js   # Маршруты больниц
│   └── appointmentRoutes.js # Маршруты приёмов
├── middleware/
│   └── authMiddleware.js   # Проверка JWT токена
└── server.js          # Главный файл сервера
```

---

## 🔐 Аутентификация

### Регистрация
```javascript
POST /api/users/register
Body: {
  name: "Иванов Иван",
  email: "ivan@example.com",
  password: "password123",
  phone: "+7 (123) 456-78-90",
  iin: "123456789012"
}
Response: {
  token: "jwt_token_here",
  user: { id, name, email, phone, iin }
}
```

### Вход
```javascript
POST /api/users/login
Body: {
  email: "ivan@example.com",
  password: "password123"
}
Response: {
  token: "jwt_token_here",
  user: { id, name, email, phone, iin }
}
```

### Использование токена
Токен автоматически добавляется во все запросы через Axios interceptor:
```javascript
Authorization: Bearer <token>
```

---

## 🏥 API Endpoints

### Users (Аутентификация)
- `POST /api/users/register` - Регистрация
- `POST /api/users/login` - Вход
- `GET /api/users/me` - Получить текущего пользователя *(требует токен)*
- `PUT /api/users/update` - Обновить профиль *(требует токен)*

### Hospitals (Больницы)
- `GET /api/hospitals` - Получить все больницы (фильтры: city, rating, search)
- `GET /api/hospitals/:id` - Получить больницу по ID
- `POST /api/hospitals` - Создать больницу *(требует токен)*
- `PUT /api/hospitals/:id` - Обновить больницу *(требует токен)*
- `DELETE /api/hospitals/:id` - Удалить больницу *(требует токен)*

### Appointments (Приёмы)
- `GET /api/appointments` - Получить приёмы пользователя *(требует токен)*
- `GET /api/appointments/:id` - Получить приём по ID *(требует токен)*
- `POST /api/appointments` - Создать приём *(требует токен)*
- `PUT /api/appointments/:id` - Обновить приём *(требует токен)*
- `DELETE /api/appointments/:id` - Отменить приём *(требует токен)*

---

## 🧪 Тестирование

### Пример вызова с curl

**Регистрация:**
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Тест Пользователь",
    "email": "test@example.com",
    "password": "password123",
    "phone": "+7 (999) 999-99-99",
    "iin": "123456789012"
  }'
```

**Вход:**
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Получить больницы:**
```bash
curl -X GET "http://localhost:5000/api/hospitals?city=Астана&rating=4"
```

---

## 🔧 Основные интеграции

### Frontend → Backend

1. **Аутентификация**
   - `authService.register()` → `POST /api/users/register`
   - `authService.login()` → `POST /api/users/login`
   - `authService.logout()` → Удаляет токен из localStorage

2. **Больницы**
   - `hospitalService.getAll()` → `GET /api/hospitals`
   - `hospitalService.getById(id)` → `GET /api/hospitals/:id`

3. **Приёмы**
   - `appointmentService.getAll()` → `GET /api/appointments`
   - `appointmentService.create()` → `POST /api/appointments`
   - `appointmentService.cancel()` → `DELETE /api/appointments/:id`

---

## 📱 Использование в компонентах

### Пример: Использование hospitalService
```javascript
import hospitalService from '../services/hospitalService';

const HospitalList = () => {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    hospitalService.getAll({ city: 'Астана' })
      .then(data => setHospitals(data.hospitals))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      {hospitals.map(h => (
        <div key={h._id}>{h.name}</div>
      ))}
    </div>
  );
};
```

---

## 🐛 Решение проблем

### MongoDB не подключается
```bash
# Проверьте, запущен ли mongod
mongod --version

# Попробуйте переподключиться
net stop MongoDB
net start MongoDB  # Windows

# Или используйте MongoDB Atlas
```

### CORS ошибки
Убедитесь, что в backend/.env:
```env
CLIENT_URL=http://localhost:5173
```

### Токен истёк
При получении 401 ошибки, пользователь будет перенаправлен на страницу регистрации автоматически.

---

## 📝 Переменные окружения

### Backend (.env)
| Переменная | Значение | Описание |
|-----------|---------|------------|
| `MONGODB_URI` | `mongodb://localhost:27017/MedApp` | Строка подключения к БД |
| `JWT_SECRET` | `MedApp2026_Secret_Key_...` | Секретный ключ для токенов |
| `PORT` | `5000` | Порт сервера |
| `CLIENT_URL` | `http://localhost:5173` | URL фронтенда |
| `NODE_ENV` | `development` | Окружение |

---

## 🎯 Функциональность приложения

✅ **Реализовано:**
- ✔ Регистрация и вход пользователей
- ✔ JWT аутентификация
- ✔ Хранение токенов в localStorage
- ✔ Защищённые маршруты
- ✔ Получение списка больниц
- ✔ Фильтрация больниц по городу и рейтингу
- ✔ Создание и управление приёмами
- ✔ Профиль пользователя

📋 **Дополнительно можно добавить:**
- 📌 Оценка и отзывы о больницах
- 📌 Расписание врачей и свободные слоты
- 📌 Email уведомления о приёмах
- 📌 Панель администратора
- 📌 SMS подтверждение

---

## 📞 Поддержка

Для вопросов и проблем создавайте Issues в репозитории.

---

**Версия:** 1.0.0
**Дата обновления:** 2026-03-17
**Автор:** MedApp Team
