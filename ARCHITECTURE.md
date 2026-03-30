# 🏗️ Архитектура приложения MedApp

## 📊 Общая структура

```
┌─────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND                            │
│  (http://localhost:5173)                                    │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ home.jsx                                                ││
│  │  - Загружает список больниц из API                      ││
│  │  - Отображает карточки больниц                          ││
│  │  - HospitalModal для подробной информации              ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────┬──────────────────────────┘
                                  │
                    HTTP Requests (Axios)
                                  │
┌─────────────────────────────────▼──────────────────────────┐
│                    EXPRESS BACKEND                          │
│  (http://localhost:5000)                                   │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ server.js                                               ││
│  │  - CORS middleware (разрешает localhost:5173,5174)      ││
│  │  - Routes: /api/hospitals                              ││
│  │  CORS Error Handling                                    ││
│  └─────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────┐│
│  │ hospitalRoutes.js                                       ││
│  │  - GET /hospitals - получить все                       ││
│  │  - GET /hospitals/:id - получить одну                  ││
│  │  - POST /hospitals - создать                           ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────┬──────────────────────────┘
                                  │
                    Mongoose Query
                                  │
┌─────────────────────────────────▼──────────────────────────┐
│                    MONGODB                                 │
│  (mongodb://localhost:27017/MedApp)                        │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Collection: hospitals                                   ││
│  │  - Документы с информацией о больницах                 ││
│  │  - Fields: name, city, address, phone, rating, etc     ││
│  │                                                         ││
│  │ Seed файл заполняет коллекцию начальными данными      ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Поток данных

### 1️⃣ Инициализация (Первый запуск)
```
$ npm run seed
↓
seed.js подключается к MongoDB
↓
Очищает коллекцию hospitals
↓
Вставляет 8 документов из seedHospitals
↓
✅ MongoDB содержит данные
```

### 2️⃣ Запуск приложения
```
$ npm run dev (backend)
↓
Express слушает :5000
↓
CORS разрешает localhost:5173, localhost:5174
↓
✅ Backend готов к запросам
```

### 3️⃣ Загрузка Frontend
```
$ npm run dev (frontend)
↓
React приложение загружается на :5173
↓
Home.jsx компонент монтируется
↓
useEffect триггерится
↓
hospitalService.getAll() вызывает API
```

### 4️⃣ Запрос данных
```
Frontend:
  hospitalService.getAll()
  ↓
  axios.get('/hospitals')
  ↓
  HTTP GET http://localhost:5000/api/hospitals
  ↓
Backend:
  hospitalRoutes.js слушает GET /hospitals
  ↓
  Hospital.find(query) из MongoDB
  ↓
  Возвращает JSON ответ
  ↓
Frontend:
  response.hospitals содержит массив документов
  ↓
  setHospitals(response.hospitals)
  ↓
  Компонент перерендеривается с новыми данными
```

---

## 📁 Ключевые файлы

### Frontend

#### `src/components/home.jsx`
```javascript
// Состояния для работы с API
const [hospitals, setHospitals] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

// useEffect загружает данные при монтировании
useEffect(() => {
  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const response = await hospitalService.getAll();
      setHospitals(response.hospitals || response || []);
    } catch (err) {
      setError('Не удалось загрузить список больниц');
    } finally {
      setLoading(false);
    }
  };
  fetchHospitals();
}, []);

// Фильтрация работает с динамическими данными
const filtered = hospitals.filter(h => {
  const matchSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase());
  const matchType = filterType === 'Все' || h.type === filterType;
  return matchSearch && matchType;
});
```

#### `src/services/hospitalService.js`
```javascript
const hospitalService = {
  getAll: async (filters = {}) => {
    const response = await api.get(`/hospitals?...`);
    return response.data; // { hospitals: [...] }
  }
};
```

### Backend

#### `backend/models/Hospital.js`
```javascript
{
  name: String (required),
  city: String,
  address: String,
  phone: String,
  email: String,
  description: String,
  rating: Number (0-5),
  reviews: Number,
  type: String ('Государственная' | 'Частная' | 'Многопрофильный'),
  workingHours: String,
  tags: [String],
  departments: [{name, specialization}],
  users: [ObjectId],
  timestamps: true
}
```

#### `backend/routes/hospitalRoutes.js`
```javascript
// GET /hospitals - получить все больницы
router.get('/', async (req, res) => {
  const hospitals = await Hospital.find(query);
  res.status(200).json({ success: true, hospitals });
});

// GET /hospitals/:id - получить одну
router.get('/:id', async (req, res) => {
  const hospital = await Hospital.findById(req.params.id);
  res.status(200).json({ success: true, hospital });
});
```

#### `backend/seed.js`
```javascript
const seedHospitals = [
  {name, city, address, phone, email, ...},
  ...
];

// Запускается с: npm run seed
seedDatabase();
```

---

## 🔍 Отображение на Frontend

### До (статические данные)
```javascript
const HOSPITALS = [
  {id: 1, name: '...', ...},
  {id: 2, name: '...', ...},
]
```

### После (динамические данные из БД)
```javascript
// home.jsx использует API
useEffect(() => {
  const response = await hospitalService.getAll();
  setHospitals(response.hospitals);
}, []);
```

---

## ⚙️ Конфигурация

### Backend `.env`
```
MONGODB_URI=mongodb://localhost:27017/MedApp
JWT_SECRET=MedApp2026_Secret_Key_For_Production_Use_Only
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### CORS настройка (`server.js`)
```javascript
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      process.env.CLIENT_URL
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS не разрешен'));
    }
  },
  credentials: true
}));
```

---

## 📝 Жизненный цикл на Frontend

```
1. Пользователь открывает /home
   ↓
2. Home компонент монтируется
   ↓
3. useEffect запускается один раз (зависимость [])
   ↓
4. hospitalService.getAll() отправляет запрос
   ↓
5. Loading = true (показываем "Загрузка...")
   ↓
6. API возвращает { hospitals: [...] }
   ↓
7. setHospitals(response.hospitals)
   ↓
8. Loading = false
   ↓
9. Компонент перерендеривается с данными из БД
   ↓
10. Показываем карточки больниц
   ↓
11. Пользователь нажимает на больницу и видит модаль
```

---

## 🛠️ Добавление нового функционала

### Чтобы добавить поле в Big Medicine

1. **Backend: обновить model**
```javascript
// hospital.js
{
  newField: {
    type: String,
    required: true
  }
}
```

2. **Backend: обновить seed данные**
```javascript
// seed.js
const seedHospitals = [
  {
    ...,
    newField: 'value'
  }
];
```

3. **Backend: запустить seed**
```bash
npm run seed
```

4. **Frontend: использовать новое поле**
```javascript
// home.jsx
<p>{hospital.newField}</p>

// HospitalModal.jsx
<p>{hospital.newField}</p>
```

---

## 🚀 Production Deployment

### На production нужно:
1. Проверить CORS origins в `.env`
2. Использовать MongoDB Atlas вместо локальной
3. Использовать production URL в `CLIENT_URL`
4. Скрыть JWT_SECRET в переменных окружения
5. Включить HTTPS
6. Добавить rate limiting
7. Добавить логирование

---

## 📞 Контакты для запросов

- **Frontend Port**: 5173
- **Backend Port**: 5000
- **MongoDB Port**: 27017
- **API Base**: http://localhost:5000/api
