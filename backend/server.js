const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');


dotenv.config();


connectDB();

const app = express();


app.use(cors({
  origin: (origin, callback) => {
    // Разрешаем все локальные порты localhost и 127.0.0.1
    if (!origin || /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Для разработки разрешаем все
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});


app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/hospitals', require('./routes/hospitalRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));


app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'MedApp API работает!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/users',
      hospitals: '/api/hospitals',
      appointments: '/api/appointments'
    }
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Маршрут ${req.originalUrl} не найден`
  });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('Ошибка:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Внутренняя ошибка сервера',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║     🏥 MedApp Backend Server         ║');
  console.log('╠════════════════════════════════════════╣');
  console.log(`║  Сервер запущен на порту: ${PORT}        ║`);
  console.log(`║  Режим: ${process.env.NODE_ENV || 'development'}                  ║`);
  console.log('╚════════════════════════════════════════╝\n');
});

module.exports = app;
