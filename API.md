# 📡 MedApp API Documentation

Полная документация REST API для MedApp приложения.

---

## 🌐 Базовый URL
```
http://localhost:5000/api
```

---

## 🔑 Аутентификация

Все защищённые эндпоинты требуют JWT токен в заголовке:
```
Authorization: Bearer <token>
```

---

## 👤 Endpoints: Users (Аутентификация)

### POST /users/register
**Регистрация нового пользователя**

**Требует:** Нет

**Request:**
```json
{
  "name": "Иванов Иван Иванович",
  "email": "ivan@example.com",
  "password": "password123",
  "phone": "+7 (999) 123-45-67",
  "iin": "123456789012"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Регистрация успешна",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Иванов Иван Иванович",
    "email": "ivan@example.com",
    "phone": "+7 (999) 123-45-67",
    "iin": "123456789012"
  }
}
```

**Ошибки:**
- `400` - Отсутствуют обязательные поля
- `400` - Email уже зарегистрирован
- `500` - Ошибка сервера

---

### POST /users/login
**Вход в систему**

**Требует:** Нет

**Request:**
```json
{
  "email": "ivan@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Вход успешен",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Иванов Иван Иванович",
    "email": "ivan@example.com",
    "phone": "+7 (999) 123-45-67",
    "iin": "123456789012"
  }
}
```

**Ошибки:**
- `400` - Отсутствуют email или пароль
- `400` - Неверный email или пароль
- `500` - Ошибка сервера

---

### GET /users/me
**Получить профиль текущего пользователя**

**Требует:** JWT токен

**Request:**
```
GET /users/me
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Иванов Иван Иванович",
    "email": "ivan@example.com",
    "phone": "+7 (999) 123-45-67",
    "iin": "123456789012"
  }
}
```

**Ошибки:**
- `401` - Токен не найден
- `401` - Токен истёк
- `401` - Невалидный токен

---

### PUT /users/update
**Обновить профиль пользователя**

**Требует:** JWT токен

**Request:**
```json
{
  "name": "Новое Имя",
  "phone": "+7 (999) 987-65-43"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Профиль обновлен",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Новое Имя",
    "email": "ivan@example.com",
    "phone": "+7 (999) 987-65-43",
    "iin": "123456789012"
  }
}
```

---

## 🏥 Endpoints: Hospitals (Больницы)

### GET /hospitals
**Получить список всех больниц с фильтрацией**

**Требует:** Нет

**Query Parameters:**
- `city` (string) - Фильтр по городу
- `rating` (number) - Минимальный рейтинг (0-5)
- `search` (string) - Поиск по названию, адресу или описанию

**Request:**
```
GET /hospitals?city=Астана&rating=4&search=кардиология
```

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "hospitals": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Городская клиника №1",
      "city": "Астана",
      "address": "ул. Республики, 10",
      "phone": "+7 (7172) 123-45-67",
      "email": "clinic1@example.com",
      "description": "Современная многопрофильная клиника",
      "website": "https://clinic1.kz",
      "rating": 4.5,
      "departments": [
        {
          "name": "Кардиология",
          "specialization": "Сердечные заболевания"
        }
      ],
      "workingHours": "09:00 - 18:00",
      "users": [],
      "createdAt": "2026-03-10T10:00:00Z",
      "updatedAt": "2026-03-10T10:00:00Z"
    }
  ]
}
```

---

### GET /hospitals/:id
**Получить информацию об одной больнице**

**Request:**
```
GET /hospitals/507f1f77bcf86cd799439011
```

**Response (200):**
```json
{
  "success": true,
  "hospital": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Городская клиника №1",
    "city": "Астана",
    "address": "ул. Республики, 10",
    "phone": "+7 (7172) 123-45-67",
    "email": "clinic1@example.com",
    "description": "Современная многопрофильная клиника",
    "website": "https://clinic1.kz",
    "rating": 4.5,
    "departments": [
      {
        "name": "Кардиология",
        "specialization": "Сердечные заболевания"
      }
    ],
    "workingHours": "09:00 - 18:00",
    "users": [],
    "createdAt": "2026-03-10T10:00:00Z",
    "updatedAt": "2026-03-10T10:00:00Z"
  }
}
```

**Ошибки:**
- `404` - Больница не найдена

---

### POST /hospitals
**Создать новую больницу (Admin)**

**Требует:** JWT токен

**Request:**
```json
{
  "name": "Новая клиника",
  "city": "Астана",
  "address": "ул. Абая, 50",
  "phone": "+7 (7172) 999-99-99",
  "email": "newclinic@example.com",
  "description": "Многопрофильная клиника",
  "website": "https://newclinic.kz",
  "departments": [
    {
      "name": "Терапия",
      "specialization": "Общие заболевания"
    }
  ],
  "workingHours": "08:00 - 19:00"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Больница создана",
  "hospital": { /* ...данные больницы... */ }
}
```

---

### PUT /hospitals/:id
**Обновить информацию о больнице (Admin)**

**Требует:** JWT токен

**Request:**
```json
{
  "rating": 4.8,
  "description": "Обновленное описание"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Больница обновлена",
  "hospital": { /* ...обновленные данные... */ }
}
```

---

### DELETE /hospitals/:id
**Удалить больницу (Admin)**

**Требует:** JWT токен

**Response (200):**
```json
{
  "success": true,
  "message": "Больница удалена"
}
```

---

## 📅 Endpoints: Appointments (Приёмы)

### GET /appointments
**Получить все приёмы текущего пользователя**

**Требует:** JWT токен

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "appointments": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "user": "507f1f77bcf86cd799439011",
      "hospital": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Городская клиника №1",
        "city": "Астана",
        "address": "ул. Республики, 10",
        "phone": "+7 (7172) 123-45-67"
      },
      "doctor": "Иванов Петр Сергеевич",
      "department": "Кардиология",
      "date": "2026-04-15T10:00:00Z",
      "time": "10:00",
      "complaint": "Боли в груди",
      "status": "scheduled",
      "notes": "",
      "createdAt": "2026-03-15T10:00:00Z",
      "updatedAt": "2026-03-15T10:00:00Z"
    }
  ]
}
```

---

### GET /appointments/:id
**Получить информацию об одном приёме**

**Требует:** JWT токен

**Response (200):**
```json
{
  "success": true,
  "appointment": { /* ...полная информация... */ }
}
```

**Ошибки:**
- `404` - Приём не найден
- `403` - Доступ запрещен (не ваш приём)

---

### POST /appointments
**Создать новый приём**

**Требует:** JWT токен

**Request:**
```json
{
  "hospital": "507f1f77bcf86cd799439011",
  "doctor": "Алексеев Сергей Петрович",
  "department": "Кардиология",
  "date": "2026-04-20T14:00:00Z",
  "time": "14:00",
  "complaint": "Повышенное давление"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Приём создан",
  "appointment": { /* ...полная информация... */ }
}
```

**Ошибки:**
- `400` - Отсутствуют обязательные поля
- `400` - Неверная дата или время

---

### PUT /appointments/:id
**Обновить приём**

**Требует:** JWT токен

**Request:**
```json
{
  "date": "2026-04-22T15:00:00Z",
  "time": "15:00",
  "status": "completed",
  "notes": "Приём прошел успешно"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Приём обновлен",
  "appointment": { /* ...обновленные данные... */ }
}
```

---

### DELETE /appointments/:id
**Отменить приём**

**Требует:** JWT токен

**Response (200):**
```json
{
  "success": true,
  "message": "Приём отменен"
}
```

**Ошибки:**
- `404` - Приём не найден
- `403` - Доступ запрещен

---

## 🔍 Error Handling

### Стандартный формат ошибок

```json
{
  "success": false,
  "message": "Описание ошибки"
}
```

### Коды ошибок

| Код | Значение | Причина |
|-----|---------|---------|
| 400 | Bad Request | Неверные данные в запросе |
| 401 | Unauthorized | Требуется аутентификация |
| 403 | Forbidden | Доступ запрещен |
| 404 | Not Found | Ресурс не найден |
| 500 | Server Error | Ошибка на сервере |

---

## 💡 Примеры использования

### cURL примеры

**Регистрация:**
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Иван Иванов",
    "email": "ivan@test.com",
    "password": "password123",
    "phone": "+7 (999) 123-45-67",
    "iin": "123456789012"
  }'
```

**Получить больницы:**
```bash
curl -X GET "http://localhost:5000/api/hospitals?city=Астана&rating=4"
```

**Создать приём (требует токен):**
```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "hospital": "507f1f77bcf86cd799439011",
    "doctor": "Иванов П.С.",
    "department": "Кардиология",
    "date": "2026-04-20T14:00:00Z",
    "time": "14:00",
    "complaint": "Повышенное давление"
  }'
```

### JavaScript примеры

```javascript
// Регистрация
import authService from './services/authService';

const result = await authService.register({
  name: "Иван Иванов",
  email: "ivan@test.com",
  password: "password123",
  phone: "+7 (999) 123-45-67",
  iin: "123456789012"
});

// Получить больницы
import hospitalService from './services/hospitalService';

const hospitals = await hospitalService.getAll({ 
  city: "Астана",
  rating: 4 
});

// Создать приём
import appointmentService from './services/appointmentService';

const appointment = await appointmentService.create({
  hospital: "507f1f77bcf86cd799439011",
  doctor: "Иванов П.С.",
  department: "Кардиология",
  date: "2026-04-20T14:00:00Z",
  time: "14:00",
  complaint: "Повышенное давление"
});
```

---

**Версия:** 1.0.0
**Дата обновления:** 2026-03-17
